const tmi = require('tmi.js');
const handlers = require('./commandsHandler')
let options = require('./bot_options')
const express = require("express");
let chat = [];
const client = new tmi.client(options);
client.connect().catch(console.error);

if(process.env.NODE_ENV === "production")  {
    const express = require('express')
    const app = express()
    app.use('/', express.static(path.join(__dirname, 'client', 'build' )))
    app.get('*', (req,res) => {
        const index = path.join(__dirname, 'client', 'build', 'index.html');
        res.sendFile(index);
    })
}
const io = require('socket.io')();

io.on('connection', (client) => {
    client.on('subscribeToTimer', (interval) => {
        console.log('client is subscribing to timer with interval ', interval);
        setInterval(() => {
            client.emit('chat', chat);
        }, interval);
    });
});
const port = 8000;
io.listen(port);
console.log('listening on port ', port);
//Commands Handling
client.on('chat', async (channel, userstate, message, self) => {
    console.log(userstate)
    if (self) return;
    handlers.basicCommandsHandler.handleCommand(message, channel, userstate).then(res => {
            if (res) {
                // console.log(res)
                chat.push({
                    channel: channel,
                    username: "advicerfromchat",
                    id: null, // BOts id? i dont know,
                    message: res,
                    time: Date.now()
                })
                client.action(channel, res);
            }
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
        if (res) {
            console.log(res)
            chat.push({
                channel: channel,
                username: "advicerfromchat",
                id: null, // BOts id? i dont know,
                message: res,
                time: Date.now()
            })
            client.action(channel, res)
        }

    });

});
// Chat array handler
client.on('chat', async (channel, userstate, message, self) => {
    if(self) return
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





