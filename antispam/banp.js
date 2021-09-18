let blockedWords = require('./blocked_words')
let fs = require('fs');
let banp = (forbiddenWord, channel, userstate) => {
    let index = require('../index')
    let chat = index.chat;
    let client = index.client;
    chat.forEach(el => {
        if (el.message.toLowerCase().indexOf(forbiddenWord) !== -1 ) {
            blockedWords.push({messageText: el.message.split(' ')[1]})
            fs.writeFileSync('./antispam/blocked_words.json', JSON.stringify(blockedWords), function (error) {
                    if (error) throw error // если возникла ошибка
                }
            );
            console.log(chat)
            client.timeout(channel, userstate.username, 1,  "automatic timeout because of forbidden word")
                .then(data => console.log(data))
                .catch(err => console.log(err));
        }
    })
}
module.exports = banp;