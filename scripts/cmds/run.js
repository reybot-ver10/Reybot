this.config = {    
  name: "run",
  version: "1.0.0",
  author: {
    name: "JOHN RÉ", 
    contacts: ""
  },
  cooldowns: 5,
  role: 2,
  shortDescription: "Quick code test ", Longdescription:"Test code fast",
  category: "owner",
  guide: "{prefix}run <The code needs to test>"
};

module.exports = {
  config: this.config,
  start: async function({ api, globalGoat, args, download, message, client, event, threadsData, usersData, usersModel, threadsModel, configCommands }) {
  	try {
  		eval("(async () => {"+args.join(" ")+"})();");
  	}
  	catch (e) {
  		message.send(`There was an error: ${e.message}`);
  	}
  }
};