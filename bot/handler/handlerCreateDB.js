module.exports = function ({ globalGoat, usersData, threadsData, client }) {

	const print = globalGoat.print;	const CREATEDATA = async function ({ event }) {

		try {

			const { threadID, isGroup } = event;

			const senderID = event.senderID || event.author || event.userID;

			// —————————————— CREATE THREAD DATA —————————————— //

			if (!client.allThreadData[threadID] && isGroup && !isNaN(threadID) && threadID != 0) {

				if (client.database.threadBusy) return print.warn("DATABASE BUSY", "DATABASE");

				client.database.threadBusy = true;

				try {

					await threadsData.createData(threadID);

					client.database.threadBusy = false;

					print(`New Thread: ${threadID} | ${client.allThreadData[threadID].name} | ${globalGoat.config.database.type}`, "DATABASE");

				}

				catch (e) {

					client.database.threadBusy = false;

					print.err(`Can't write group with id '${threadID}' vào database! ${e.stack}`, "DATABASE");

				}

			}

			// ——————————————— CREATE USER DATA ——————————————— //

			if (!client.allUserData[senderID] && !isNaN(senderID) && senderID != 0) {

				if (client.database.userBusy) return print.warn("DATABASE BUSY", "DATABASE");

				client.database.userBusy = true;

				try {

					await usersData.createData(senderID);

					client.database.userBusy = false;

					print(`New User: ${senderID} | ${client.allUserData[senderID].name} | ${globalGoat.config.database.type}`, "DATABASE");

				}

				catch (err) {

					client.database.userBusy = false;

					print.err(`Can't write user with id '${senderID}' vào database! ${err.stack}`, "DATABASE");

				}

			}

		}

		catch (e) {

			print.err(e.stack, "HANDLE CREATE DATABASE");

		}

	};

	return CREATEDATA;

};
