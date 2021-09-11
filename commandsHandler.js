const commandsFileHandler = require('./FileHandler')
let h3lobby = require('./h3lobby/h3lobby')
let getFollowAge = require('./twitchAPI/followAge');
let getFollowAgeTop = require('./twitchAPI/followAgeTop')
let banp = require('./antispam/banp')
let getChannelPointsReward = require('./channelPoints/ariywariy/channelPoints')
const Command = require('./command');

let commandsHandler = {
    async handleCommand(message, channel, userstate) {
        commandsFileHandler.setFileName(channel);
        const words = message.toLowerCase().split(' ');
        var commandRe = /!([\wа-яА-Я]+)/g;
        let regResult = commandRe.exec(message);
        let type = ""
        if (regResult !== null) {
            type = regResult[0];
        }
        //Privelegues commands
        if (userstate.mod || userstate.username === "psihoz_ykt" || userstate.subscriber) {
            switch (type) {
                case("!add"):
                    return this.addCommand(channel, message);
                case("!change"):
                    return this.changeCommand(channel, message)
                case("!delete"):
                    return this.deleteCommand(channel, message);
                case("!commands"):
                    return this.getAllCommands(channel);
                case ("!banp"):
                    return banp(message,channel,userstate)
                case("!rating"):
                    return await h3lobby.getRating(channel, words).then(res => {
                        return res;
                    });
                case("!stats"):
                    return await h3lobby.getStats(channel, words).then(res => {
                        return res;
                    });
                case("!last"):
                    return await h3lobby.getLast(channel, words).then(res => {
                        return res;
                    });
                case("!test"):
                    return "test"
                case ("!followage"): {
                    return await getFollowAge(userstate).then(res => {
                        return res;
                    });
                }

                default:
                    if (commandsFileHandler.findCommandInFile(type)) {
                        return this.findCommand(message);
                    } else {
                       return getChannelPointsReward(channel, userstate, message)
                    }
            }
        }
        // Non-privelegue commands
            switch(type) {
                case("!rating"):
                    return await h3lobby.getRating(channel, words).then(res => {
                        return res;
                    });
                case("!stats"):
                    return await h3lobby.getStats(channel, words).then(res => {
                        return res;
                    });
                case("!last"):
                    return await h3lobby.getLast(channel, words).then(res => {
                        return res;
                    });
                case ("!followage"): {
                    return await getFollowAge(userstate).then(res => {
                        return res;
                    });
                }
                default:
                    if (commandsFileHandler.findCommandInFile(type)) {
                        console.log("Non privelegue, find command")
                            return this.findCommand(message);
                    } else {
                        return getChannelPointsReward(channel, userstate, message)
                    }
            }

    },
    //Input: Users message like "!add 111 Hello world!"
    addCommand(channel, message) {
        const command = new Command(message);
        if (!command.text) return "";
        if (commandsFileHandler.addCommandToFile(command))
            return;
        else
            return command.getName() + " is already exists"

    },
    changeCommand
        (channel, message) {
        let messageCommand = new Command(message);
        if (commandsFileHandler.isCommandAlreadyExists(messageCommand)) {
            let command = commandsFileHandler.getCommandByName(messageCommand.getName());
            commandsFileHandler.rewriteCommand(command, messageCommand.getText());
            commandsFileHandler.updateFile();
        } else {
            return messageCommand.getName() + " does not exists"
        }
    }
    ,
    deleteCommand(channel, message) {
        const command = new Command(message);
        if (commandsFileHandler.isCommandAlreadyExists(command)) {
            commandsFileHandler.deleteCommandFromFile(command)
            commandsFileHandler.updateFile();
            return command.getName() + " was deleted"
        } else {
            console.log('doesnt exists')
            return command.getName() + " doesn't exists"
        }
    }
    ,
    getAllCommands(channel) {
        return commandsFileHandler.getCommandsNames().join(" ")

    },
    findCommand(message) {
        var commandRe = /!([\wа-яА-Я]+)/g;

        let commandName = commandRe.exec(message)[0];
        let username = "";
        var re = /@(\w+)/g;
        let regResult = re.exec(message);

        if (regResult !== null) {
            username = regResult[0];
        }

        let command = commandsFileHandler.findCommandInFile(commandName);
        return username + " " + command.text
    },
}
module.exports = commandsHandler