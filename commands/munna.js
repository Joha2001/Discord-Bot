/*
    This is a joke section xd.
*/
const {prefix} = require("../config.json");
let cookieCount = 0;
module.exports = {
	name: 'munna',
    description: `All hail king Munna! See \`${prefix}munna help\` for more info!`,
    permissions: 'SEND_MESSAGES',
    permissionsError: 'You do not have the roles to use this command!',
	execute(client, message, args) {
		if (args[0] === `cookie`) {
            cookie(message);
        }
        else if (args[0] === `worship`) {
            worship(message);
        }
        else if (args[0] === undefined || args[0] === `help`) {
            help(message);
        }
        else {
            message.reply(`**Incorrect syntax, check ${prefix}munna help for more information about ${prefix}munna commands.**`);
        }
	},
};

function cookie(message, args) {
    cookieCount++;
	message.reply("A cookie to the man, the myth, OUR LEGEND, MUNNA. 🍪\nCookie Count: " + cookieCount);
}

function worship(message) {
    message.reply("🙏 You are worshipping Munna 🙏");
}

function help(message) { 
    message.author.send(`***Munna Command List: To use munna commands, do*** \`${prefix}munna [command] <args>\`
    \n\`cookie\` Give Munna a cookie
    \n\`worship\` Worship Munna`);
}