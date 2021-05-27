module.exports = {
	name: 'welcomeembed',
    alias:'we',
	cooldown: 0,
	args: false,
	permissions: 'BAN_MEMBERS',
	execute(client, message) {
        message.client.api.channels(message.channel.id).messages.post({
			data: {
				embed: {
					color: 3092790,
					image:{url:'https://cdn.discordapp.com/attachments/756644176795533334/847475181211484230/Rules.png'} ,
				},
			},
		});
		message.client.api.channels(message.channel.id).messages.post({
			data: {
				embed: {
					title: "<:warning:847512140557320232> Just a disclaimer <:warning:847512140557320232>",
					color: 3092790,
					description: `This server is not the offical Discord Partner Server! If you wish to contact discord staff, that should be done via the official server or by writing to <https://dis.gd/cprog/>.`,
					image:{url:'https://cdn.discordapp.com/attachments/756644176795533334/847276996564353054/Embed_width.png'} ,
				},
			},
		});
        message.client.api.channels(message.channel.id).messages.post({
			data: {
				embed: {
					title: "<:cheer:847513414687260673> Welcome to the Cool Discord Partner Server! <:cheer:847513414687260673>",
					color: 3092790,
					description: `You’ve been invited here! You and your community are cool! This server is used for connecting with other Discord Partners, sharing knowledge, and collaborating together!`,
					image:{url:'https://cdn.discordapp.com/attachments/756644176795533334/847276996564353054/Embed_width.png'} ,
				},
			},
		});
        message.client.api.channels(message.channel.id).messages.post({
			data: {
				embed: {
					title: "<a:partner:847512016171565067> While you are here, follow these rules <a:partner:847512016171565067>",
					color: 3092790,
					description: `<:verified:847512052523335731> Keep the server safe for work & please remember that spamming is a no-no.\n<:verified:847512052523335731> Please remember to treat all fellow partners and other members with respect. Breaking this rule or any of the rules listed here may result in a removal from this server.`,
					image:{url:'https://cdn.discordapp.com/attachments/756644176795533334/847276996564353054/Embed_width.png'} ,
				},
			},
		});
        message.client.api.channels(message.channel.id).messages.post({
			data: {
				embed: {
					title: "<:wumpuscozy:847512091640201257> Get Cozy!",
					color: 3092790,
					description: `Feel free to introduce yourself and tell us a little about yourself and your server in <#847454075460386886> and don't forget to grab a fancy role in <#847478303723487312> in order to unlock more of the server.`,
					image:{url:'https://cdn.discordapp.com/attachments/756644176795533334/847276996564353054/Embed_width.png'} ,
				},
				components: [
					{
						type: 1,
							components: [
								{
									type: 2,
									label: "Roles",
									style: 5,
									url: "https://discord.com/channels/847437831068188723/847478303723487312",
									emoji: {
										"id": "847512091640201257",
										"name": "wumpuscozy",
										"animated": false
										},
								},
								{
									type: 2,
									label: "Share Your Server!",
									style: 5,
									url: "https://discord.com/channels/847437831068188723/847454075460386886",
									emoji: {
									"id": "847513414687260673",
										"name": "cheer",
										"animated": false
										},
								},
								{
									type: 2,
									label: "Resources",
									style: 5,
									url: "https://discord.com/channels/132251458665054209/834280055358226483",
									emoji: {
									"id": "847512052523335731",
										"name": "verified",
										"animated": false
										},
								},
							],
					},
				],
			},
		});
	},
};