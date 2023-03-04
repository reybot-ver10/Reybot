this.config = {    
  name: "notification",
  version: "1.0.1",
  author: {
    name: "JOHN RÉ", 
    contacts: ""
  },
  cooldowns: 5,
  role: 2,
  shortDescription: "Send notifications from Admin to All Box", Longdescription:" Send notifications from admin to all box",
  category: "admin",
  guide: "{p}{n} <message>",
  envConfig: {
    delayPerGroup: 250
  }
};

module.exports = {
  config: this.config,
  start: async function({ message, api, client, event, args, download, globalGoat }) {
    const fs = require("fs-extra");
    const axios = require("axios");
    const { delayPerGroup } = globalGoat.configCommands.envCommands["notification"];
    if (!args[0]) return message.reply("Please enter the message you want to send to all groups");
    const formSend = {
      body: "Notice from Admin Bot\n────────────────\n" + args.join(" ")
    };
    const attachmentSend = [];
    
    async function getAttachments(attachments) {
      let startFile = 0;
      for (const data of attachments) {
        const ext = data.type == "photo" ? "jpg" :
        data.type == "video" ? "mp4" : 
        data.type == "animated_image" ? "gif" : 
        "txt";
        const pathSave = __dirname + `/cache/notification${startFile}.${ext}`;
        ++startFile;
        const url = data.url;
        const res = await axios.get(url, {
          responseType: "arraybuffer"
        });
        fs.writeFileSync(pathSave, Buffer.from(res.data));
        attachmentSend.push(fs.createReadStream(pathSave));
        setTimeout(function() {
          fs.unlinkSync(pathSave);
        }, 2000);
      }
    }
    
    if (event.messageReply) {
      if (event.messageReply.attachments.length > 0) {
        await getAttachments(event.messageReply.attachments);
      }
    }
    else if (event.attachments.length > 0) {
      await getAttachments(event.attachments);
    }
    
    if (attachmentSend.length > 0) formSend.attachment = attachmentSend;
    const allThreadID = (await api.getThreadList(500, null, ["INBOX"])).filter(item => item.isGroup === true && item.threadID != event.threadID).map(item => item = item.threadID);
    
    let sendSucces = 0;
    let sendError = [];
    
    for (let tid of allThreadID) {
      let errorWhenSend = false;
      api.sendMessage(formSend, tid, function (err) {
        if (err) {
          sendError.push(tid);
          errorWhenSend = true;
        }
      });
      await new Promise(resolve => setTimeout(resolve, delayPerGroup));
      if (errorWhenSend === true) continue;
      ++sendSucces;
    }
    
    return message.reply(`Sent notifications to ${sendSucces} successful group\n${sendError.length > 0 ? `There are errors that occur when sent to ${sendError.length} group` : ""}`);
  }
};