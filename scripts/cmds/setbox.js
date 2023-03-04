this.config = {    
  name: "setbox",
  version: "1.0.0",
  author: {
    name: "JOHN RÉ", 
    contacts: ""
  },
  cooldowns: 5,
  role: 0,
  shortDescription: "Edit your team",
  longDescription: "Edit your team",
  category: "box chat",
  guide: "{p}{n} [name|emoji|avatar] <Content editing>"
       + "\nDetails:"
       + "\n {p}{n} name <New name>: Rename the chat group"
       + "\n {p}{n} emoji <New Emoji>: Change Emoji Group"
       + "\n {p}{n} avatar <Photo link or reply a photo or attached 1 photo>: Change the avatar avatar"
};

module.exports = {
  config: this.config,
  start: async function({ message, api, event, args, threadsData, download }) {
    const fs = require("fs-extra");
    const axios = require("axios");
    
    if (args[0] == "name") {
      const newName = args[1];
      api.setTitle(newName, event.threadID, async function (err) {
        if (err) return message.reply("Sorry, an error has happened");
        message.reply("Changed the group name: " + newName);
        await threadsData.setData(event.threadID, {
          name: newName
        });
      });
    }
    else if (args[0] == "emoji") {
      const newEmoji = args[1];
      api.changeThreadEmoji(newEmoji, event.threadID, async function (err) {
        if (err) return message.reply("Sorry, an error has happened");
        message.reply("Changed Emoji Group into: " + newEmoji);
        await threadsData.setData(event.threadID, {
          emoji: newEmoji
        });
      }); 
    }
    else if (["avatar", "avt", "img"].includes(args[0])) {
      const urlImage = (event.messageReply && event.messageReply.attachments[0] && event.messageReply.attachments[0].type != share) ? event.messageReply.attachments[0].url : (event.attachments[0] && event.attachments[0].type != "share") ? event.attachments[0].url : args[1];
      
      if (!urlImage) return message.reply("Please include or reply an image or enter the link");
      const pathSave = __dirname + `/avatar${event.threadID}.png`;
      await download(urlImage, pathSave);
      api.changeGroupImage(fs.createReadStream(pathSave), event.threadID, async function (err) {
        if (err) return message.reply("Sorry, an error has happened");
        message.reply("Changed the group photo");
        fs.unlinkSync(pathSave);
        await threadsData.setData(event.threadID, {
          avatarbox: urlImage
        });
      });
    }
    else message.SyntaxError();
  }
};