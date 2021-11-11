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
        // const forbiddenWordRef = db.collection("forbiddenWords").doc(command.initial)
        const forbiddenWordsRef = db.collection("forbiddenWords")
        // const forbiddenWord = await forbiddenWordRef.get()
        const forbiddenWords = await forbiddenWordsRef.get()
        let forbiddenNamesRef = db.collection("forbiddenNames")
        let forbiddenNames = await forbiddenNamesRef.get()
        let forbiddenNameFlag = false
        let forbiddenNameReason = "auto timeout because of forbidden name"
        let forbiddenWordReason = "auto timeout because of forbidden word"
        forbiddenNames.forEach(name => {
                if (userstate.username.toLowerCase().indexOf(name.data().text.toLowerCase()) !== -1 ||
                    name.data().text.toLowerCase().indexOf(userstate.username.toLowerCase()) !== -1) {
                    forbiddenNameFlag = true;
                    forbiddenNameReason = name.data().commentary
                }
            }
        )
        let forbiddenWordFlag = false
        forbiddenWords.forEach(word => {
            if(command.initial.toLowerCase().indexOf(word.data().text.toLowerCase()) !== -1){
                forbiddenWordFlag = true
                forbiddenWordReason = forbiddenWordReason + " added by " + word.data().author + " on " + word.data().channel
            }
        })

        if (forbiddenWordFlag)
            return {
                message: command,
                username: userstate.username,
                forbidden: true,
                reason: forbiddenWordReason
            }
        if (forbiddenNameFlag)
            return {
                message: command,
                username: userstate.username,
                forbidden: true,
                reason: "Auto ban from bot, moder commentary: [" + forbiddenNameReason + "]"
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
    async createForbiddenMessage(message, channel, userstate) {
        const document = db.collection("forbiddenWords").doc(message)
        await document.set(({
            text: message,
            author: userstate.username,
            channel: channel
        }))
    },
    async createForbiddenName(command) {
        const forbiddenName =  command.name
        let moderCommentary;
        if(command.text)
         moderCommentary = command.text
        else moderCommentary = ""
        const document = db.collection("forbiddenNames").doc(forbiddenName)
        await document.set(({
            text: forbiddenName,
            commentary: moderCommentary
        }))
    }
}
module.exports = firebase