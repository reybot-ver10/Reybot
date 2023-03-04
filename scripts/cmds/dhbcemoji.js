this.config = {    
  name: "dhbcemoji",
  version: "1.0.0",
  author: {
    name: "JOHN RÉ", 
    contacts: ""
  },
  cooldowns: 5,
  role: 0,
  shortDescription: "The game chasing the word catching the word Emoji (Demo)", Longdescription:" Play the game to catch the image of the Emoji version (demo)",
  category: "game",
  guide: "{p}{n}"
};

module.exports = {
  config: this.config,
  start: async function({ globalGoat, message, event, download }) {
    const axios = require("axios");
    const fs = require("fs-extra");
    const datagame = (await axios.get("https://reybot.tk/api/duoihinhbatchuemoji")).data;
    const random = datagame.data;
    message.reply(`Please reply to this message with the answer\n${random.emoji1}${random.emoji2}\n${random.wordcomplete.replace(/\S/g, "█ ")}`, 
    (err, info) => globalGoat.whenReply[info.messageID] = {
      messageID: info.messageID,
      nameCmd: this.config.name,
      author: event.senderID,
      wordcomplete: random.wordcomplete
    });
  },
  
  whenReply: ({ message, Reply, event, globalGoat }) => {
    let { author, wordcomplete, messageID } = Reply;
    if (event.senderID != author) return message.reply("You are not the player of this question");
    function formatText (text) {
      return text.normalize("NFD")
      .toLowerCase()
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D");
    }
    
    (formatText(event.body) == formatText(wordcomplete)) ? message.reply("Congratulations you got the correct answer") : message.reply(`Oops, Wrong`);
      //message.reply(`Wrong, the answer is true: ${wordcomplete}`);
    delete globalGoat.whenReply[messageID];
  }
};
