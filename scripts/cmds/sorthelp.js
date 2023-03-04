this.config = {    
  name: "sorthelp",
  version: "1.0.0",
  author: {
    name: "JOHN RÉ", 
    contacts: ""
  },
  cooldowns: 5,
  role: 0,
  shortDescription: "Create cover images, "
  longdescription:" Create beautiful cover images",
  category: "image",
  guide: "{prefix}{n} [name|category]\nEg: {p}{n} name"
};

module.exports = {
  config: this.config,
  start: async function({ message, event, args, threadsData }) {
    if (args[0] == "name") {
      threadsData.setData(event.threadID, { sortHelp: "name" }, (err) => {
        if (err) return message.reply("An error happened please try again later" + err.stack);
        else message.reply("Saved Settings Sorting Help List in alphabetical order");
      });
    }
    else if (args[0] == "category") {
      threadsData.setData(event.threadID, { sortHelp: "category" }, (err) => {
        if (err) return message.reply("Error happened please try again later" + err.stack);
        else message.reply("Saved settings sorting list help in group order");
      });
    }
    else message.SyntaxError();
  }
};