this.config = {    
  name: "bannerbw",
  version: "1.0.1",
  author: {
    name: "JOHN RÉ", 
    contacts: ""
  },
  cooldowns: 5,
  role: 0,
  shortDescription: "Create online service banner ", Longdescription:" Create a cover photo supports online black style ",
  category: "image",
  guide: "{prefix}bannerbw <name> | <titlefacebook> | <facebook> | <phone> | <mail> | <location> | [<Photo link> | or Reply image]"
};

module.exports = {
  config: this.config,
  start: async function({ api, message, event, args, help }) {
    const axios = require("axios");
    const fs = require("fs-extra");
    const qs = require("querystring");
    
    const content = args.join(" ").trim().replace(/\s+/g, " ").replace(/(\s+\|)/g, "|").replace(/\|\s+/g,  "|").split("|");
    const name      = content[0],
    titlefacebook   = content[1],
    facebook        = content[2],
    phone           = content[3],
    mail            = content[4],
    location        = content[5],
    avatarurl         = event.messageReply ? ((event.messageReply.attachments.length > 0) ? event.messageReply.attachments[0].url : content[6]) : content[6];
    if (!avatarurl || !avatarurl.includes("http")) return message.reply(`Please enter a valid image link, use Help ${this.config.name} To see details how to use the command`);
    let params = { name, titlefacebook, facebook, phone, mail, location, avatarurl, apikey: "JOHN RÉ" };
    for (let i in params) if (!params[i]) return message.SyntaxError();
    params = qs.stringify(params);
    message.reply(`I am initiating pictures, please wait...`);
    const pathsave = __dirname + `/cache/bannerbw${Date.now()}.jpg`;
    
    axios.get("https://goatbot.tk/taoanhdep/banner-black-white?"+params, {
      responseType: "arraybuffer"
    })
    .then(data => {
      const imageBuffer = data.data;
      fs.writeFileSync(pathsave, Buffer.from(imageBuffer));
      message.reply({ attachment: fs.createReadStream(pathsave) }, () => fs.unlinkSync(pathsave));
    })
    .catch(error => {
      let err;
      if (error.response) err = JSON.parse(error.response.data.toString());
      else err = error;
      return message.reply(`Error has happened ${err.error} ${err.message}`);
    });
  }
};