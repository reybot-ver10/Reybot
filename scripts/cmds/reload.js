this.config = {    
  name: "reload",
  version: "1.0.0",
  author: {
    name: "JOHN RÉ", 
    contacts: ""
  },
  cooldowns: 5,
  role: 0,
  shortDescription: "reload file config",
  longDescription: "Load the file config.json or configComands.json into turn globalGoat",
  category: "owner"
};

module.exports = {
  config: this.config,
  start: async function({ globalGoat, args, threadsData, message, event }) {
    try {
      const content = args[0].toLowerCase();
      if (["config"].includes(content)) {
        delete require.cache[require.resolve(client.dirConfig)];
        globalGoat.config = require(client.dirConfig);
        return message.reply("Reloaded data in file config.json into turn globalGoat");
      }
      else if (["cmds", "cmd", "command", "commands"].includes(content)) {
        delete require.cache[require.resolve(client.dirConfigCommands)];
        globalGoat.configComands = require(client.dirConfig);
        return message.reply("Reloaded data infile configComands.json into turn globalGoat");
      }
      else return message.SyntaxError();
    }
    catch (err) {
      message.reply(`Error has happened ${err.name}: ${err.message}`);
    }
  }
};