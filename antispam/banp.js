let blockedWords = require('./blocked_words')
let fs = require('fs');
let banp = async (command, channel, userstate) => {
    let index = require('../index')
    // let forbiddenWord = message.split(' ')[1]
    // DOn't ask me why it's work like that, IDK
    let forbiddenMessage = command.name
    if(command.text) forbiddenMessage= forbiddenMessage + " " +command.text
    let firebaseController = require('../firebaseController')
    let chat = index.chat;
    let client = index.client;
    console.log(forbiddenMessage)
   await firebaseController.createForbiddenMessage(forbiddenMessage, channel, userstate)
    chat.forEach(el => {
        if (el.message.indexOf(forbiddenMessage.toLowerCase()) !== -1 ) {
            client.timeout(el.channel, el.username, 1,  `automatic timeout because of forbidden word. Added by ${userstate.username} on ${channel}`)
                .then(data => console.log(data))
                .catch(err => console.log(err));
        }
    })
}
module.exports = banp;