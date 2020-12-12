const { prefix } = require('../config.json');
module.exports = {
	name: 'help',
	description: 'Gives a list of all available commands! Use !help <command> to get more information about a specific command!',
	execute(message, args) {
		message.author.send(`Here is a list of all available commands! Use ${prefix}help <command> to get more information about a specific command!`);
	},
};