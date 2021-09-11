class Command {
    constructor(message) {
        const words = message.split(' ');
        this.type = words[0]
        if (words.length >= 2) {
            this.name = words[1]
        }
        if (words.length >= 3) {
            this.text = message.substr(words[0].length + words[1].length + 2)
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