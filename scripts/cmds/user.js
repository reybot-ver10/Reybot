this.config = {    
  name: "user",
  version: "1.0.1",
  author: {
    name: "JOHN RÉ", 
    contacts: ""
  },
  cooldowns: 5,
  role: 2,
  shortDescription: "User Management"
  longdescription: "User management in the BOT system",
  category: "owner",
  guide: "{prefix}user [find | -f | search | -s] <Name to find>: Search users in BOT data by name"
       + "\n"
       + "\n{prefix}user [ban | -b] [<id> | @tag | Reply message] <reason>: To ban the user to bring ID <ID> or the tag or sender of the message reply to use BOT"
       + "\n"
       + "\n{prefix}user unban [<id> | @tag | Reply message]: To abide by using BOT users "
};

module.exports = {
  config: this.config,
  start: async function({ api, args, usersData, message, client, event, setup }) {
    const moment = require("moment-timezone");
    const type = args[0];
    if (["find", "search", "-f", "-s"].includes(type)) {
      var allUser = await usersData.getAllData(["name"]);
      var arrayreturn = [];
      var msg = "";
      var length = 0;
      const keyword = args[1];
      for (let i in allUser) {
        if (allUser[i].name.toLowerCase().includes(keyword.toLowerCase())) {
          length++;
          msg += `\n╭Name: ${allUser[i].name}\n╰ID: ${i}`;
        }
      }
      message.reply(length == 0 ? `❌have no search results are suitable for keywords{keyword}` : `🔎Have ${length} Suitable results for keywords"${keyword}":\n${msg}`);
    }
    else if (["ban", "-b"].includes(type)) {
      let id, reason;
      if (event.type == "message_reply") {
        id = event.messageReply.senderID;
        reason = args.slice(1).join(" ");
      } 
      else if (event.mentions) {
        let { mentions } = event;
        id = Object.keys(mentions)[0];
        reason = args.slice(1).join(" ").slice(mentions[id].length + 1);
      }
      else if (args[1]) {
        id = args[1];
        reason = args.slice(2).join(" ");
      }
      else return message.SyntaxError();
      
      if (!id) return message.reply("ID of the person who needs the board is not left blank, please enter ID or tag or teple message of a man syntax user board<id> <reasons>");
			if (!reason) return message.reply("The for ban on users is not left blank, please compose a message in syntax user board <id><reason>");
      if (!client.allUserData[id]) return message.reply(`Users bring ID ${id} do not exist in BOT` data);
      reason = reason.replace(/\s+/g, ' ');
      const name = (await usersData.getData(id)).name;
      await usersData.setData(id, {
        banned: {
          status: true,
          reason,
          date: moment.tz("Asia/Manila").format("DD/MM/YYYY HH:mm:ss")
      }}, (err) => {
        if (err) return message.reply(`Đã xảy ra lỗi ${err.name}: ${err.message}`);
        else return message.reply(`Has banned users with id ${id} | ${name} Use BOT with the reason: ${reason}`);
      });
    }
    else if (["unban", "-u"].includes(type)) {
      let id;
      if (event.type == "message_reply") {
        id = event.messageReply.senderID;
      } 
      else if (event.mentions) {
        const { mentions } = event;
        id = Object.keys(mentions)[0];
      }
      else if (args[1]) {
        id = args[1];
      }
      else return message.SyntaxError();
      if (!id) return message.reply("ID of the person who needs the board is not left blank, please enter the ID or tag or teple a message of a user syntax user board <id><id> "reason>");
      if (!client.allUserData[id]) return message.reply(`Users bring ID ${id} do not exist in BOT` data);
      const name = (await usersData.getData(id)).name;
      await usersData.setData(id, { 
        banned: { 
          status: false,
          reason: null 
        }
      }, (err) => {
        if (err) return message.reply(`Error has happened ${err.name}: ${err.message}`);
        else message.reply(`Has abandoned users with ID ${id} | ${name}, currently this person can use Bot`);
      });
    }
    else return message.SyntaxError();
  }
};