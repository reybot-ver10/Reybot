this.config = {    
  name: "count",
  version: "1.0.0",
  author: {
    name: "JOHN RÉ", 
    contacts: ""
  },
  cooldowns: 5,
  role: 0,
  shortDescription: "Count group messages",
  longDescription: "See the number of messages of all members or yourself (from the bot to the group)",
  category: "box chat",
  guide: "{prefix}count: Used to see your number of messages "
       + "\n{prefix}count @tag: Used to see the number of messages of tag "
       + "\n{prefix}count all: used to see the number of messages of all members"};

module.exports = {
  config: this.config,
  start: async function({ args, threadsData, message, event, globalGoat }) {
    const { threadID, senderID, messageID } = event;
    const threadData = await threadsData.getData(threadID);
    const { members } = threadData;
    
    if (args[0]) {
      let target;
      if (args[0].toLowerCase() == "all") target = members;
      else if (event.mentions) target = event.mentions;
      const arraySort = [];
      for (let id in target) {
        const count = members[id] ? members[id].count : 0;
        if (count == 0) continue;
        const name = members[id] ? members[id].name : "Người dùng facebook";
        arraySort.push({ name, count });
      }
      arraySort.sort((a, b) => b.count - a.count);
      
      const msg = arraySort.reduce((i, item) => i += `\n${item.name}: ${item.count} news`, "");
      
      message.reply({
        body: msg,
        mentions: [{
          id: senderID,
          tag: members[senderID].name
        }]
      });
    }
    else {
      return message.reply(`You have sent $ {Members [SenderID] .count} Message in this group`);
    }
  },
  
  whenChat: async ({ args, threadsData, message, client, event, api }) => {
    try {
      let { senderID, threadID, messageID, isGroup } = event;
      if (!client.allThreadData[threadID]) await threadsData.createData(threadID);
      const members = (await threadsData.getData(threadID)).members;
      
      if (!members[senderID]) {
        members[senderID] = {
          id: senderID,
          name: (await api.getUserInfo(senderID))[senderID].name,
          nickname: null,
          inGroup: true,
          count: 0
        };
        await threadsData.setData(threadID, { members });
      }
      
      members[senderID].count += 1;
      await threadsData.setData(threadID, { members });
    }
    catch (err) {}
  }
    
};