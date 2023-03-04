const fs = require("fs-extra");
const moment = require("moment-timezone");

module.exports = {
	config: {
		name: "welcome",
		version: "1.0.3",
		type: ["log:subscribe"],
		author: {
			name: "JOHN RÉ",
			contacts: ""
		},
	},
	start: async ({ threadsData, message, event, globalGoat, api, client }) => {
		const hours = moment.tz("Asia/Manila").format("HH");
		const { threadID } = event;
		const { prefix, nickNameBot } = globalGoat.config;
		const dataAddedParticipants = event.logMessageData.addedParticipants;
		// If it's a bot;
		if (dataAddedParticipants.some(item => item.userFbId == globalGoat.botID)) {
			if (nickNameBot) api.changeNickname(nickNameBot, threadID, globalGoat.botID);
			return message.send(`Thank you for inviting me!\nPrefix bot: ${globalGoat.config.prefix}\nTo view the list of commands, type: ${prefix}help`);
		}

		// If you are a new member:
		const threadData = client.allThreadData[threadID].data;
		if (threadData.sendWelcomeMessage == false) return;
		const boxName = client.allThreadData[threadID].name;
		const userName = [], mentions = [];
		let multiple = false;

		if (dataAddedParticipants.length > 1) multiple = true;
		for (let user of dataAddedParticipants) {
			userName.push(user.fullName);
			mentions.push({
				tag: user.fullName,
				id: user.userFbId
			});
		}
		// {userName}: new member's name
		// {boxName}:  the name of the chat group
		// {multiple}: you || you
		// {session}:  session of the day
		const messageWelcomeDefault = `Hello {userName}.\nWelcome {multiple} to the group chat: {boxName}\nWish {multiple} a happy {session} session =)`;
		let messageWelcome = threadData.welcomeMessage || messageWelcomeDefault;
		messageWelcome = messageWelcome
			.replace(/\{userName}/g, userName.join(", "))
			.replace(/\{boxName}/g, boxName)
			.replace(/\{multiple}/g, multiple ? "friends" : "you")
			.replace(/\{session}/g, hours <= 10 ? "sáng" :
				hours > 10 && hours <= 12 ? "trưa" :
					hours > 12 && hours <= 18 ? "evening");

		const form = {
			body: messageWelcome,
			mentions
		};
		threadData.welcomeAttachment ? form.attachment = fs.createReadStream(__dirname + "/src/mediaWelcome/" + threadData.welcomeAttachment) : "";

		message.send(form);
	}
};