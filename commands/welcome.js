/*
    Code taken and adapted from: https://discordjs.guide/popular-topics/canvas.html#windows
    List of things to do with Welcome Bot:
    [X] Set welcome text
    [] Add images
    [] Current member count
    [X] Set channel
    [] Change current fonts and etc.
*/
const {prefix} = require("../config.json");
const Discord = require('discord.js');
const Canvas = require('canvas');
let channelId = '';
let serverMsg = '';
module.exports = { 
    name: 'welcome',
    description: `Personalize the way you welcome people to your discord channel! See \`${prefix}welcome help\` for more info!`,
    aliases: ['welcome', 'w'],
    permissions: 'ADMINISTRATOR',
    permissionsError: 'You do not have the roles to use this command!',
	execute(client, message, args) {
        if (args[0] === `setchannel`) {
            setchannel(message, args[1]);
        }
        else if (args[0] === `send`) {
            send(message, args);
        }
        else if (args[0] === undefined || args[0] === `help`) {
            help(message);
        }
        else {
            message.reply(`**Incorrect syntax, check ${prefix}welcome help for more information about ${prefix}welcome commands.**`);
        }
    },
    async executeWelcome(member) {
        const channel = member.guild.channels.cache.get(channelId);
	    if (!channel) return console.log("ERROR, No channel has been set or the old channel has been removed!");

	    const canvas = Canvas.createCanvas(700, 250);
	    const ctx = canvas.getContext('2d');

	    const background = await Canvas.loadImage('./wallpaper.jpg');
	    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

	    ctx.strokeStyle = '#74037b';
	    ctx.strokeRect(0, 0, canvas.width, canvas.height);

	    // Slightly smaller text placed above the member's display name
	    ctx.font = '28px sans-serif';
	    ctx.fillStyle = '#ffffff';
	    ctx.fillText('Welcome to the server,', canvas.width / 2.5, canvas.height / 3.5);

	    // Add an exclamation point here and below
	    ctx.font = applyText(canvas, `${member.displayName}!`);
	    ctx.fillStyle = '#ffffff';
	    ctx.fillText(`${member.displayName}!`, canvas.width / 2.5, canvas.height / 1.8);

	    ctx.beginPath();
	    ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
	    ctx.closePath();
	    ctx.clip();

	    const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ format: 'jpg' }));
	    ctx.drawImage(avatar, 25, 25, 200, 200);

	    const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'welcome-image.png');

	    channel.send(serverMsg.replace(`{user}`, `${member}`).replace(`{server}`, `${member.guild.name}`), attachment);
	},
};

function help(message) { // Skips the current song and goes to the next one (if there is another)
    message.author.send(`***Welcome Command List: To use welcome commands, do*** \`${prefix}welcome [command] <args>\`
    \n\`setchannel <#channel>\` Sets the channel to display the welcome message!
    \n\`send <message>\` Sets the message to display! To @ the user in the message, use {user}! If you change your server name often, considering using {server} so you don't need to change the message when you change the name!`);
}

function setchannel(message, channel) {//Sets the channel to display welcome messages using the channelId
    var channelValue = channel.replace('<', ''); //Removes the Discord <#> from the message, if it exists.
    channelValue = channelValue.replace('>', '');
    channelValue = channelValue.replace('#', '');
    
	if (message.guild.channels.cache.get(channelValue) === undefined) message.reply(`ERROR, The channel, ${channel} does not exist!`);
    //If the channel doesn't exists, reply with a message, otherwise, set the channel ID;
    try {
        channelId = channelValue;
        message.reply("The welcome channel has been set to " + channel);
        }
    catch {
            message.reply("There was an error setting the channel to " + channel);
    }
}
function send(message, args) {
    try {
        for (const value of args) {
            if (value != `send`) //There is most likely a better way to ignore the first argument.
                serverMsg += value + ` `;
        }
        message.reply("The message has been set to :\n" + serverMsg);
    }
    catch {
        message.reply("ERROR, Cannot set the message");
    }
}

const applyText = (canvas, text) => {
	const ctx = canvas.getContext('2d');

	// Declare a base size of the font
	let fontSize = 70;

	do {
		// Assign the font to the context and decrement it so it can be measured again
		ctx.font = `${fontSize -= 10}px sans-serif`;
		// Compare pixel width of the text to the canvas minus the approximate avatar size
	} while (ctx.measureText(text).width > canvas.width - 300);

	// Return the result to use in the actual canvas
	return ctx.font;
};
