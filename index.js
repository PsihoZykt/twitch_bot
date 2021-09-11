const tmi = require('tmi.js');
const commandsHandler = require('./commandsHandler')
let options = require('./bot_options')
let chat = [];
# port (as described above) and host are both wrong
const host = 'localhost';
const port = 3000;

# use alternate localhost and the port Heroku assigns to $PORT
const host = '0.0.0.0';
const port = process.env.PORT || 3000;
const client = new tmi.client(options);
client.connect()
client.on('whisper', async (channel, userstate, message, self) => {
        if (userstate.username === "psihoz_ykt") {
            if(message === "пирамидка"){
                client.say("ariywariy", "Kappa")
                client.say("ariywariy", "Kappa Kappa")
                client.say("ariywariy", "Kappa Kappa Kappa")
                client.say("ariywariy", "Kappa Kappa")
                client.say("ariywariy", "Kappa")

            }
            else
            client.say("ariywariy", message)
        }
    }
);
// client.on('connected', (address, port) => {
//     let handleAriyUsersSystem = require('./channels/ariywariy_users_system/users_system')
//     handleAriyUsersSystem(client);
// });
//Commands Handling
client.on('chat', async (channel, userstate, message, self) => {
    if (self) return;
    let data = ""
    // This shit with async/await because of rating\stats requests
    await commandsHandler.handleCommand(message, channel, userstate).then(res => data = res);
    if (data) {
        await client.action(channel, data);
    }
});
// Anti-bot\spam system
let chatBuffer = [];
client.on('chat', async (channel, userstate, message, self) => {
    // TODO: FIx antispam

    // let antispam = require('./antispam/antispam');
    // antispam(channel, userstate, message, self, chatBuffer)
});


module.exports.client = client;
module.exports.chat = chat;