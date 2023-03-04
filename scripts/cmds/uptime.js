this.config = {    
  name: "uptime",
  version: "1.0.0",
  author: {
    name: "JOHN RÉ", 
    contacts: ""
  },
  cooldowns: 5,
  role: 0,
  shortDescription: "See the online bot time",
  longDescription: "See the online bot time",
  category: "system-bot",
  guide: "{p}{n}"
};

module.exports = {
  config: this.config,
  start: async function({ message }) {
    const timeRun = process.uptime();
		const hours   = Math.floor(timeRun / 3600);
		const minutes = Math.floor((timeRun % 3600) / 60);
		const seconds = Math.floor(timeRun % 60);
    message.reply(`Active bot ${hours ? hours + "h" : ""}${minutes ? minutes + "p" : ""}${seconds}s\n[ 🤖 | Project Rey Bot ]`);
  }
};