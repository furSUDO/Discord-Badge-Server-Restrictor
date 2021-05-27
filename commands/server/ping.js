module.exports = {
	name: 'ping',
	description: 'Ping!',
	cooldown: 5,
	execute(client, message) {
		message.channel.send(`🏓Latency is ${message.createdTimestamp-Date.now()}ms. API Latency is ${Math.round(client.ws.ping)}ms`);
	},
};