this.config = {    
  name: "dhbc",
  version: "1.0.1",
  author: {
    name: "JOHN RÉ", 
    contacts: ""
  },
  cooldowns: 5,
  role: 0,
  shortDescription: "The game chasing the word shape (demo) ", Longdescription:" Play the game chasing the word (demo)",
  category: "game",
  guide: "{p}{n}"
};

module.exports = {
  config: this.config,
  start: async function({ globalGoat, message, event, download }) {
    const axios = require("axios");
    const fs = require("fs-extra");
    const datagame = (await axios.get("https://goatbot.tk/api/duoihinhbatchu")).data;
    const { wordcomplete, casi, image1, image2 } = datagame.data;
    const pathImage1 = __dirname + "/cache/dhbc1.jpg";
    const pathImage2 = __dirname + "/cache/dhbc2.jpg";
    await download(image1, pathImage1);
    await download(image2, pathImage2);
    message.reply({
      body: `Please reply to this message with the answer\n${wordcomplete.replace(/\S/g, "█ ")}${casi ? `\nThis is the name of the singer's song $ {CASI}` : ''}`,
      attachment: [fs.createReadStream(pathImage1), fs.createReadStream(pathImage2)]
    }, (err, info) => {
      fs.unlinkSync(pathImage1);
      fs.unlinkSync(pathImage2);
      globalGoat.whenReply[info.messageID] = {
        messageID: info.messageID,
        nameCmd: this.config.name,
        author: event.senderID,
        wordcomplete
      };
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
    
    (formatText(event.body) == formatText(wordcomplete)) ? message.reply("Congratulations on the right answer") : message.reply(`Oops, wrong`);
      //message.reply(`Wrong, the answer is true: ${wordcomplete}`);
    delete globalGoat.whenReply[messageID];
  }
};