/*
    Code taken and adapted from: https://discordjs.guide/popular-topics/canvas.html#windows
    List of things to do with Announcements:
*/
const {prefix} = require("../config.json");
let channelId = '';
module.exports = {
	name: 'announce',
	description: `Use the bot to send an announcement message! See \`${prefix}announce help\` for more info!`,
    permissions: 'ADMINISTRATOR',
    permissionsError: 'You do not have the roles to use this command!',
    execute(client, message, args) {
		if (args[0] === `setchannel`) {
            setchannel(message, args[1]);
        }
        else if (args[0] === `setmessage`) {
            setmessage(message, args);
        }
        else if (args[0] === undefined || args[0] === `help`) {
            help(message);
        }
        else {
            message.reply(`**Incorrect syntax, check ${prefix}announce help for more information about ${prefix}announce commands.**`);
        }
	},
};

function setmessage(message, args) {
	const channel = message.guild.channels.cache.get(channelId);
	if (!channel) return console.log("ERROR, No channel has been set!");
	let replyMsg = `***New Announcement!***\n`
        for (const value of args) {
			if (value != `setmessage`) //There is most likely a better way to ignore the first argument.
            replyMsg += value + ` `;
		}
		try {
			channel.send(replyMsg);
		}
		catch {
			message.reply("There was an error in sending the announcement!");
		}
}

function setchannel(message, channel) {//Sets the channel to display welcome messages using the channelId
    var channelValue = channel.replace('<', ''); //Removes the Discord <#> from the message, if it exists.
    channelValue = channelValue.replace('>', '');
    channelValue = channelValue.replace('#', '');
    
	if (message.guild.channels.cache.get(channelValue) === undefined) return console.log(`ERROR, The channel, ${channel} does not exist!`);
    //If the channel doesn't exists, reply with a message, otherwise, set the channel ID;
    try {
        channelId = channelValue;
        message.reply("The channel has been set to " + channel);
        }
    catch {
            message.reply("There was an error setting the channel to " + channel);
    }
}

function help(message) { // Skips the current song and goes to the next one (if there is another)
    message.author.send(`***Announce Command List: To use announce commands, do*** \`${prefix}announce [command] <args>\`
    \n\`setchannel <#channel>\` Sets the channel to display the welcome message!
    \n\`setmessage <message>\` Send an announcement through the bot! ***NOTE: THIS COMMAND WILL SEND THE MESSAGE, SO MAKE SURE YOUR MESSAGE IS PLANNED OUT CORRECTLY BEFOREHAND!***`);
}