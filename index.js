const tmi = require('tmi.js');
const handlers = require('./commandsHandler')
let options = require('./bot_options')
let chat = [];
const client = new tmi.client(options);
client.connect().catch(console.error);

//Commands Handling
client.on('chat', async (channel, userstate, message, self) => {
    if (self) return;
    handlers.basicCommandsHandler.handleCommand(message, channel, userstate).then(res => {
            if (res) client.action(channel, res);
        })

});
//Hota lobby commands Handling
client.on('chat', async (channel, userstate, message, self) => {
    if (self) return;
    await handlers.lobbyCommandsHandler.handleCommand(message, channel, userstate).then(res => {
        if (res) client.action(channel, res)
    });

});

//Handles commands which are in the files ( creatures, spells for heroes etc)
client.on('chat', async (channel, userstate, message, self) => {
    if (self) return;

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
        id: userstate.id,
        message: message,
        time: Date.now()
    })
});
// Anti-bot\spam\moderating system
client.on('chat', async (channel, userstate, message, self) => {
    if (self) return;
    handlers.moderatingCommandsHandler.handleCommand(message, channel, userstate).then(res => {
        if (res) {
            if (res.forbidden) {
                client.deletemessage(channel, userstate.id)
                    .then(data => console.log(data))
                    .catch(err => console.log(err));
            }
        }
    });


});

module.exports.client = client;
module.exports.chat = chat;





