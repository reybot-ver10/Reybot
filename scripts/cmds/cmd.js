this.config = {    
  name: "cmd",
  version: "1.0.1",
  author: {
    name: "JOHN RÉ", 
    contacts: ""
  },
  cooldowns: 5,
  role: 1,
  shortDescription: "Command management", Longdescription:" Manage your command files ", Category:" Owner ", Guide:" {Prefix} CMD Load <Command file name>",
  packages: "path"
};

module.exports = {
  config: this.config,
  start: ({ envGlobal, globalGoat, args, download, message, event, client }) => {
    const { execSync } = require('child_process');
    const { loading } = globalGoat;
    const { join } = require("path");
    const chalk = require("chalk");
    const fs = require("fs-extra");
    const allWhenChat = globalGoat.whenChat;

    const loadCommand = function (filename) {
      try {
        const pathCommand = __dirname + `/${filename}.js`;
        
        if (!fs.existsSync(pathCommand)) throw new Error(`No file found ${filename}.js`);
        
        const oldCommand = require(join(__dirname, filename + ".js"));
        const oldNameCommand = oldCommand.config.name;
        const oldEnvConfig = oldCommand.config.envConfig || {};
        const oldEnvGlobal = oldCommand.config.envGlobal || {};
        
        // delete old command
        delete require.cache[require.resolve(pathCommand)];
        
        const command = require(join(__dirname, filename + ".js"));
        const configCommand = command.config;
        if (!configCommand) throw new Error("Config of command undefined");
        
        const nameScript = configCommand.name;
        // Check whenChat function
        const indexWhenChat = allWhenChat.findIndex(item => item == oldNameCommand);
        if (indexWhenChat != -1) allWhenChat[indexWhenChat] = null;
        if (command.whenChat) allWhenChat.push(nameScript);
        // -------------
        var { packages, envGlobal, envConfig } = configCommand;
        const { configCommands } = globalGoat;
        if (!command.start) throw new Error(`Command is not missing Function Start! `); 
        if (! ConfigCommand.name) throw new Error (`Command Name cannot be empty!`);
        if (packages) {
          packages = (typeof packages == "string") ? packages.trim().replace(/\s+/g, '').split(',') : packages;
          if (!Array.isArray(packages)) throw new Error("Value packages needs to be array");
  				for (let i of packages) {
  				  try { require(i) }
  				  catch (err) {
      				try {
                loading(`Install package ${chalk.hex("#ff5208")(i)}`, "PACKAGE");
      				  execSync("npm install " + i +" -s");
      				  loading(`Đã cài đặt package ${chalk.hex("#ff5208")(i)} cho Script ${chalk.hex("#FFFF00")(nameScript)} thành công\n`, "PACKAGE");
      				}
      				catch(e) {
      				  loading.err(`Cannot install Package ${chalk.hex("#ff0000")(i)} for scripts ${chalk.hex("#ff0000")(nameScript)} with errors: ${e.stack}\n`, "PACKAGE");
      				}
      			}
  				}
        }
        // env Global
        if (envGlobal && typeof envGlobal == "object") {
    		  if (!configCommands.envGlobal) configCommands.envGlobal = {};
    		  for (let i in envGlobal) if (configCommands.envGlobal[i] != envGlobal[i]) configCommands.envGlobal[i] = envGlobal[i];
        }
        // env Config
        if (envConfig && typeof envConfig == "object") {
          for (const [key, value] of Object.entries(envConfig)) {
    		    if (!configCommands.envCommands) configCommands.envCommands = {};
    		    if (!configCommands.envCommands[nameScript]) configCommands.envCommands[nameScript] = {};
    		    if (JSON.stringify(configCommands.envCommands[nameScript]) != JSON.stringify(oldEnvConfig)) configCommands.envCommands[nameScript] = envConfig;
    		  }
        }
        globalGoat.commands.delete(oldNameCommand);
        globalGoat.commands.set(nameScript, command);
        fs.writeFileSync(client.dirConfigCommands, JSON.stringify(configCommands, null, 2));
        globalGoat.print.master("Load the command file "+filename+".js", "LOADED");
        return {
          status: "succes",
          name: filename
        };
      }
      catch(err) {
        return {
          status: "failed",
          name: filename,
          error: err
        };
      }
    };
    
    if (args[0] == "load") {
      const infoLoad = loadCommand(args[1]);
      if (infoLoad.status == "success") message.reply(`Load command ${infoLoad.name} success`);
      else message.reply(`Load command ${infoLoad.name} failed with errors\n${infoLoad.error.stack.split("\n").filter(i => i.length > 0).slice(0, 5).join("\n")}`);
      globalGoat.whenChat = allWhenChat.filter(item => item != null);
    }
    else if (args[0].toLowerCase() == "loadall") {
      const allFile = fs.readdirSync(__dirname)
      .filter(item => item.endsWith(".js"))
      .map(item => item = item.split(".")[0]);
      const arraySucces = [];
      const arrayFail = [];
      for (let name of allFile) {
        const infoLoad = loadCommand(name);
        infoLoad.status == "succes" ? arraySucces.push(name) :
        arrayFail.push(`${name}: ${infoLoad.error.name}: ${infoLoad.error.message}`);
      }
      globalGoat.whenChat = allWhenChat.filter(item => item != null);
      message.reply(`Successfully loaded ${arraySucces.length} command`
        + `\n${arrayFail.length > 0 ? `\nLoad thất bại ${arrayFail.length} command\n${arrayFail.join("\n")})` : ""}`);
    }
    else message.SyntaxError();
  }
};