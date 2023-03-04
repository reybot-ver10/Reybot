this.config = {    
  name: "rules",
  version: "1.0.0",
  author: {
    name: "JOHN RÉ", 
    contacts: ""
  },
  cooldowns: 5,
  role: 0,
  shortDescription: "Group rules ", Longdescription:" Create/view/add/edit/delete your group rules",
  category: "Box chat",
  guide: "{prefix}rules [add | -a] <The rules want to add>: Add rules for the group"
       + "\n{prefix}rules: See the group's rules"
       + "\n{prefix}rules [edit | -e] <n> <Content after fix>: Revise the n n"
       + "\n{prefix} [delete | -d] <n>: Delete rules according to the n n number"
       + "\n{prefix}rules [remove | -r]: Delete all group rules"
       + "\n"
       + "\n-Ví dụ:"
       + "\n +{prefix}rules add no spam"
       + "\n +{prefix}rules -e 1 No spam messages in the group"
       + "\n +{prefix}rules -r"
};

module.exports = {
  config: this.config,
  start: async function({ api, globalGoat, args, download, message, event, threadsData }) {
    const axios = require("axios");
    const fs = require("fs-extra");
    
    const nameCommand = require(module.filename).name;
    const { senderID, threadID, messageID } = event;
    
    const pathImgRules = __dirname + "/database/rules.png";
    if (!fs.existsSync(pathImgRules)) await download("https://github.com/reybot-ver10/resources-reybot/raw/master/image/rule.png", pathImgRules);
    var type = args[0];
    var dataOfThread = (await threadsData.getData(threadID)).data;
    if (!dataOfThread.rules) {
      dataOfThread.rules = [];
      await threadsData.setData(threadID, {data: dataOfThread})
    }
    var rulesOfThread = dataOfThread.rules || [];
    if (!type) {
      var msg = "";
      var i = 1;
      for (let rules of rulesOfThread) {
        msg += `${i++}. ${rules}\n`;
      }
      message.reply({ body: msg || "This group has not created any rules", attachment: fs.createReadStream(pathImgRules)});
    }
    else if (type == "add" || type == "-a") {
      if (!args[1]) return message.SyntaxError(nameCommand);
      rulesOfThread.push(args.slice(1).join(" "));
      return await threadsData.setData(threadID, { data: dataOfThread }, (err) => {
        if (err) return message.reply(err.name + "\n" + err.message);
        message.reply(`Added new rules to the group`);
      });
    }
    else if (type == "delete" || type == "-d") {
      if (!args[1] || args[1] != "number") return message.SyntaxError(nameCommand);
      rulesOfThread.splice(args[1] - 1, 1);
      return await threadsData.setData(threadID, { data: dataOfThread }, (err) => {
        if (err) return message.reply(err.name + "\n" + err.message);
        message.reply(`Deleted stuffs ${args[1]} group`);
      })
    }
    else if (type == "remove" || type == "-r") {
      rulesOfThread = [];
      return await threadsData.setData(threadID, { data: dataOfThread }, (err) => {
        if (err) return message.reply(err.name + "\n" + err.message);
        message.reply(`Deleted the entire group's rules`);
      })
    }
  }
};
