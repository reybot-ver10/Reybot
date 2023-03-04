module.exports = function ({ api, globalGoat, client, usersData, threadsData, download, }) {
	const print = globalGoat.print;
	const axios = require("axios");
	const chalk = require("chalk");
	const { readdirSync, writeFileSync, existsSync, mkdirSync, createReadStream } = require("fs-extra");
	const moment = require("moment-timezone");

	return async function ({ event, message }) {
		const { body, messageID, threadID, isGroup } = event;
		const senderID = event.senderID || event.author || event.userID;

		let prefix = globalGoat.config.prefix;
		client.allThreadData[threadID] ? prefix = client.allThreadData[threadID].prefix || prefix : "";

		const contentSyntaxError = `The command you are using is incorrect, please type ${prefix}help {nameCmd} for details on how to use this command`;

		const parameters = { api, globalGoat, client, usersData, threadsData, message, event, download };

		if (!isNaN(senderID) && !client.allUserData[senderID]) await usersData.createData(senderID);
		if (!isNaN(threadID) && !client.allThreadData[threadID]) await threadsData.createData(threadID);

		//===============================================//
		//                   WHEN CHAT                   //
		//===============================================//
		async function whenChat() {
			const { isGroup } = event;
			const allWhenChat = globalGoat.whenChat || [];
			const args = body ? body.split(" ") : [];
			for (const key of allWhenChat) {
				const command = globalGoat.commands.get(key);
				try {
					message.SyntaxError = function () {
						return message.reply(contentSyntaxError.replace("{nameCmd}", command.config.name));
					};
					command.whenChat({
						...parameters,
						...{ args }
					});
				}
				catch (err) {
					print.err("An error occurred while executing commamd whenChat at command " + command.config.name + ", error: " + err.stack, "WHEN CHAT");
				}
			}
		}

		//===============================================//
		//              WHEN CALL COMMAND                //
		//===============================================//
		async function whenStart() {
			// —————————————— CHECK USE BOT —————————————— //
			if (body && !body.startsWith(prefix) || !body) return;
			const dateNow = Date.now();
			const { adminBot } = globalGoat.config;
			const args = body.slice(prefix.length).trim().split(/ +/);
			// —————————  CHECK HAS IN DATABASE  ————————— //
			if (!client.allThreadData[threadID]) await threadsData.createData(threadID);
			if (!client.allUserData[senderID]) await usersData.createData(senderID);
			// ————————————  CHECK HAS COMMAND ——————————— //
			var commandName = args.shift().toLowerCase();
			const command = globalGoat.commands.get(commandName) || globalGoat.commands.get(globalGoat.shortNameCommands.get(commandName));
			if (command) commandName = command.config.name;
			// ————————————— GET THREAD INFO ————————————— //
			const threadInfo = client.allThreadData[threadID] || {};
			if (threadInfo.onlyAdminBox === true && !threadInfo.adminIDs.includes(senderID) && commandName != "rules") return message.reply("This group is now enabled and only group admins can use bots");
			// —————————————— CHECK BANNED —————————————— //
			// +++++++++++     Check User     +++++++++++ //
			const infoBannedUser = client.allUserData[senderID].banned;
			if (infoBannedUser.status == true) {
				return message.reply(
					`You have been banned from using the bot by the Admin`
					+ `\n> Reason: ${infoBannedUser.reason}`
					+ `\n> Time: ${infoBannedUser.date}`
					+ `\n> User ID: ${senderID}`);
			}
			// +++++++++++    Check Thread    +++++++++++ //
			if (isGroup == true) {
				const infoBannedThread = threadInfo.banned;
				if (infoBannedThread.status == true) return message.reply(
					`Your group has been banned by Admin bot from using bot`
					+ `\n> Reason: ${infoBannedThread.reason}`
					+ `\n> Time: ${infoBannedThread.date}`
					+ `\n> Thread ID: ${threadID}`);
			}
			if (!command) return message.reply(`Command ${commandName ? `'${commandName}'` : 'you use'} does not exist, type ${prefix}help to see all available commands`);
			//============================================//
			// ————————————— COMMAND BANNED ————————————— //
			if (client.commandBanned[commandName]) return message.reply(`Lệnh ${commandName} was banned by the Admin from using the bot system for the reason: ${client.commandBanned[commandName]}`);
			// ————————————— CHECK PERMISSION ———————————— //
			const needRole = command.config.role || 0;
			const adminBox = threadInfo.adminIDs || [];

			const role = adminBot.includes(senderID) ? 2 :
				adminBox.includes(senderID) ? 1 :
					0;

			if (needRole > role && needRole == 1) return message.reply(`Only admins of the chat group can use the command '${commandName}'`);
			if (needRole > role && needRole == 2) return message.reply(`Only admin bot can use command '${commandName}'`);
			// ———————————————— COOLDOWNS ———————————————— //
			if (!client.cooldowns[commandName]) client.cooldowns[commandName] = {};
			const timestamps = client.cooldowns[commandName];
			const configCommand = command.config;
			const cooldownCommand = (command.config.cooldowns || 1) * 1000;
			if (timestamps[senderID]) {
				const expirationTime = timestamps[senderID] + cooldownCommand;
				if (dateNow < expirationTime) return message.reply(`⏱ You are currently waiting to use this command, please come back later ${((expirationTime - dateNow) / 1000).toString().slice(0, 3)}s`);
			}
			// ——————————————— RUN COMMAND ——————————————— //
			try {
				message.SyntaxError = function () {
					return message.reply(contentSyntaxError.replace("{nameCmd}", command.config.name));
				};
				message.guideCmd = async function () {
					let guide = configCommand.guide || {
						body: ""
					};
					if (typeof (guide) == "string") guide = {
						body: guide
					};
					const msg = '\n───────────────\n'
						+ '» Instructions for use:\n'
						+ guide.body
							.replace(/\{prefix\}|\{p\}/g, prefix)
							.replace(/\{name\}|\{n\}/g, configCommand.name)
						+ '\n───────────────\n'
						+ '» Note:\n• Content inside <XXXXX> is mutable\n• Content inside [a|b|c] is a or b or c';

					const formSendMessage = {
						body: msg
					};

					if (guide.attachment) {
						if (guide.attachment && typeof (guide.attachment) == 'object' && !Array.isArray(guide.attachment)) {
							formSendMessage.attachment = [];
							for (const pathFile in guide.attachment) {
								if (!existsSync(pathFile)) await download(guide.attachment[pathFile], pathFile);
								formSendMessage.attachment.push(createReadStream(pathFile));
							}
						}
					}
					message.reply(formSendMessage);
				};
				const time = moment.tz("Asia/Ho_Chi_Minh").format("DD/MM/YYYY HH:mm:ss");
				print(`${chalk.hex("#ffb300")(time)} | ${commandName} | ${senderID} | ${threadID} | ${args.join(" ")}`, "CALL CMD");
				parameters.role = role;
				command.start({ ...parameters, ...{ args } });
				timestamps[senderID] = dateNow;
			}
			catch (err) {
				print.err(`An error occurred while running the command ${commandName}, error: ${err.stack}`, "CALL COMMAND");
				return message.reply(`❎\An error occurred while executing the command ${commandName}\n${err.stack}`);
			}
		}

		//===============================================//
		//                   WHEN REPLY                  //
		//===============================================//
		async function whenReply() {
			if (!event.messageReply) return;
			const { whenReply } = globalGoat;
			const Reply = whenReply[event.messageReply.messageID];
			if (!Reply) return;
			const command = globalGoat.commands.get(Reply.nameCmd);
			if (!command) throw new Error("The command name to execute this response could not be found");
			const args = body ? body.split(" ") : [];
			try {
				message.SyntaxError = function () {
					return message.reply(contentSyntaxError.replace("{nameCmd}", command.config.name));
				};
				message.guideCmd = async function () {
					const formSendMessage = {
						body: command.config.guide.replace(/\{prefix\}|\{p\}/g, prefix).replace(/\{name\}|\{n\}/g, command.config.name)
					};
					const { sendFile } = command.config;
					if (sendFile &&
						typeof (sendFile) == 'object' &&
						!Array.isArray(sendFile)
					) {
						formSendMessage.attachment = [];
						for (let pathFile in sendFile) {
							if (!existsSync(pathFile)) await download(sendFile[pathFile], pathFile);
							formSendMessage.attachment.push(createReadStream(pathFile));
						}
					}
					return api.sendMessage(formSendMessage, threadID, messageID);
				};
				return command.whenReply({ ...parameters, ...{ Reply, args } });
			}
			catch (err) {
				print.err(`An error occurred while executing the reply command at command ${Reply.nameCmd} ${err.stack}`, "WHEN REPLY");
				message.reply(`❎\nAn error occurred at command ${Reply.nameCmd}\n${err.stack}`);
			}
		}

		//===============================================//
		//                 WHEN REACTION                 //
		//===============================================//
		async function whenReaction() {
			const { whenReaction } = globalGoat;
			const Reaction = whenReaction[messageID];
			if (!Reaction) return;
			const command = globalGoat.commands.get(Reaction.nameCmd);
			if (!command) throw new Error("The command name to execute this response could not be found");
			const args = body ? body.split(" ") : [];
			try {
				message.SyntaxError = function () {
					return message.reply(contentSyntaxError.replace("{nameCmd}", command.config.name));
				};
				message.guideCmd = async function () {
					const formSendMessage = {
						body: command.config.guide.replace(/\{prefix\}|\{p\}/g, prefix).replace(/\{name\}|\{n\}/g, command.config.name)
					};
					const { sendFile } = command.config;
					if (sendFile &&
						typeof (sendFile) == 'object' &&
						!Array.isArray(sendFile)
					) {
						formSendMessage.attachment = [];
						for (let pathFile in sendFile) {
							if (!existsSync(pathFile)) await download(sendFile[pathFile], pathFile);
							formSendMessage.attachment.push(createReadStream(pathFile));
						}
					}
					return api.sendMessage(formSendMessage, threadID, messageID);
				};
				command.whenReaction({ ...parameters, ...{ Reaction, args } });
				return;
			}
			catch (e) {
				print.err(`An error occurred while executing command React at command ${Reaction.nameCmd}: ${e.stack}`, "HANDLE REACTION");
				message.reply(`❎\nn error occurred at command Reaction${Reaction.nameCmd}\n${e.stack}`);
			}
		}

		//===============================================//
		//                     EVENT                     //
		//===============================================//
		async function handlerEvent() {
			const { logMessageType, author } = event;
			for (const [key, value] of globalGoat.events.entries()) {
				const getEvent = globalGoat.events.get(key);
				if (!getEvent.config.type.includes(logMessageType)) continue;
				if (getEvent.config.condition && !eval(getEvent.config.condition)) continue;
				try {
					const time = moment.tz("Asia/Manila").format("DD/MM/YYYY HH:mm:ss");
					print(`${chalk.hex("#ffb300")(time)} | Event: ${getEvent.config.name} | ${author} | ${threadID}`, "EVENT CMD");
					getEvent.start({ event, api, globalGoat, usersData, threadsData, client, download, message });
				}
				catch (err) {
					print.err(`An error occurred at command event ${chalk.hex("#ff0000")(getEvent.config.name)}, ${err.stack}`, "EVENT COMMAND");
					message.reply(`❎\nn error occurred at command event ${getEvent.config.name}\n${err.stack}`)
				}
			}
		}

		//===============================================//
		//                    PRESENCE                   //
		//===============================================//
		async function presence() {
			// Your code here
		}

		//===============================================//
		//                   READ RECEIPT                //
		//===============================================//
		async function read_receipt() {
			// Your code here
		}

		//===============================================//
		//                      TYP                      //
		//===============================================//
		async function typ() {
			// Your code here
		}


		return {
			whenChat,
			whenStart,
			whenReaction,
			whenReply,
			handlerEvent,
			presence,
			read_receipt,
			typ
		};
	};
};