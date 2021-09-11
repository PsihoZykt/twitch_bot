let blockedWords = require('./blocked_words')
let fs = require('fs');
let banp = (forbiddenWord, channel, userstate) => {
    let index = require('../index')
    let chat = index.chat;
    let client = index.client;
    chat.forEach(el => {
        if (el.message === forbiddenWord) {
            blockedWords.push({messageText: el.message.split(' ')[1]})
            fs.writeFileSync('./antispam/blocked_words.json', JSON.stringify(blockedWords), function (error) {
                    if (error) throw error // если возникла ошибка
                }
            );
            client.timeout(channel, userstate.username, 10, "automatic timeout because of forbidden word")
                .catch(err => console.log(err));
        }
    })
}
module.exports = banp;