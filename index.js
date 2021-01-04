const fs = require('fs');
const Discord = require('discord.js');
const { prefix, token } = require('./config.json');
const { executeWelcome } = require('./commands/welcome');
const { executeReaction } = require('./commands/reaction');
const client = new Discord.Client();
client.commands = new Discord.Collection();


client.once('ready', async () => {
    console.log('Ready!');
    client.user.setPresence({activity: {name: `${prefix}help`, type: "PLAYING"} , status: 'online'});
    const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
	    const command = require(`./commands/${file}`);
        client.commands.set(command.name, command);
    }
});

client.on('guildMemberAdd', async member => {
    executeWelcome(member);
});

client.on('messageReactionAdd', async (reaction, user) => {
    if (!user.bot)
        executeReaction(reaction, user, true);
});

client.on('messageReactionRemove', async (reaction, user) => {
    if (!user.bot)
        executeReaction(reaction, user, false);
});

client.on('message', async message => {

	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    
    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;
    
    try { //Permission check
    if (!message.member.hasPermission(command.permissions)) 
        return message.reply(command.permissionsError);
    }
    catch {
        message.reply("***WARNING: You might be running a command that only works on a server, if the command doesn't work, try again on a server with me in it!***");
    }
    
    try {
        command.execute(client, message, args);
    } catch (error) {
        console.error(error);
        message.reply('there was an error trying to execute that command!');
    }
});

client.login(token);