const Discord = require('discord.js');
module.exports = {
	name: 'emit',
	description: 'Display info about this server.',
	execute(client) {
		const PartnerEmbed = new Discord.MessageEmbed()
            .setTitle(`<a:partner:847512016171565067> A new Partner has arrived!`)
            .setDescription(`Everyone say hi to SUDO!`)
            .setImage('https://cdn.discordapp.com/attachments/756644176795533334/847276996564353054/Embed_width.png')
            .setColor('#2F3136')
            .setThumbnail('https://cdn.discordapp.com/attachments/756644176795533334/847545481982115880/wumpus_wave.gif')
        client.channels.cache.get('847437831068188726').send(PartnerEmbed);
	},
};