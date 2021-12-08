const tmi = require('tmi.js');
const handlers = require('./commandsHandler')
let options = require('./bot_options')
const express = require("express");
let chat = [];
const client = new tmi.client(options);
client.connect().catch(console.error);
const path = require('path')
const app = express()
// let cors = require('cors')
app.use(express.json()) // Без этих  строк сервер не видит req.body

app.use('/', express.static(path.join(__dirname, 'client', 'build' )))
app.get('*', (req,res) => {
    const index = path.join(__dirname, 'client', 'build', 'index.html');
    res.sendFile(index);
})
const httpServer = require("http").createServer(app);
const io = require('socket.io')(httpServer, {  cors: {    origin: "*"}});
io.listen(httpServer);

httpServer.listen( 5000, () => console.log(`App has been started on port 5000`))
    .on("error", (err) => console.log(err))

io.on('connection', (client) => {
    client.on('subscribeToChat', (interval) => {
        console.log('client is subscribing to timer with interval ', interval);
        setInterval(() => {
            client.emit('chat', chat);
        }, interval);
    });
});
if(process.env.NODE_ENV === "production")  {

    // app.use(cors())

}

//Commands Handling
client.on('chat', async (channel, userstate, message, self) => {
    if (self) return;
    handlers.basicCommandsHandler.handleCommand(message, channel, userstate).then(res => {
            if (res) {
                console.log(userstate)
                chat.push({
                    channel: channel,
                    userstate: {username: "advicerfromchat" , color: "gold"},
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
                userstate: {username: "advicerfromchat" , color: "gold"},
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
        userstate,
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





