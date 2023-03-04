this.config = {    
  name: "busy",
  version: "1.0.0",
  author: {
    name: "JOHN RÉ", 
    contacts: ""
  },
  cooldowns: 5,
  role: 0,
  shortDescription: "turn on do not disturb mode",
   longDescription: "enable do not disturb mode, when you are tagged bot will notify",
  category: "box chat",
  guide: "{prefix}{name} [leave blank|reason]"
};

module.exports = {
  config: this.config,
  start: async function({ args, client, message, event }) {
    const { senderID } = event;
    if (!client.busyList) client.busyList = {};
    
    const reason = args.join(" ") || null;
    client.busyList[senderID] = reason;
    
    return message.reply(`Enabled do not disturb mode${reason? ` with the reason: ${reason}` : ""}`);
  },
  
  
  whenChat: async ({ event, client, message }) => {
    if (!client.busyList) return;
    const { senderID, mentions } = event;
    const { busyList } = client;
    
    if (busyList[senderID]) {
      delete busyList[senderID];
      const text = "Welcome to come back =)";
      message.reply({
        body: text,
        mentions: [{
          id: senderID,
          tag: text
        }]
      });
    }
    
    if (!mentions || Object.keys(mentions).length == 0) return;
    const arrayMentions = Object.keys(mentions);
    
    for (const userID of arrayMentions) {
      if (Object.keys(client.busyList).includes(userID)) 
      return message.reply(`Current user ${mentions[userID].replace("@", "")} Are busy${busylist [UserID]? `with reason: ${busyList[userID]}` : ""}`);
    }
    
  }
  
};