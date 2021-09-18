let blockedWordsFile = require('./blocked_words');
let blockedNamesFile = require('./blocked_names');
let index = require('../index');
let antispam = (channel, userstate, message, self) => {
    if (self) return;
    let chat = index.chat;
    let client = index.client;
    if (blockedWordsFile.some(r => message.toLowerCase().indexOf(r.messageText) >= 0)) {
        client.timeout(channel, userstate.username, 1, "automatic timeout because of forbidden word")
            .then(data => console.log(data))
            .catch(err => console.log(err));
    }
    if (blockedNamesFile.some(r => userstate.username.toLowerCase().indexOf(r.username) >= 0)) {
        client.timeout(channel, userstate.username, 1, "automatic timeout because of forbidden name")
            .then(data => console.log(data))
            .catch(err => console.log(err));
    }


};
module.exports = antispam;