const fs = require("fs-extra");
this.config = {    
  name: "onlyadminbox",
  version: "1.0.0",
  author: {
    name: "JOHN RÉ", 
    contacts: ""
  },
  cooldowns: 5,
  role: 1,
  shortDescription: "Turn on/off only Admin Box using BOT", Longdescription:" Turn on/off the mode only Group administrators can use BOT ",
  category: "box chat",
  guide: "{prefix}{name} [on|off]"
};

module.exports = {
  config: this.config,
  start: async function({ globalGoat, args, message, event, client, threadsData }) {
    const threadData = await threadsData.getData(event.threadID);
    if (args[0] == "on") {
      threadsData.setData(event.threadID, {
        onlyAdminBox: true
      }, (e) => {
        if (e) return message.reply(`Error has happened ${e.name}: ${e.message}`);
        message.reply("Turn on the mode only Group administrators can use BOT");
      });
    }
    else if (args[0] == "off") {
      threadsData.setData(event.threadID, {
        onlyAdminBox: false
      }, (e) => {
        if (e) return message.reply(`Error has happened ${e.name}: ${e.message}`);
        message.reply("Turn off the mode only Group administrators can use bots");
      });
    }
    else return message.reply("Please select ON or OFF mode");
  }
};