this.config = {    
  name: "prefix",
  version: "1.0.0",
  author: {
    name: "JOHN RÉ", 
    contacts: ""
  },
  cooldowns: 5,
  role: 0,
  shortDescription: "View or exchange prefix", 
  longdescription:" View or exchange Prefix of your group ",
  category: "custom",
  guide: "{prefix}prefix <Prefix want to change>: Change the group's prefix"
       + "\nprefix: View current prefix"
       + "\n"
       + "\nExample Change PreFix: {prefix}prefix !",
  priority: 1
};

module.exports = {
  config: this.config,
  start: async function({ globalGoat, threadsData, message, args, event }) {
    if (!args[0]) {
      const prefix = (await threadsData.getData(event.threadID)).prefix || globalGoat.config.data.prefix;
      return message.reply(`> Prefix of your group: ${prefix}\n> Prefix's system: ${globalGoat.config.prefix}\n> To change the prefix Please enter ${prefix} <new prefix>`);
    }
    await threadsData.setData(event.threadID, { prefix: args[0] }, (err, info) => {
      if (err) return message.reply(err.stack);
      return message.reply(`Prefix changed your group into \`${info.prefix}\``);
    });
  },
  
  whenChat: async ({ threadsData, message, args, event, setup, globalGoat }) => {
    if (event.body && event.body.toLowerCase() == "prefix") {
      return message.reply(`Prefix of your group: ${(await threadsData.getData(event.threadID)).prefix || globalGoat.config.prefix}\nPrefix's system: ${globalGoat.config.prefix}`);
    }
  }
};