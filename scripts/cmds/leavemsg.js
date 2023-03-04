this.config = {    
  name: "leavemsg",
  version: "1.0.0",
  author: {
    name: "JOHN RÉ", 
    contacts: ""
  },
  cooldowns: 5,
  role: 0,
  shortDescription: "Turn on/off Send a goodbye message", Longdescription:" Turn on or off Send a goodbye message when you have a member OUT or Kick from your group",
  category: "box chat",
  guide: "{p}{n} on: turn on"
       + "\n{p}{n} off: turn off"
};

module.exports = {
  config: this.config,
  start: async function({ args, threadsData, globalGoat, message, event }) {
    const { threadID } = event;
    const data = (await threadsData.getData(threadID)).data;
    
    if (args[0] == "on") data.sendLeaveMessage = true;
    else if (args[0] == "off") data.sendLeaveMessage = false;
    else message.SyntaxError();
    
    await threadsData.setData(threadID, {
      data
    }, (err, info) => {
      if (err) return message.reply(`Has an error happened, please try again later: ${err.name}: ${err.message}`);
      message.reply(`Đã ${data.sendWelcomeMessage ? "turn on" : "turn off"} Send a goodbye message when there are members out or get kicked off your group`);
    });
  }
};