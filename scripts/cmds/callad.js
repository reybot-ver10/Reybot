this.config = {
  name: "callad",
  version: "1.0.1",
  author: { 
    name: "JOHN RÉ", 
    contacts: ""
  },
  cooldowns: 5,
  role: 0,
  shortDescription: "Send reports about Admin Bot ", Longdescription:" Send reports, suggestions, error messages, ... about Admin Bot ", Category:" Contacts Admin ", Guide:" {Prefix} {name} <Message>
};
  
module.exports = {
  config: this.config,
  start: async function({ globalGoat, args, message, api, event, usersData, threadsData }) {
    if (!args[0]) return message.reply("Please enter the message you want to send to admin");
    const { senderID, threadID, isGroup } = event;
    
    const userData = await usersData.getData(senderID);
    const nameSender = userData.name;
    let msg = "==📨️ Report 📨️=="
    +`\n${userData.gender == 2 ? "🚹" : "🚺"} Name: ${nameSender}`
    +`\n🆔 User ID: ${senderID}`;
    
    msg += `\n👨‍👩‍👧‍👦 Từ ` + isGroup ? `nhóm: ${(await threadsData.getData(threadID)).name}`
      +`\n🆔 Thread ID: ${threadID}` : "cá nhân";
      
    api.sendMessage({
      body: msg + `\n🆎 Content: ${args.join(" ")}\n─────────────────The Recovery of this message to send a message about User`,
      mentions: [{
        id: senderID,
        tag: nameSender
      }]
    }, globalGoat.config.adminBot[0], (err, info) => {
      if (err) return message.reply(`Error has happened: ${err.name ? err.name + " " + err.message : err.errorSummary + "\n" + err.errorDescription}`);
      message.reply("Submit your report on Admin Success");
      globalGoat.whenReply[info.messageID] = {
        nameCmd: this.config.name,
        messageID: info.messageID,
        messageIDSender: event.messageID,
        threadIDSender: threadID,
        type: "userCallAdmin"
      };
    });
  },
  
  whenReply: async ({ globalGoat, args, event, api, message, Reply, usersData }) => {
    const { messageIDSender, threadIDSender, type } = Reply;
    const nameSender = (await usersData.getData(event.senderID)).name;
    
    switch (type) {
      case "userCallAdmin":
        api.sendMessage({
          body: `📍 Feedback from Admin ${nameSender}\n${args.join(" ")}`
          + `\n─────────────────The Recovery of this message to continue sending a message about Admin`,
          mentions: [{
            id: event.senderID,
            tag: nameSender
          }]
        }, threadIDSender, (err, info) => {
          if (err) return message.reply(`Error has happened: ${err.name ? err.name + " " + err.message : err.errorSummary + "\n" + err.errorDescription}`);
          globalGoat.whenReply[info.messageID] = {
            nameCmd: this.config.name,
            messageID: info.messageID,
            messageIDSender: event.messageID,
            threadIDSender: event.threadID, 
            type: "adminReply"
          };
        }, messageIDSender);
        break;
      case "adminReply":
        api.sendMessage({
          body: `📝 Feedback from users ${nameSender}:`
              + `\n🆔: ${event.senderID}`
              + `\n🗣️: ${nameSender}`
              + `\nNội dung:\n${args.join(" ")}`
              + `\n─────────────────The Recovery of this message to send a message about User`,
          mentions: [{
            id: event.senderID,
            tag: nameSender
          }]
        }, threadIDSender, (err, info) => {
          if (err) return message.reply(`Error has happened: ${err.name ? err.name + " " + err.message : err.errorSummary + "\n" + err.errorDescription}`);
          globalGoat.whenReply[info.messageID] = {
            nameCmd: this.config.name,
            messageID: info.messageID,
            messageIDSender: event.messageID,
            threadIDSender: event.threadID, 
            type: "userCallAdmin"
          };
        }, messageIDSender);
        break;
      default:
        break;
    }
    
  }
};