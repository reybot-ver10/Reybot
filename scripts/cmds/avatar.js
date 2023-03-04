this.config = {
  name: "avatar",
  version: "1.0.0",
  author: {
    name: "JOHN RÉ",
    contacts: ""
  },
  cooldowns: 5,
  role: 0, 
  shortDescription: "Create an anime avatar ",
  longDescription: "Create an anime avatar with signature",
  category: "image",
  sendFile: {
    [__dirname+"/cache/hexcolor.png"]: "https://www.htlvietnam.com/images/bai-viet/code-mau/bang-ma-mau-02.jpg"
  },
  guide: "{p}{n} <character code or character name> |  <text background> |  <signature> |  <English color name or background color code (hex color)>\n{p}{n} help: see how to use the command"
};

module.exports = {
  config: this.config,
  start: async function({ args, message, download }) {
    const fs = require("fs-extra");
    const axios = require("axios");
    if (!args[0] || args[0] == "help") message.guideCmd();
    else {
  		try {
  		  message.reply(`Image initialization, please wait...`);
  		  const content = args.join(" ").trim().replace(/\s+/g, " ").replace(/(\s+\|)/g, "|").replace(/\|\s+/g,  "|").split("|");
  		  let idNhanVat, tenNhanvat;
  		  const chu_nen = content[1];
        const chu_ky  = content[2];
        const mau_nen = content[3];
  		  const dataChracter = (await axios.get("https://taoanhdep.kaysil.dev/v1/wibu/list")).data.data;
  		  
        if (!isNaN(content[0])) {
          idNhanVat = parseInt(content[0]);
          tenNhanvat = dataChracter[idNhanVat].characterName;
        }
        else {
          findChracter = dataChracter.find(item => item.characterName.toLowerCase() == content[0].toLowerCase());
          if (findChracter) {
            idNhanVat = findChracter.characterId;
            tenNhanvat = content[0];
          }
          else return message.reply("No characters called "+ Content [0] +" In the list of characters ");
        }
        
        const path = __dirname + "/cache/avatarAnime.jpg";
        let linkapi = encodeURI(`https://taoanhdep.kaysil.dev/v1/wibu/create?id_nhanvat=${idNhanVat}&chu_nen=${chu_nen}&chu_ky=${chu_ky}`);
        mau_nen ? linkapi += `&mau_nen=${encodeURIComponent(mau_nen)}` : "";
        await download(linkapi, path);
        message.reply({
          body: `Your avatar: ${tenNhanvat}\nNumber: ${idNhanVat}\nBackground: ${chu_nen}\nSignature: ${chu_ky}\nColor: ${mau_nen || "Default"}`, 
          attachment: fs.createReadStream(path)
        }, () => fs.unlinkSync(path));
  		}
  		catch(err) {
        return message.reply(`Error had happened ${err.name}: ${err.message}`);
		  }
	  }
  }
};