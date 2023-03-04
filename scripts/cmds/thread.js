this.config = {    
  name: "thread",
  version: "1.0.1",
  author: {
    name: "JOHN RÉ", 
    contacts: ""
  },
  cooldowns: 5,
  role: 2,
  shortDescription: "Managing chat groups ", Longdescription:" Managing chat groups in the BOT system",
  category: "owner",
  guide: "{prefix}thread [find | -f | search | -s] <Name to find>: Search the chat group in Bot data by name"
       + "\n"
       + "\n{prefix}thread [ban | -b] [<id> | To blank] <Reason>: Used to ban the group with ID <ID> or current group using BOT"
       + "\nVí dụ:"
       + "\n{prefix}thread ban 3950898668362484 spam bot"
       + "\n{prefix}thread ban spam too much"
       + "\n"
       + "\n{prefix}thread unban [<id> | leave blanks] to abide by the group carrying ID <id>"
       + "\nor current group"
};

module.exports = {
  config: this.config,
  start: async function({ api, args, threadsData, message, client, event }) {
    const moment = require("moment-timezone");
    const type = args[0];
    if (["find", "search", "-f", "-s"].includes(type)) {
      var allThread = await threadsData.getAll(["name"]);
      var arrayreturn = [];
      var msg = "";
      var length = 0;
      const keyword = args.slice(1).join(" ");
      for (let i in allThread) {
        if (allThread[i].name.toLowerCase().includes(keyword.toLowerCase())) {
          length++;
          msg += `\n╭Name: ${allThread[i].name}\n╰ID: ${i}`;
        }
      };
      message.reply(length == 0 ? `❌have not search results are suitable for keywords ${keyword}` : `🔎Have ${length} suitable results for keywords"${keyword}":\n${msg}`);
    }
    else if (["ban", "-b"].includes(type)) {
      var id, reason;
      if (!isNaN(args[1])) {
        id = args[1];
        reason = args.slice(2).join(" ");
      }
      else {
        id = event.threadID;
        reason = args.slice(1).join(" ");
      };
      if (!id || !reason) return message.SyntaxError();
      reason = reason.replace(/\s+/g, ' ');
      if (!client.allThreadData[id]) return message.reply(`The group id ${id} does not exist in BOT data`);
      const threadData = (await threadsData.getData(id));
      const name = threadData.name;
      
      const { banned } = threadData;
      banned.usebot = {
        status: true,
    	  reason,
    	  date: moment.tz("Asia/Manila").format("DD/MM/YYYY HH:mm:ss")
      };
      await threadsData.setData(id, { banned }, (err) => {
        if (err) return message.reply(`Error has happened ${err.name}: ${err.message}`);
        else return message.reply(`Has banned the group with ID ${id} | ${name} Use BOT with the reason: ${reason}`);
      });
    }
    else if (["unban", "-u"].includes(type)) {
      var id;
      if (!isNaN(args[1])) {
        id = args[1];
      }
      else {
        id = event.threadID;
      };
      if (!id) return message.SyntaxError();
      if (!client.allThreadData[id]) return message.reply(`The group bearing ${id} does not exist in BOT data`);
      const threadData = await threadsData.getData(id);
      const name = threadData.name;
      const { banned } = threadData;
      banned.usebot = {
        status: false,
    	  reason: null
      };
      await threadsData.setData(id, { banned }, (err, data) => {
        if (err) return message.reply(`Error has happened ${err.name}: ${err.message}`);
        else message.reply(`Has abandoned the group with id ${id} | ${name}, Currently this group can use BOT`); });
    }
    else return message.SyntaxError();
  }
};