this.config = {    
  name: "setleave",
  version: "1.0.0",
  author: {
    name: "JOHN RÉ", 
    contacts: ""
  },
  cooldowns: 5,
  role: 0,
  shortDescription: "Edit the content of the goodbye message", 
  longdescription:" Edit the content of the Member of the Membership Leave your chat group",
  category: "box chat",
  guide: "{p}{n} text [<content>|reset]: Edit text or reset content about the default, the shortcuts are available:"
       + "\n+ {userName}: Name of new member"
       + "\n+ {boxName}: Name of the chat group"
       + "\n+ {type}: Self-made/being qvv removed from the group "
       + "\n+ {session}:  day"
       + "\n* Eg: {p}{n} text {userName} đã {type}  from the group, see you again 🤧"
       + "\n"
       + "\nReply (Feedback) A file with the file with the content {p}{n} file: to send the file when a member leaves the group (photos, videos, audio) "
       + "\n{p}{n} file reset: delete file "};

module.exports = {
  config: this.config,
  start: async function({ args, threadsData, globalGoat, message, event, download }) {
    const fs = require("fs-extra");
    const { threadID } = event;
    const data = (await threadsData.getData(threadID)).data;
    
    if (args[0] == "text") {
      if (!args[1]) return message.reply("Funny to enter the message content");
      else if (args[1] == "reset") data.leaveMessage = null;
      else data.leaveMessage = args.slice(1).join(" ");
    }
    else if (args[0] == "file") {
      if (args[1] == "reset") {
        try {
          fs.unlinkSync(__dirname+"/../events/src/mediaLeave/" + data.leaveAttachment);
        }
        catch(e){}
        data.leaveAttachment = null;
      }
      else if (!event.messageReply || event.messageReply.attachments.length == 0) return message.reply("Please reply (Feedback) a message containing image file/video/audio");
      else {
        const attachments = event.messageReply.attachments;
        const typeFile = attachments[0].type;
        const ext = typeFile == "audio" ? ".mp3" :
        typeFile == "video" ? ".mp4" :
        typeFile == "photo" ? ".png" : 
        typeFile == "animated_image" ? ".gif" : "";
        const fileName = "leave" + threadID + ext;
        await download(attachments[0].url, __dirname+"/../events/src/mediaLeave/" + fileName);
        data.leaveAttachment = fileName;
      }
    }
    else return message.SyntaxError();
    
    await threadsData.setData(threadID, {
      data
    }, (err, info) => {
      if (err) return message.reply(`Has an error happened, please try again later: ${err.name}: ${err.message}`);
      message.reply(`Saved your changes`);
    });
    
  }
};