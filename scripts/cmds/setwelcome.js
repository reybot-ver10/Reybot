this.config = {    
  name: "setwelcome",
  version: "1.0.0",
  author: {
    name: "JOHN RÉ", 
    contacts: ""
  },
  cooldowns: 5,
  role: 0,
  shortDescription: "Edit the content of the welcome message", Longdescription:" Edit the message content Welcome to the new member to join your chat group ",
  category: "box chat",
  guide: "{p}{n} text [<Content>|Reset]: Edit text or reset content to the default, existing shortcuts:"
       + "\n+ {userName}: Name of new member"
       + "\n+ {boxName}:  Name of the chat group"
       + "\n+ {multiple}: you || You"
       + "\n+ {session}:  The day"
       + "\n* Eg: {p}{n} text Hello {userName}, welcome to {boxName}, wish {multiple} A happy new day"
       + "\n"
       + "\nReply (Feedback) A message with a file with the content {p}{n} file: to send that file when a new member (photo, video, audio) "
       + "\n{p}{n} file reset: Delete file"
};

module.exports = {
  config: this.config,
  start: async function({ args, threadsData, globalGoat, message, event, download }) {
    const fs = require("fs-extra");
    const { threadID } = event;
    const data = (await threadsData.getData(threadID)).data;
    
    if (args[0] == "text") {
      if (!args[1]) return message.reply("Please search to enter the message content");
      else if (args[1] == "reset") data.welcomeMessage = null;
      else data.welcomeMessage = args.slice(1).join(" ");
    }
    else if (args[0] == "file") {
      if (args[1] == "reset") {
        try {
          fs.unlinkSync(__dirname+"/../events/src/mediaWelcome/" + data.welcomeAttachment);
        }
        catch(e){}
        data.welcomeAttachment = null;
      }
      else if (!event.messageReply || event.messageReply.attachments.length == 0) return message.reply("Please Reply (Feedback) a message containing image/video/audio file files");
      else {
        const attachments = event.messageReply.attachments;
        const typeFile = attachments[0].type;
        const ext = typeFile == "audio" ? ".mp3" :
        typeFile == "video" ? ".mp4" :
        typeFile == "photo" ? ".png" : 
        typeFile == "animated_image" ? ".gif" : "";
        const fileName = "welcome" + threadID + ext;
        await download(attachments[0].url, __dirname+"/../events/src/mediaWelcome/"+fileName);
        data.welcomeAttachment = fileName;
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