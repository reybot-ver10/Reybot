const fs = require("fs-extra");
this.config = {    
  name: "adminonly",
  version: "1.0.0",
  author: {
    name: "JOHN RÉ", 
    contacts: ""
  },
  cooldowns: 5,
  role: 2,
  shortDescription: "enable/disable only admin to use bot",
  longDescription: "enable/disable mode only admin can use bot",
  category: "admin",
  guide: "{prefix}{name} [on|off]"
};

module.exports = {
  config: this.config,
  start: function({ globalGoat, args, message, event, client }) {
    const { config } = globalGoat;
    if (args[0] == "on") {
      config.adminOnly = true;
      message.reply("Enabled mode only admin can use bot");
      fs.writeFileSync(client.dirConfig, JSON.stringify(config, null, 2));
    }
    else if (args[0] == "off") {
      config.adminOnly = false;
      message.reply("Disabled mode only admin can use bot");
      fs.writeFileSync(client.dirConfig, JSON.stringify(config, null, 2));
    }
    else return message.reply("Please select the mode on or off");
  }
};