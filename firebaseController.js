const db = require("./firebase");
const Command = require("./command");
const firebase = {
    async setHeroesMode(channel, command){
        channel = channel.slice(1)
        console.log("setHeroesMode" , command)
        if ((command.name && command.type) && (command.name === "enable" || command.name === "disable")) {
            const document = db.collection(channel).doc("heroesMode")
            console.log(document)
            await document.set(({
                mode: command.name
            }))
        }
    },
    async getHeroesMode(channel, command){
        channel = channel.slice(1)
        console.log(command)

        if ((command.type) ) {
            const document = db.collection(channel).doc("heroesMode")
            const heroesMode = await document.get()
            if(heroesMode.data()) return heroesMode.data().mode
        }
    },
    async create(channel, command) {
        channel = channel.slice(1)
        console.log(command)
        if (command.name && command.text) {
            const document = db.collection(channel).doc(command.name)
            await document.set(({
                text: command.text
            }))
        }
    },
    async read(channel, command) {

        // User tried to execute command
        if (command.type[0] === "!") {
            channel = channel.slice(1)
            const message = command.type.slice(1)
            const ref = db.collection(channel).doc(message)
            const doc = await ref.get();
            if (doc.data()) return doc.data().text
        }
    },

    async checkForForbidden(channel, command, userstate) {
        const forbiddenWordsRef = db.collection("forbiddenWords").doc(command.initial)
        const forbiddenWord = await forbiddenWordsRef.get()
        let forbiddenNamesRef = db.collection("forbiddenNames")
        let forbiddenNames = await forbiddenNamesRef.get()
        let forbiddenNameFlag = false
        forbiddenNames.forEach(name => {
                console.log(name.data().text)
                if (userstate.username.toLowerCase().indexOf(name.data().text.toLowerCase()) !== -1 ||
                    name.data().text.toLowerCase().indexOf(userstate.username.toLowerCase()) !== -1) {
                    forbiddenNameFlag = true;

                }
            }
        )
        if (forbiddenWord.data())
            return {
                message: command,
                username: userstate.username,
                forbidden: true,
                reason: "auto timeout because of forbidden message"
            }
        if (forbiddenNameFlag)
            return {
                message: command,
                username: userstate.username,
                forbidden: true,
                reason: "Auto timeout because of forbidden nickname"
            }

    },
    async update(channel, command) {
        channel = channel.slice(1)
        if (command.text && command.name) {
            try {
                const document = db.collection(channel).doc(command.name)
                await document.update(({
                    text: command.text
                }))
            } catch (e) {
                console.log(e)
            }

        }
    },
    async delete(channel, command) {
        channel = channel.slice(1)
        if (command.name)
            await db.collection(channel).doc(command.name).delete()
    },
    async createForbiddenMessage(message) {
        const document = db.collection("forbiddenWords").doc(message)
        await document.set(({
            text: message
        }))
    },
    async createForbiddenName(name) {
        const document = db.collection("forbiddenNames").doc(name)
        await document.set(({
            text: name
        }))
    }
}
module.exports = firebase