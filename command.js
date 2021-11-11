class Command {
    constructor(message) {
        if(message && message.commandType){
            this.initial = message.initialMessage
            this.type = message.commandType
            const words = message.initialMessage.split(' ');
            if (words.length >= 2) {
                this.name = words[1]
            }
            if (words.length >= 3) {
                this.text = message.initialMessage.substr(words[0].length + words[1].length + 2)
            }
        }
        else {
            console.log(message)
            const words = message.initialMessage.split(' ');
            this.initial = message.initialMessage
            this.type = words[0]
            if (words.length >= 2) {
                this.name = words[1]
            }
            if (words.length >= 3) {
                this.text = message.initialMessage.substr(words[0].length + words[1].length + 2)
            }
        }


    }

    getName() {
        if (this.name !== undefined)
            return this.name;
        return null;
    }

    getText() {
        if (this.text !== undefined)
            return this.text;
        return null;
    }

}

module.exports = Command;