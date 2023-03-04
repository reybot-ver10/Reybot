this.config = {    
  name: "logsbot",
  version: "1.0.0",
  author: {
    name: "JOHN RÉ", 
    contacts: ""
  },
  cooldowns: 5,
  role: 0,
  shortDescription: "Turn on/off BOT logs ",
  longDescription: "Turn on or off the message when Bot is added to the new group or gets kicked about admin",
  category: "box chat",
  guide: "{p}{n} on: turn on"
       + "\n{p}{n} off: turn off"
};

module.exports = {
  config: this.config,
  start: async function({ args, client, globalGoat, message }) {
    const fs = require("fs-extra");
    
    if (args[0] == "on") globalGoat.configCommands.envEvents.logsbot.logsbot = true;
    else if (args[0] == "off") globalGoat.configCommands.envEvents.logsbot.logsbot = false;
    else message.SyntaxError();
    fs.writeFileSync(client.dirConfigCommands, JSON.stringify(globalGoat.configCommands, null, 2));
    message.reply(`Đã ${globalGoat.configCommands.envEvents.logsbot.logsbot ? "turn on" : "turn off"} Send a goodbye message when there are members out or get kicked off your group`);
  }
};