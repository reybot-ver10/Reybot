this.config = {    
  name: "banner",
  version: "1.0.1",
  author: {
    name: "JOHN RÉ", 
    contacts: ""
  },
  cooldowns: 5,
  role: 0,
  shortDescription: "Create online service banner ", Longdescription:" Create cover online service cover ",
  category: "image",
  guide: "{prefix}banner <facebook> | <zalo> | <phone> | <momo> | <title> | <subtitle> | <titlefacebook> | <info> | [<Photo link> | or reply images]"
};

module.exports = {
  config: this.config,
  start: async function({ api, message, event, args, help }) {
    const axios = require("axios");
    const fs = require("fs-extra");
    const qs = require("querystring");
    
    const content = args.join(" ").trim().replace(/\s+/g, " ").replace(/(\s+\|)/g, "|").replace(/\|\s+/g,  "|").split("|");
    const apikey = "ntkhang";
    const facebook      = content[0],
    zalo                = content[1],
    phone               = content[2],
    momo                = content[3],
    title               = content[4],
    subtitle            = content[5],
    titlefacebook       = content[6],
    info                = content[7];
    
    const avatarurl     = event.messageReply ? ((event.messageReply.attachments.length > 0) ? event.messageReply.attachments[0].url : content[8]) : content[8];
    if (!avatarurl || !avatarurl.includes("http")) return message.reply(`Please enter a valid image link, use HELP $ {this.config.name} to see details of how to use the command`);
    let params = { facebook, zalo, phone, momo, title, subtitle, titlefacebook, info, avatarurl, apikey };
    for (let i in params) if (!params[i]) return message.SyntaxError();
    params = qs.stringify(params);
    message.reply(`Incoming images, please wait...`);
    const pathsave = __dirname + `/cache/banner${Date.now()}.jpg`;
    let imageBuffer;
    try {
      const response = await axios.get("https://goatbot.tk/taoanhdep/banner1?" + params, {
        responseType: "arraybuffer"
      });
      imageBuffer = response.data;
    }
    catch(error) {
      let err;
      if (error.response) err = JSON.parse(error.response.data.toString());
      else err = error;
      return message.reply(`Error has happened ${err.error} ${err.message}`);
    }
    fs.writeFileSync(pathsave, Buffer.from(imageBuffer));
    message.reply({ attachment: fs.createReadStream(pathsave) }, () => fs.unlinkSync(pathsave));
  }
};