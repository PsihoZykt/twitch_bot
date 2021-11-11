let blockedWords = require('./blocked_words')
let fs = require('fs');
let banp = async (command, channel, userstate) => {
    let index = require('../index')
    // let forbiddenWord = message.split(' ')[1]
    const forbiddenMessage = command.name
    let firebaseController = require('../firebaseController')
    let chat = index.chat;
    let client = index.client;

   await firebaseController.createForbiddenMessage(forbiddenMessage)
    // fs.writeFileSync('./antispam/blocked_words.json', JSON.stringify(blockedWords), function (error) {
    //         if (error) throw error // если возникла ошибка
    //     }
    // );
    chat.forEach(el => {
        if (el.message.toLowerCase().indexOf(forbiddenMessage.toLowerCase()) !== -1 ) {
            client.timeout(channel, el.username, 1,  "automatic timeout because of forbidden word")
                .then(data => console.log(data))
                .catch(err => console.log(err));
        }
    })
}
module.exports = banp;