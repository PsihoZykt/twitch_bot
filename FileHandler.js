const getCreatureText = require('./util/getCreatureText')
const getSpellText = require('./util/getSpellText')
const fs = require('fs');
const common = require('./commands/common.json');
const spells = require('./commands/spells')
const creatures = require('./commands/creatures.json');
commandsFileHandler = {
    constructor() {
        this.filename = "";
        this.filePath = "";
    },
    setFileName(filename) {
        this.filename = filename
        this.filePath = `./channels/${filename.substr(1)}.json`;
        if(!this.isFileForChannelExists()){
            fs.appendFileSync(this.filePath, "[]")
        }
    },
    getCommons() {
        return JSON.parse(JSON.stringify(common))
    },
    getSpells() {
        return JSON.parse(JSON.stringify(spells))

    },
    getChannelCommands() {
        return JSON.parse(fs.readFileSync(this.filePath, 'utf8'));
    },
    getCreatures() {
        return JSON.parse(JSON.stringify(creatures))
    },

    getCommands() {
        this.updateFile();
        return JSON.parse(this.commands)
    },
    updateFile() {
        this.commands = fs.readFileSync(this.filePath, 'utf8');
    },
    rewriteCommand(command, text) {
        let tempCommands = this.getCommands();
        let name = command.name;
        for (let i = 0; i < tempCommands.length; i++) {
            if (tempCommands[i].name === name) {
                tempCommands[i].text = text;
                fs.writeFileSync(this.filePath, JSON.stringify(tempCommands), function (error) {
                    if (error) throw error; // если возникла ошибка
                });
            }
        }
        this.updateFile();
    },
    getCommandByName(name) {
        let command = null;
        for (let i = 0; i < this.getCommands().length; i++) {
            if (name === this.getCommands()[i].name) {
                command = this.getCommands()[i];
                break;
            }
        }
        return command;

    },
    getCommandName(command) {
        return command.name;
    },
    isFileForChannelExists() {
        return fs.existsSync(this.filePath)

    },

    addCommandToFile(command) {
        if (!this.isCommandAlreadyExists(command)) {
            let content = this.getChannelCommands();
            content.push({name: command.getName(), text: command.getText()})
            fs.writeFileSync(this.filePath, JSON.stringify(content), function (error) {
                if (error) throw error; // если возникла ошибка
            });
            this.updateFile();
            return true;
        }
        return false;
    }
    ,

    getCommandsNames() {
        let commands = [];
        for (let i = 0; i < this.getCommands().length; i++) {
            commands.push(this.getCommands()[i].name);
        }
        return commands
    }
    ,
    deleteCommandFromFile(command) {
        let tempCommands = this.getChannelCommands();
        let name = command.getName();
        for (let i = 0; i < tempCommands.length; i++) {
            if (this.getCommandName(tempCommands[i]) === name) {
                tempCommands.splice(i, 1);
                fs.writeFileSync(this.filePath, JSON.stringify(tempCommands), function (error) {
                    if (error) throw error; // если возникла ошибка
                });
            }
        }
        this.updateFile();
    }
    ,
    isCommandAlreadyExists(command) {
        this.isFileForChannelExists(this.filePath);
        // В файле название команды начинается с !, а передается в функцию без !
        let commandName = command.getName();
        //Каждая команда - строка в файле
        const commands = this.getCommands();
        for (let i = 0; i < commands.length; i++) {
            let currentCommandName = commands[i].name;
            if (currentCommandName === commandName) {
                return true
            }
        }

        return false;
    }
    ,

    findCommandInFile(commandName) {

        let commands = this.getCommands();
        for (let i = 0; i < commands.length; i++) {
            let currentCommandName = commands[i].name;
            if ("!" + currentCommandName.toLowerCase() === commandName.toLowerCase()) return commands[i]
        }
        commands = this.getCommons();
        //если не нашло в файле команд, пытаемся найти в файле с общими командами
        for (let i = 0; i < commands.length; i++) {
            let currentCommandName = commands[i].name;
            if ("!" + currentCommandName.toLowerCase() === commandName.toLowerCase()) return commands[i]
        }
        commands = this.getCreatures();
        // Если не нашло в файле команд канала, пробуем найти в файле с существами
        for (let i = 0; i < commands.length; i++) {
            let currentCommandName = commands[i].name.replace(/ /g, "_")
                .replace(/-/g, "_");
            if ("!" + currentCommandName.toLowerCase() === commandName.toLowerCase()) return getCreatureText(commands[i])
        }
        // ищем в файле со спеллами
        commands = this.getSpells();
        for (let i = 0; i < commands.length; i++) {
            let currentCommandName = commands[i].name.replace(/ /g, "_");
            if ("!" + currentCommandName.toLowerCase() === commandName.toLowerCase()) return getSpellText(commands[i])
        }
        return null;
    }
    ,


}
;

module.exports = commandsFileHandler