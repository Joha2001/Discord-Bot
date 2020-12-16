module.exports = {
	name: 'announce',
	description: 'Use the bot to send an announcement message!',
	execute(client, message, args) {
        let replyMsg = `***New Announcement!***\n`
        for (const value of args) {
            replyMsg += value + ` `;
        }
		message.send(replyMsg);
	},
};