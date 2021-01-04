const prefix = require('../config.json');
module.exports = {
	name: 'twitch',
	description: `Use the bot to send an announcement message! See \`${prefix}announce help\` for more info!`,
    permissions: 'ADMINISTRATOR',
    permissionsError: 'You do not have the roles to use this command!',
    execute(client, message, args) {

	},
};