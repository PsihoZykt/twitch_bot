const tmi = require('tmi.js');
const handlers = require('./commandsHandler')
let options = require('./bot_options')
const express = require("express");
let chat = [];
const client = new tmi.client(options);
client.connect().catch(console.error);
const path = require('path')
const {createServer} = require("http");
const {Server} = require("socket.io");
const app = express()
const server = createServer(app);

const io = new Server(server);
io.on("connection", () => {
    console.log('connected')
    io.emit("chat", chat)
})

let addToChat = ({channel, userstate = {username: "advicerfromchat", color: "gold"}, message}) => {
    chat.push({
        channel,
        userstate,
        message,
        time: Date.now()
    })
    io.emit("chat", chat)
}
// Enable front end
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, 'client', 'build')))

}

let port = process.env.PORT || 5000;
server.listen(port, () => console.log(`App has been started on port ${port}`))
    .on("error", (err) => console.log(err))

//Commands Handling
client.on('chat', async (channel, userstate, message, self) => {
    if (self) return;
    await handlers.basicCommandsHandler.handleCommand(message, channel, userstate).then(res => {
        addToChat({channel, message, userstate})
        if (res) {
            addToChat({channel, message: res})
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





