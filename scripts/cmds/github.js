this.config = {    
  name: "github",
  version: "1.0.0",
  author: {
    name: "JOHN RÉ", 
    contacts: ""
  },
  cooldowns: 5,
  role: 0,
  shortDescription: "See User Github information ", Longdescription:" View GitHub users publicly with ID",
  category: "other"
};

module.exports = {
  config: this.config,
  start: async function({ api, globalGoat, args, message, event, download }) {
    if (!args[0]) return api.sendMessage(`Username GitHub is not left blank!`, event.threadID, event.messageID);
    const moment = require("moment");
    const axios = require("axios");
    const fs = require("fs-extra");
    
    axios.get(`https://api.github.com/users/${encodeURI(args.join(' '))}`)
     .then(async body => {
       body = body.data;
       if(body.message) return sendandrep(`No Github users have found ID ${args.join(" ")}!`);
       let { login, avatar_url, name, id, html_url, public_repos, followers, following, location, created_at, bio } = body;
       const info = `>> ${login} Information! <<\n\nUsername: ${login}\nID: ${id}\nBio: ${bio || "No Bio"}\nPublic Repositories: ${public_repos || "None"}\nFollowers: ${followers}\nFollowing: ${following}\nLocation: ${location || "No Location"}\nAccount Created: ${moment(created_at).tz("Asia/Manila").format("DD/MM/YYYY HH:mm:ss")} (UTC +7)\nAvatar:`;
       await download(avatar_url, __dirname+"/cache/avatargithub.png");

       message.reply({ attachment: fs.createReadStream(__dirname+"/cache/avatargithub.png"), body: info}, () => fs.unlinkSync(__dirname+"/cache/avatargithub.png"));
     });
  }
};