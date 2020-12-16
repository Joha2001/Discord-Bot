/*
    Code taken and adapted from: https://discordjs.guide/creating-your-bot/#replying-to-messages
	List of things to do with Help Bot:
	[X] Nothing LOL
*/
module.exports = {
	name: 'ping',
	description: 'Return pong!',
	execute(client, message, args) {
		message.channel.send('Pong.');
	},
};