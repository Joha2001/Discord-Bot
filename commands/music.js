const queue = new Map();
const ytdl = require('ytdl-core');
const {prefix} = require("../config.json")
/*
    Code taken and adapted from: https://gabrieltanner.org/blog/dicord-music-bot
    List of things to do with Music Bot:
    [] Volume
    [] Other links (eg. SoundCloud, Spotify?)
    [] Searching instead of direct links.
    [] Shuffle and Repeat
    [] Queue Command
*/
module.exports = { 
	name: 'music',
  description: `Listen to music on the bot from YouTube!`,
  aliases: ['music', 'm'],
	execute(client, message, args) {
        const serverQueue = queue.get(message.guild.id);
        if (args[0] === `play`) {
            runner(message, args[1], serverQueue);
        }
        else if (args[0] === `skip`) {
            skip(message, serverQueue);
        }
        else if (args[0] === `stop`) {
            stop(message, serverQueue);
        }
        else if (args[0] === undefined || args[0] === `help`) {
            help(message);
        }
        else {
            message.reply(`**Incorrect syntax, check ${prefix}help for more information about ${prefix}music commands.**`);
        }
	},
};

async function runner(message, args, serverQueue) { // Adds song to queue and plays the song (if there is no song playing).
  
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel)
      return message.channel.send(
        "***You need to be in a voice channel to play music!***"
      );
    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
      return message.channel.send(
        "***I need the permissions to join and speak in your voice channel!***"
      );
    }
    try {
        const songInfo = await ytdl.getInfo(args);
    }
    catch {
        return message.reply("***You need to input a valid YouTube link!***");
    }
    const songInfo = await ytdl.getInfo(args);
    const song = {
          title: songInfo.videoDetails.title,
          url: songInfo.videoDetails.video_url,
     };
  
    if (!serverQueue) {
      const queueConstruct = {
        textChannel: message.channel,
        voiceChannel: voiceChannel,
        connection: null,
        songs: [],
        volume: 5,
        playing: true
      };
  
      queue.set(message.guild.id, queueConstruct);
  
      queueConstruct.songs.push(song);
  
      try {
        var connection = await voiceChannel.join();
        queueConstruct.connection = connection;
        play(message.guild, queueConstruct.songs[0]);
      } catch (err) {
        console.log(err);
        queue.delete(message.guild.id);
        return message.channel.send(err);
      }
    } else {
      serverQueue.songs.push(song);
      return message.channel.send(`***${song.title}*** **added to queue!**`);
    }
  } 

function help(message) { // Skips the current song and goes to the next one (if there is another)
    message.author.send(`***Music Command List: To use music commands, do*** \`${prefix}music [command] <args>\`
    \n\`play <yt-link>\` Adds a song to the queue, requires a valid YouTube link.
    \n\`skip\` Skips the current song and goes to the next in queue.
    \n\`stop\` Stops the current song and clears the rest of the queue.`)
  }

function skip(message, serverQueue) { // Skips the current song and goes to the next one (if there is another)
    if (!message.member.voice.channel)
      return message.reply(
        "***You have to be in a voice channel to stop the music!***"
      );
    if (!serverQueue)
      return message.reply("***No skippable song!***");
    serverQueue.connection.dispatcher.end();
  }
  
function stop(message, serverQueue) { //Clears the queue and disconnects the bot
    if (!message.member.voice.channel)
      return message.channel.send(
        "***You have to be in a voice channel to stop the music!***"
      );
      try {
            serverQueue.songs = [];
            serverQueue.connection.dispatcher.end();
      }
      catch {
          message.reply("***There are no songs in queue to stop!***");
      }
  }
  
function play(guild, song) {
    const serverQueue = queue.get(guild.id);
    if (!song) {
        serverQueue.voiceChannel.leave();
        queue.delete(guild.id);
        return;
    }
  
    const dispatcher = serverQueue.connection
      .play(ytdl(song.url))
      .on("finish", () => {
        serverQueue.songs.shift();
        play(guild, serverQueue.songs[0]);
      })
      .on("error", error => console.error(error));
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
    serverQueue.textChannel.send(`**Starting:** ***${song.title}***`);
}
