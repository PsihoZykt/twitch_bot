const tmi = require('tmi.js');
const handlers = require('./commandsHandler')
let options = require('./bot_options')
const express = require("express");
let chat = [];
const client = new tmi.client(options);
client.connect().catch(console.error);
const path = require('path')
const { createServer } = require("http");
const { Server } = require("socket.io");
const app = express()
const server = createServer(app);

const io = new Server(server);
let addToChat = ({channel, userstate = {username: "advicerfromchat" , color: "gold"}, message}) => {
    chat.push({
        channel,
        userstate,
        message,
        time: Date.now()
    })
    client.emit(chat, chat)
}
if(process.env.NODE_ENV === "production")  {
    app.use(express.static(path.join(__dirname, 'client',  'build')))
    server.listen(process.env.PORT || 5000, () => console.log(`App has been started on port 5000`))
        .on("error", (err) => console.log(err))
    io.on('connection', (client) => {
        console.log('client is subscribing to timer with interval ');
        client.on('subscribeToChat', (interval) => {
            setInterval(() => {
                client.emit('chat', chat);
            }, interval);
        });
    });
}


//Commands Handling
client.on('chat', async (channel, userstate, message, self) => {
    if (self) return;
    handlers.basicCommandsHandler.handleCommand(message, channel, userstate).then(res => {
            if (res) {
                    addToChat({channel,  message})

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
           addToChat({message, channel, userstate})
            client.action(channel, res)
        }

    });

});
// Chat array handler
client.on('chat', async (channel, userstate, message, self) => {
    if(self) return
    addToChat({message, channel, userstate})
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





