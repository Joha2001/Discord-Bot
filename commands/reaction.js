/*
    Code taken and adapted from: https://www.youtube.com/watch?v=bJwPYCy17G4
    List of things to do with Reaction Bot:
    [] Embeds
    
*/
const {prefix} = require("../config.json");
let channelId = '';
let messageId = '';
var emojis = [];
module.exports = { 
    name: 'reaction',
    description: `Personalize the way you welcome people to your discord channel! See \`${prefix}welcome help\` for more info!`,
    aliases: ['welcome', 'w'],
    permissions: 'ADMINISTRATOR',
    permissionsError: 'You do not have the roles to use this command!',
	execute(client, message, args) {
        if (args[0] === `setchannel`) {
            setchannel(message, args[1]);
        }
        else if (args[0] === `setmessage`) {
            setmessage(message, args[1]);
        }
        else if (args[0] === `add`) {
            add(message, args);
        }
        else if (args[0] === `remove`) {
            remove(message, args);
        }
        else if (args[0] === undefined || args[0] === `help`) {
            help(message);
        }
        else {
            message.reply(`**Incorrect syntax, check ${prefix}reaction help for more information about ${prefix}reaction commands.**`);
        }
    },
    async executeReaction(reaction, user, add) {
        if (reaction.message.channel.id === channelId) {
            const emoji = reaction._emoji.name;
            const {guild} = reaction.message;

            const roleName = emojis[emoji];
            if (!roleName) {
                return ;
            }
            const role = guild.roles.cache.find((role) => role.name === roleName);
            const member = guild.members.cache.find((member) => member.id === user.id);
            if (add) {
                member.roles.add(role);
            }
            else {
                member.roles.remove(role);
            }
        }
    },
};

function help(message) { // Skips the current song and goes to the next one (if there is another)
    message.author.send(`***Reactions Command List: To use reaction commands, do*** \`${prefix}reaction [command] <args>\`
    \n\`setchannel <#channel>\` Sets the channel for reaction roles!
    \n\`setmessage <message>\` Sets the message that members will react to!
    \n\`add <emoji> <role>\` Add an emoji that will give a role!
    \n\`remove <emoji>\` Remove an emoji that gives a role!
    `);
}

function setchannel(message, channel) {//Sets the channel to display welcome messages using the channelId
    var channelValue = channel.replace('<', ''); //Removes the Discord <#> from the message, if it exists.
    channelValue = channelValue.replace('>', '');
    channelValue = channelValue.replace('#', '');
    
	if (message.guild.channels.cache.get(channelValue) === undefined) return message.reply(`ERROR, The channel, ${channel} does not exist!`);
    //If the channel doesn't exists, reply with a message, otherwise, set the channel ID;
    try {
        channelId = channelValue;
        message.reply("The reactions channel has been set to " + channel);
        }
    catch {
            message.reply("There was an error setting the channel to " + channel);
    }
}
async function setmessage(message, msg) {
    var messageValue = msg.replace('<', ''); //Removes the Discord <#> from the message, if it exists.
    messageValue = messageValue.replace('>', '');
    messageValue = messageValue.replace('#', '');
    try {
        const channel = message.guild.channels.cache.get(channelId);
        try {
            await channel.messages.fetch(messageValue);
        }
        catch {
            return message.reply("***That message does not exist or no longer exists!***");
        }
        messageId = messageValue;
        message.reply("The messageId has been set to " + msg);
        }
    catch {
            message.reply("There was an error setting the messageId to " + msg) + 
            "\n**MAKE SURE TO SET THE CHANNEL BEFORE SETTING THE MESSAGE**";
    }
}
async function add(message, args){
    if (channelId === '') return message.reply("**There is no channel set!**");
    if (messageId === '') return message.reply("**There is no message set!**");
    if (args.length <= 2) return message.reply(`**Not all arguments are there, check \`${prefix}reaction help\` for more info!**`);
    try {
        const channel = message.guild.channels.cache.get(channelId);
        const msg = channel.messages.cache.get(messageId);
        let emojiName = args[1];
        if (emojiName.lastIndexOf(':') != -1)
            emojiName = emojiName.substring(2, emojiName.lastIndexOf(':'));
        try {
            const reactionEmoji = message.guild.emojis.cache.find(emoji => emoji.name === emojiName);
            msg.react(reactionEmoji);
        }
        catch {
            msg.react(emojiName);
        }
        let emojiRole = '';
        for (const value of args) {
            if (value != args[0] && value != args[1]) //There is most likely a better way to ignore the first argument.
                 emojiRole += value + ` `;
        }
        emojiRole = emojiRole.substring(0, emojiRole.length - 1);
        message.reply("The reaction role for "+ args[1] + " with the role " + emojiRole +" was added!");
        emojis[emojiName] = emojiRole;
    }
    catch {
        message.reply(`**I could not add the emoji! Please check \`${prefix}reaction help\` for more info!**`);
    }
    
}
function remove(message, args) {
    if (channelId === '') return message.reply("**There is no channel set!**");
    if (messageId === '') return message.reply("**There is no message set!**");
    try {
        const channel = message.guild.channels.cache.get(channelId);
        const msg = channel.messages.cache.get(messageId);
        let emojiName = args[1];
            if (emojiName.lastIndexOf(':') != -1)
                emojiName = emojiName.substring(2, emojiName.lastIndexOf(':'));
        delete emojis[emojiName];
        try {
            msg.reactions.cache.get(message.guild.emojis.cache.find(emoji => emoji.name === emojiName).id).remove().catch(error => console.error('Failed to remove reactions: ', error));
        }
        catch {
            msg.reactions.cache.get(emojiName).remove().catch(error => console.error('Failed to remove reactions: ', error));
        }
        message.reply("The reaction role for " + args[1] + " was removed!")
    }
    catch {
        message.reply("**I could not remove the emoji! Please check \`${prefix}reaction help\` for more info!**");
    }

}