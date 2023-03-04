const fs = require("fs-extra");
const moment = require("moment-timezone");

module.exports = {
	config: {
		name: "leave",
		version: "1.0.1",
		type: ["log:unsubscribe"],
		author: {
			name: "JOHN RÉ",
			contacts: ""
		},
	},
	start: async ({ threadsData, message, event, globalGoat, api, client, usersData }) => {
		const { leftParticipantFbId } = event.logMessageData;
		if (leftParticipantFbId == globalGoat.botID) return;
		const hours = moment.tz("Asia/Ho_Chi_Minh").format("HH");
		const { threadID } = event;
		const threadData = client.allThreadData[threadID];
		if (threadData.data.sendLeaveMessage == false) return;

		const messageLeaveDefault = "{userName} đã {type} from the group";
		let messageLeave = threadData ? threadData.data.leaveMessage || messageLeaveDefault : messageLeaveDefault;
		const boxName = messageLeave.includes("{boxName}") ? (await api.getThreadInfo(threadID)).threadName : ""; // limit block acc
		const userName = (await usersData.getData(leftParticipantFbId)).name;
		// {userName}: the name of the member being kicked/self out
		// {type}: leave/get kicked by qtv
		// {boxName}: the name of the chat group
		// {session}: session of the day
		messageLeave = messageLeave
			.replace(/\{userName}/g, userName)
			.replace(/\{type}/g, leftParticipantFbId == event.author ? "deleted" : "deleted by admin")
			.replace(/\{boxName}/g, boxName)
			.replace(/\{session}/g, hours <= 10 ? "am" :
				hours > 10 && hours <= 12 ? "trưa" :
					hours > 12 && hours <= 18 ? "afternoon" :
					"night"
);

		const form = {
			body: messageLeave,
			mentions: [{
				id: leftParticipantFbId,
				tag: userName
			}]
		};
		threadData.data.leaveAttachment ? form.attachment = fs.createReadStream(__dirname + "/src/mediaLeave/" + threadData.data.leaveAttachment) : "";
		message.send(form);
	}
};