let blockedWords = require('./blocked_words')
let fs = require('fs');
let banp = (message, channel, userstate) => {
    let index = require('../index')
    let forbiddenWord = message.split(' ')[1]

    let chat = index.chat;
    let client = index.client;
    console.log(chat)
    console.log("forbidden is " + forbiddenWord)
    blockedWords.push({messageText: forbiddenWord} )
    fs.writeFileSync('./antispam/blocked_words.json', JSON.stringify(blockedWords), function (error) {
            if (error) throw error // если возникла ошибка
        }
    );
    chat.forEach(el => {
        if (el.message.toLowerCase().indexOf(forbiddenWord.toLowerCase()) !== -1 ) {
            client.timeout(channel, el.username, 1,  "automatic timeout because of forbidden word")
                .then(data => console.log(data))
                .catch(err => console.log(err));
        }
    })
}
module.exports = banp;