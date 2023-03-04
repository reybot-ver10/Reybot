this.config = {    
  name: "unsend",
  version: "1.0.1",
  author: {
    name: "JOHN RÉ", 
    contacts: ""
  },
  cooldowns: 5,
  role: 0,
  shortDescription: "Remove BOT messages, "
  longdescription:" Remove the message of BOT",
  category: "info",
  guide: "Reply BOT messages with content {p}{n}"
};

module.exports = {
  config: this.config,
  start: async function({ message, api, event, args, globalGoat }) {
    if (event.messageReply.senderID != globalGoat.botID) return message.reply('Can't remove other people's messages!!');
	  if (event.type != "message_reply") return message.reply('Please reply the BOT message to remove');
	  return api.unsendMessage(event.messageReply.messageID);
  }
};