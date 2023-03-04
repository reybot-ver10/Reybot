this.config = {    
  name: "welcome",
  version: "1.0.0",
  author: {
    name: "JOHN RÉ", 
    contacts: ""
  },
  cooldowns: 5,
  role: 0,
  shortDescription: "Turn on/off sending welcome messages",
  longDescription: "Turn on or off the welcome message when a new member join your chat group",
  category: "box chat",
  guide: "{p}{n} on: turn on"
       + "\n{p}{n} off: turn off"
};

module.exports = {
  config: this.config,
  start: async function({ args, threadsData, globalGoat, message, event, role }) {
    const { threadID } = event;
    const data = (await threadsData.getData(threadID)).data;
    
    if (args[0] == "on") data.sendWelcomeMessage = true;
    else if (args[0] == "off") data.sendWelcomeMessage = false;
    else message.SyntaxError();
    
    await threadsData.setData(threadID, {
      data
    }, (err, info) => {
      if (err) return message.reply(`Error has happened, please try again later: ${err.name}: ${err.message}`);
      message.reply(`Đã ${data.sendWelcomeMessage ? "turn on" : "turn off"} Send a welcome message when a new member join your chat group`);
    });
  }
};