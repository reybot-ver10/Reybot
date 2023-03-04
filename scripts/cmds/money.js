this.config = {    
  name: "money",
  version: "1.0.0",
  author: {
    name: "JOHN RÉ", 
    contacts: ""
  },
  cooldowns: 5,
  role: 0,
  shortDescription: "See your money",
  longDescription: "See your existing amount ",
  category: "economy",
  guide: "{p}{n}"
};

module.exports = {
  config: this.config,
  start: async function({ message, usersData, event }) {
    const userData = await usersData.getData(event.senderID);
    message.reply(`You are having ${userData.money} coin`);
  }
  
};