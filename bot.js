const ServerType = 'PARTNERED_SERVER_OWNER'
/* 
    Set ServerType to one of the values from https://discord.com/developers/docs/resources/user#user-object-user-flags
    Eg;
        Partner Only Server: PARTNERED_SERVER_OWNER
        Certified Moderator Only Server: DISCORD_CERTIFIED_MODERATOR
*/


const logChannelID = '847531207482802176' 
//The ID of the channel where you'd like faild joins to be displayed

//Required Stuff
const fs = require('fs');
const { Client } = require('discord.js');
const Discord = require('discord.js');
const client = new Client({ ws: { intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_MEMBERS', 'GUILD_MESSAGE_REACTIONS'] } });
const { prefix, token } = require('./config.json');
const guildInvites = new Map();
const wait = require('util').promisify(setTimeout);

//Cooldowns and commands collections
client.commands = new Discord.Collection();
client.cooldowns = new Discord.Collection();

//Command Handler
const commandFolders = fs.readdirSync('./commands');
for (const folder of commandFolders) {
	const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const command = require(`./commands/${folder}/${file}`);
		client.commands.set(command.name, command);
	}
}

//Invite Tracker
client.on('inviteCreate', async invite => guildInvites.set(invite.guild.id,await invite.guild.fetchInvites()))
client.once('ready', async () => {
    client.guilds.cache.forEach(guild =>{
        guild.fetchInvites()
            .then(invites => guildInvites.set(guild.id, invites))
            .catch(err => console.log(err))
    });
});

//Event Handler
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args, client, guildInvites));
	} else {
		client.on(event.name, (...args) => event.execute(...args, client, guildInvites));
	}
}

//this checks if the new user matches the badge criteria
client.on("guildMemberAdd", async (member) => {
    const badges = member.user.flags.toArray()
    if (!badges.includes("PARTNERED_SERVER_OWNER")) {
       const cachedInvites = guildInvites.get(member.guild.id);
       const newInvites = await member.guild.fetchInvites();
       guildInvites.set(member.guild.id, newInvites);
       const nonPartnerEmbedDM = new Discord.MessageEmbed()
       .setTitle(`<:warning:847512140557320232> Non-Partner Join`)
       .setDescription(`Hello ${member.displayName}!\nUnfortunately we had to kick you from the **${member.guild.name} Server** since you are not a Discord Partner.\nIf you would like to know more about the Discord Partner Program, you can read up about it here; <https://discord.com/partners/>`)
       .setImage('https://cdn.discordapp.com/attachments/756644176795533334/847276996564353054/Embed_width.png')
       .setColor('#E63C3C')
       try {
        const usedInvite = newInvites.find(inv => cachedInvites.get(inv.code).uses <inv.uses);
        const nonPartnerEmbed = new Discord.MessageEmbed()
        .setTitle(`<:warning:847512140557320232> Non-Partner Join`)
        .setDescription(`${member.user.tag} joined using invite code ${usedInvite.code} from ${usedInvite.inviter.tag}. Invite was used ${usedInvite.uses} times since its creation.`)
        .setImage('https://cdn.discordapp.com/attachments/756644176795533334/847276996564353054/Embed_width.png')
        .setColor('#E63C3C')
	    .setTimestamp()
	    .setFooter('Attempted:');
        member.send(nonPartnerEmbedDM)
        client.channels.cache.get(logChannelID).send(nonPartnerEmbed);
        try {
            await wait(1000);
            member.kick();
        }catch(err){
            client.channels.cache.get(logChannelID).send(`<@847442076911534171> failed to kick ${member.user.tag} (${member.id})`);
        }
       }catch(err){
            member.send(nonPartnerEmbedDM)
            try {
                await wait(1000);
                member.kick();
            }catch(err){
                client.channels.cache.get(logChannelID).send(`<@847442076911534171> failed to kick ${member.user.tag} (${member.id})`);
            }
            const faildInviteEmbedLog = new Discord.MessageEmbed()
            .setTitle(`??? Non-Partner Join from New Invite`)
            .setDescription(`kicked ${member.user.tag} (${member.id}) who joined using a brand new invite! Check the Audit Logs!`)
            .setImage('https://cdn.discordapp.com/attachments/756644176795533334/847276996564353054/Embed_width.png')
            .setColor('#e6d03c')
            .setTimestamp()
            .setFooter('Attempted:');
            client.channels.cache.get(logChannelID).send(faildInviteEmbedLog);
       }
    }else{
        member.roles.add('847442832985423872')
        const PartnerEmbed = new Discord.MessageEmbed()
            .setTitle(`<a:partner:847512016171565067> A new Partner has arrived!`)
            .setDescription(`Everyone say hi to ${member.displayName}!`)
            .setImage('https://cdn.discordapp.com/attachments/756644176795533334/847276996564353054/Embed_width.png')
            .setColor('#2F3136')
            .setThumbnail('https://cdn.discordapp.com/attachments/756644176795533334/847545481982115880/wumpus_wave.gif')
        client.channels.cache.get('847437831068188726').send(PartnerEmbed);
    }
});

client.on('message', message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();

	const command = client.commands.get(commandName)
		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) return;

	if (command.guildOnly && message.channel.type === 'dm') {
		return message.reply('I can\'t execute that command inside DMs!');
	}

	if (command.permissions) {
		const authorPerms = message.channel.permissionsFor(message.author);
		if (!authorPerms || !authorPerms.has(command.permissions)) {
			return message.reply('You can not do this!');
		}
	}

	if (command.args && !args.length) {
		let reply = `You didn't provide any arguments, ${message.author}!`;

		if (command.usage) {
			reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
		}

		return message.channel.send(reply);
	}

	const { cooldowns } = client;

	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Discord.Collection());
	}

	const now = Date.now();
	const timestamps = cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || 3) * 1000;

	if (timestamps.has(message.author.id)) {
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
		}
	}

	timestamps.set(message.author.id, now);
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

	try {
		command.execute(client, message, args);
	} catch (error) {
		console.error(error);
		message.reply('there was an error trying to execute that command!');
	}
});

client.login(token);