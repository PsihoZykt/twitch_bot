const tmi = require('tmi.js');
const handlers = require('./commandsHandler')
let options = require('./bot_options')
let chat = [];
const client = new tmi.client(options);
client.connect().catch(console.error);

const db = require('./firebase')

//Commands Handling
client.on('chat', async (channel, userstate, message, self) => {
    if (self) return;
    handlers.basicCommandsHandler.handleCommand(message, channel, userstate)
        .then(res => {
            if (res) client.action(channel, res);
        })

});
//Hota lobby commands Handling
client.on('chat', async (channel, userstate, message, self) => {
    if (self) return;
    // This shit with async/await because of rating\stats requests
    await handlers.lobbyCommandsHandler.handleCommand(message, channel, userstate).then(res => {
        if (res) client.action(channel, res)
    });

});
client.on('chat', async (channel, userstate, message, self) => {
    if (self) return;
    // This shit with async/await because of rating\stats requests
    // TODO: Move async\await shit in separate .on method
    await handlers.heroesCommandsHandler.handleCommand(message, channel, userstate).then(res => {
        if (res) client.action(channel, res)

    });

});
// Chat array handler
client.on('chat', async (channel, userstate, message, self) => {
    if (self) return;
    chat.push({
        channel: channel,
        username: userstate.username,
        message: message,
        time: Date.now()
    })
});
// Anti-bot\spam\moderating system
client.on('chat', async (channel, userstate, message, self) => {
    // TODO: FIx antispam
    if (self) return;
    let antispam = require('./antispam/antispam');

    handlers.moderatingCommandsHandler.handleCommand(message, channel, userstate).then(res => {
        if (res) {
            if (res.forbidden) {
                client.timeout(channel, userstate.username, 1, res.reason)
                    .then(data => console.log(data))
                    .catch(err => console.log(err));
            }
        }
    });


});

module.exports.client = client;
module.exports.chat = chat;





