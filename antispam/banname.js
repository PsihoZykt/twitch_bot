let blockedNames = require('./blocked_names')
let fs = require('fs');
let banname = (message, channel, userstate) => {
    forbiddenName = message.split(' ')[1]
    let index = require('../index')
    let chat = index.chat;
    let client = index.client;
    blockedNames.push({username: forbiddenName})
    fs.writeFileSync('./antispam/blocked_names.json', JSON.stringify(blockedNames), function (error) {
            if (error) throw error // если возникла ошибка
        }
    );
    chat.forEach(el => {
        console.log(el)
        console.log(el.username.toLowerCase().indexOf(forbiddenName))
        if (el.username.toLowerCase().indexOf(forbiddenName) !== -1) {
            client.timeout(channel, el.username, 1, "automatic timeout because of forbidden nickname")
                .then(data => console.log(data))
                .catch(err => console.log(err));
        }
    })
}
module.exports = banname;