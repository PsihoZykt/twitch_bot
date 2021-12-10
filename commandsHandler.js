let commandsFileHandler = require('./FileHandler')
let h3lobby = require('./h3lobby/h3lobby')
let banp = require('./antispam/banp')
let banname = require('./antispam/banname')
const Command = require('./command');
const firebaseController = require('./firebaseController')
const parseMessage = require('./util')
let handlers = {
    //TODO: Almost doesn't work, fix it?
    lobbyCommandsHandler: {
        async handleCommand(message, channel, userstate) {

            const command = new Command(parseMessage(message))
            let commandType = command.type
            if (commandType) {
                switch (commandType) {
                    case("!rating"):
                        return await h3lobby.getRating(channel, command).then(res => {
                            return res;
                        });
                    case("!stats"):
                        return await h3lobby.getStats(channel, command).then(res => {
                            return res;
                        });
                    case("!last"):
                        return await h3lobby.getLast(channel, command).then(res => {
                            return res;
                        });

                }
            }
        },

    },
    basicCommandsHandler: {
        async handleCommand(message, channel, userstate) {
            //TODO: migrate heroes comands to firebase
            const command = new Command(parseMessage(message))

            let heroesMode = await this.getHeroesMode(channel, command)

            //if heroes mode enabled we loooking through files
            if (heroesMode === "enable") {
                let commandsFileHandler = require('./FileHandler')
                commandsFileHandler.setFileName(channel);
                if (commandsFileHandler.findCommandInFile(command.type)) {
                    return this.findCommand(message);
                }
            }
            // if heroes mode is disabled we looging for commands in firabse
                let commandType = command.type
                // Privelegues commands
                if (commandType) {
                    if (userstate.mod || userstate.username === "psihoz_ykt" || userstate.username === channel.slice(1)) {
                        switch (commandType) {
                            case("!add"):
                                return this.addCommand(channel, command);
                            case("!setHeroes"):
                                return this.setHeroesMode(channel, command);
                            case("!change"):
                                return this.changeCommand(channel, command)
                            case("!delete"):
                                return this.deleteCommand(channel, command);
                            case("!commands"):
                                return this.getAllCommands(channel);
                            default: {
                                return this.getCommand(channel, command)

                            }
                        }

                    } else {
                        return this.getCommand(channel, command)
                    }
            }
        },

        //Input: Users message like "!add 111 Hello world!"
        async addCommand(channel, command) {
            await firebaseController.create(channel, command)
        },
        async getCommand(channel, command) {
            return await firebaseController.read(channel, command)
        },
        async changeCommand(channel, command) {
            await firebaseController.update(channel, command)
        },
        async deleteCommand(channel, command) {
            await firebaseController.delete(channel, command)
        },

        getAllCommands(channel) {
            return commandsFileHandler.getCommandsNames().join(" ")

        },
        async setHeroesMode(channel, command) {
            await firebaseController.setHeroesMode(channel, command)
        },
        async getHeroesMode(channel, command) {
            return await firebaseController.getHeroesMode(channel, command)
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

    },
    moderatingCommandsHandler: {
        async handleCommand(message, channel, userstate) {

            const command = new Command(parseMessage(message))
            let commandType = command.type

            if (commandType) {
                if (userstate.mod  || userstate.username === channel.slice(1)) {
                    switch (commandType) {
                        case ("!banp"):
                            return banp(command, channel, userstate)
                        case ("!banname"):
                            return banname(command, channel, userstate)
                    }
                } else {
                    return firebaseController.checkForForbidden(channel, command, userstate)
                }
            }
        },
    },
    heroesCommandsHandler: {
        async handleCommand(message, channel, userstate) {
            let commandsFileHandler = require('./FileHandler')
            let command = new Command(parseMessage(message))
            let heroesMode = await this.getHeroesMode(channel, command)
            if (heroesMode === "enable") {
                commandsFileHandler.setFileName(channel);
                if (commandsFileHandler.findCommandInFile(command.type))
                    return this.findCommand(message);
            }
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

        async getHeroesMode(channel, command) {
            return await firebaseController.getHeroesMode(channel, command)
        },
    }
}
module.exports = handlers