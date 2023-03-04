this.config = {
  name: "uid",
  version: "1.0.0",
  author: {name: "JOHN RÉ", contacts: ""},
  cooldowns: 5,
  role: 0,
  shortDescription: "See ID", 
  longdescription:" View user's Facebook ID",
  category: "info",
  guide: "{prefix}uid: Used to view your Facebook ID\n{prefix}uid @tag: View the Facebook ID of the tag"
};

module.exports = {
  config: this.config,
  start: function({ message, event }) {
    const { mentions } = event;
    if (Object.keys(mentions) != 0) {
      let msg = "";
      for (let id in mentions) msg += `${mentions[id].replace("@", "")}: ${id}\n`;
      message.reply(msg);
    }
    else message.reply(event.senderID);
  }
};