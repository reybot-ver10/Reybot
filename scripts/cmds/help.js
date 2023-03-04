this.config = {    
  name: "help",
  version: "1.0.1",
  author: {
    name: "JOHN RÉ", 
    contacts: ""
  },
  cooldowns: 5,
  role: 0,
  shortDescription: "See how to use the command", Longdescription:" See how to use the commands", 
  category:"Info", 
  guide:" {P} {n} [to blank | Number of pages | <Name>]"
  priority: 1,
  packages: "moment-timezone"
};

module.exports = {
  config: this.config,
  start: async function({ globalGoat, message, args, event, threadsData }) {
    const moment = require("moment-timezone");
    const { statSync, existsSync, createReadStream } = require("fs-extra");
    const axios = require("axios");
    const { threadID } = event;
    const dataThread = await threadsData.getData(threadID);
    const prefix = dataThread.prefix || globalGoat.config.prefix;
    let sortHelp = dataThread.sortHelp || "name";
    if (!["category", "name"].includes(sortHelp)) sortHelp = "name";
    const command = globalGoat.commands.get((args[0] || "").toLowerCase());
    
// ———————————————— LIST ALL COMMAND ——————————————— //
    if (!command && !args[0] || !isNaN(args[0])) {
      const arrayInfo = [];
      let msg = "";
      if (sortHelp == "name") {
        const page = parseInt(args[0]) || 1;
        const numberOfOnePage = 20;
        let i = 0;
        for (var [name, value] of (globalGoat.commands)) {
          value.config.shortDescription && value.config.shortDescription.length < 40 ? name += ` → ${value.config.shortDescription.charAt(0).toUpperCase() + value.config.shortDescription.slice(1)}` : "";
          arrayInfo.push({ data: name, priority: value.priority || 0 });
        }
        arrayInfo.sort((a, b) => a.data - b.data);
        arrayInfo.sort((a, b) => (a.priority > b.priority ?  -1 : 1));
        const startSlice = numberOfOnePage*page - numberOfOnePage;
        i = startSlice;
        const returnArray = arrayInfo.slice(startSlice, startSlice + numberOfOnePage);
        const characters = "──────────────────";
        
        for (let item of returnArray) {
          msg += `【${++i}】 ${item.data}\n`;
        }
        const doNotDelete = "[ 🐐 | Project Goat Bot ]";
        message.reply(`⊱ ⋅ ${characters}\n${msg}${characters} ⋅ ⊰\nTrang [ ${page}/${Math.ceil(arrayInfo.length/numberOfOnePage)} ]\nCurrent bot has ${globalGoat.commands.size} Command can be used\n» Gõ ${prefix}help <Page number> to see the command list\n» type ${prefix}help <Command name> To see details of how to use that command\n${characters} ⋅ ⊰\n${doNotDelete}`);
      }
      else if (sortHelp == "category") {
        for (let [name, value] of globalGoat.commands) arrayInfo.some(item => item.category == value.config.category.toLowerCase()) ? arrayInfo[arrayInfo.findIndex(item => item.category == value.config.category.toLowerCase())].names.push(value.config.name) : arrayInfo.push({ category: value.config.category.toLowerCase(), names: [value.config.name]});
        arrayInfo.sort((a, b) => (a.category < b.category ?  -1 : 1));
        for (let data of arrayInfo) {
          let categoryUpcase = "______ " + data.category.toUpperCase() + " ______";
          data.names.sort();
          msg += `${categoryUpcase}\n${data.names.join(", ")}\n`;
        }
        const characters = "───────────────";
        const doNotDelete = "[ 🐐 | Project Goat Bot ]";
        message.reply(`${msg}\n⊱ ⋅ ${characters} ⋅ ⊰\n» Current bot has ${globalGoat.commands.size} Command can be used, type ${prefix}help <Command name> To see details of how to use that command\n${characters} ⋅ ⊰\n${doNotDelete}`);
      }
    }
// ———————————— COMMAND DOES NOT EXIST ———————————— //
    else if (!command && args[0]) {
      return message.reply(`Command "${args[0]}" Does not exist`);
    }
// ————————————————— HELP COMMAND ————————————————— //
    else {
      const configCommand = command.config;
      let author = "", contacts = "";
      if (configCommand.author) {
        author = configCommand.author.name || "";
        contacts = configCommand.author.contacts || "";
      }
      
      const nameUpperCase = configCommand.name.toUpperCase();
      const characters = Array.from('─'.repeat(nameUpperCase.length)).join("");
      const title = `╭${characters}╮\n   ${nameUpperCase}\n╰${characters}╯`;
      
      let msg = `${title}\n📜Description: ${configCommand.longDescription || "Without"}` +
      `\n\n» Command name: ${configCommand.name}` +
      configCommand.shortName ? `» Other name: ${configCommand.shortName.join(", ")}` : "" +
      `\n\n» 👥Role: ${((configCommand.role == 0) ? "All users" : (configCommand.role == 1) ? "Group administrators" : "Admin bot" )}` +
      `\n» ⏱Time each time uses the command: ${configCommand.cooldowns || 1}s` +
      `\n» ✳️Phân loại: ${configCommand.category || "No classification"}` +
      `\n\n» 👨‍🎓Author: ${author}` +
      `\n» 📱Contacts: ${contacts}`;
      if (configCommand.guide) msg += `\n\n» 📄How to use:\n${configCommand.guide.replace(/\{prefix\}|\{p\}/g, prefix).replace(/\{name\}|\{n\}/g, configCommand.name)}\n✎﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏\n` +
      `📝Chú thích:\n• Inner content <xxxxx> is possible to change n • Content inside [a | b] is a or b or c`;
      const formSendMessage = {
        body: msg
      };
      
      const { sendFile } = configCommand;
      if (sendFile &&
          typeof(sendFile) == 'object' &&
          !Array.isArray(sendFile)
      ) {
        formSendMessage.attachment = [];
        for (let pathFile in sendFile) {
          if (!existsSync(pathFile)) await download(sendFile[pathFile], pathFile);
          formSendMessage.attachment.push(createReadStream(pathFile));
        }
      }
      return message.reply(formSendMessage);
    }
  }
};