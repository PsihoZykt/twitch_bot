let blockedNames = require('./blocked_names')
const firebaseControllet = require("../firebaseController");
let banname = async (command, channel, userstate) => {
    const forbiddenName = command.name
    // let forbiddenName = message.split(' ')[1]
    let index = require('../index')
    let chat = index.chat;
    let client = index.client;
    // blockedNames.push({username: forbiddenName})
    await firebaseControllet.createForbiddenName(command)
    const moderCommentary = `Moderator commentary: [${command.text}]`;
    // fs.writeFileSync('./antispam/blocked_names.json', JSON.stringify(blockedNames), function (error) {
    //         if (error) throw error // если возникла ошибка
    //     }
    // );

    chat.forEach(el => {
        if (el.username.toLowerCase().indexOf(forbiddenName) !== -1) {
            client.timeout(channel, el.username, 1, "automatic timeout because of forbidden nickname " + moderCommentary)
                .then(data => console.log(data))
                .catch(err => console.log(err));
        }
    })
}
module.exports = banname;