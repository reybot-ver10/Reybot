this.config = {    
  name: "banner2",
  version: "1.0.1",
  author: {
    name: "JOHN RÉ", 
    contacts: ""
  },
  cooldowns: 5,
  role: 0,
  shortDescription: "Create cover images", Longdescription: "Create beautiful cover pictures",
  category: "image",
  guide: "{prefix}{n} <name> | <description> | <facebook> | <instagram> | <phone> | <location> | [<Photo link> | or Reply image] "};

module.exports = {
  config: this.config,
  start: async function({ api, message, event, args, help }) {
    const axios = require("axios");
    const fs = require("fs-extra");
    const qs = require("querystring");
    
    const content = args.join(" ").split("|").map(item => item = item.trim());
    
    const apikey = "ntkhang";
    const name  = content[0],
    description = content[1],
    facebook    = content[2],
    instagram   = content[3],
    phone       = content[4],
    location    = content[5],
    
    avatarurl     = event.messageReply ? ((event.messageReply.attachments.length > 0) ? event.messageReply.attachments[0].url : content[6]) : content[6];
    if (!avatarurl || !avatarurl.includes("http")) return message.reply(`Please enter a valid image link, use HELP $ {this.config.name} to see details of how to use the command`);
    let params = { apikey, name, description, facebook, instagram, phone, location, avatarurl };
    for (let i in params) if (!params[i]) return message.SyntaxError();
    params = qs.stringify(params);
    message.reply(`I am initiating pictures, please wait...`);
    const pathsave = __dirname + `/cache/banner2${Date.now()}.png`;
    let imageBuffer;
    axios.get("https://goatbot.tk/taoanhdep/banner2?"+params, {
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