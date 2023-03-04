module.exports = {
	config: {
		name: "checkwarn",
		version: "1.0.0",
		type: ["log:subscribe"],
		author: {
			name: "JOHN RÉ",
			contacts: ""
		},
	},
	start: async ({ threadsData, message, event, globalGoat, api, client }) => {
		const { threadID } = event;
		const { data, adminIDs } = await threadsData.getData(event.threadID);
		if (!data.warn) return;
		const { banned } = data.warn;
		const { addedParticipants } = event.logMessageData;
		for (const user of addedParticipants) {
			if (banned.includes(user.userFbId)) {
				message.send({
					body: `This user has been warned 3 times before and banned from box\nName: ${user.fullName}\nUid: ${user.userFbId}\nTo unban please use the command "${client.getPrefix) (threadID)}warn unban <uid>" (where uid is the uid of the person you want to remove)`,
					mentions: [{
						tag: user.fullName,
						id: user.userFbId
					}]
				}, function () {
					api.removeUserFromGroup(user.userFbId, threadID, (err) => {
						if (err) return message.send(`Bot needs admin rights to kick banned members`);
					});
				});
			}
		}
	}
};