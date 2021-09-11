let blockedWordsFile = require('./blocked_words');
let index = require('../index');
let antispam = (channel, userstate, message, self, chatBuffer) => {
    if (self) return;
    let chat = index.chat;
    let client = index.client;
    chat.push({message, username: userstate.username});
    if (!userstate.emotes)
        chatBuffer.push({userstate, message});
    let spamFlag = false;
    if (!userstate.emotes && chatBuffer.length >= 5) {
        spamFlag = chatBuffer.every(buffer => {
            let wordsInBufferMessage = buffer.message.split(' ');
            let wordsInUserMessage = message.split(' ');
            return wordsInBufferMessage.some(r => wordsInUserMessage.indexOf(r) >= 0)
        })

        if (spamFlag) client.say(channel, "Подозрение")
    }
    if (blockedWordsFile.some(r => message.split(' ').indexOf(r.messageText) >= 0)) {
        client.timeout(channel, userstate.username, 10, "Automatic ban due to bad word").then(data => console.log(data)).catch(err => console.log(err))
    }

    if (chatBuffer.length > 5) chatBuffer.shift();

};
module.exports = antispam;