let fs = require('fs')
let axios = require('axios')
let ariyUsersPath = './users/users.json'
let handleAriyUsersSystem = (client) => {
        setInterval(() => {
            axios.get(`http://tmi.twitch.tv/group/user/ariywariy/chatters`).then((res, err) => {
                    let content = JSON.parse(fs.readFileSync("./channels/ariywariy_users_system/users/users.json", 'utf8'));
                    let viewers = res.data.chatters.viewers;
                    let moders = res.data.chatters.moderators
                    viewers = viewers.concat(moders);
                    viewers.forEach((viewer) => {
                        let currentUser = content.find((user) => user.name === viewer)
                        if (!currentUser)
                            content.push({name: viewer, points: 0, messages: 0, timePoints: 0})
                        else content.map((user) => {
                            if (currentUser.name === user.name) {
                                user.points += 10;
                                user.timePoints += 10;
                            }
                        })
                        fs.writeFileSync("./channels/ariywariy_users_system/users/users.json", JSON.stringify(content), function (error) {
                            if (error) throw error; // если возникла ошибка
                        });

                    })
                }
            ).catch(err => console.log(err))

        }, 3600)
    let messageCounterBuffer = [];
// points buffer like : [ username: {username: username, messages: 1 }]
    client.on('chat', async (channel, userstate, message, self) => {
        if (self) return;
        if(channel !== "#ariywariy") return;
        let currentUser = messageCounterBuffer.find(user => {
            return user.name === userstate.username;
        })
        if (!currentUser) {
            messageCounterBuffer.push({
                name: userstate.username,
                messages: 1
            })
        } else {
            messageCounterBuffer.map(user => {
                if (user.name === userstate.username) {
                    user.messages++;
                }
            })
        }
        setInterval(() => {
            let content = JSON.parse(fs.readFileSync("./channels/ariywariy_users_system/users/users.json", 'utf8'));
            content.map(user => {
                let messages = 0;
                if (messageCounterBuffer.find(bufferUser => {
                    messages = bufferUser.messages
                    return bufferUser.name === user.name

                })
                ) {
                    user.messages += messages;
                    user.points += messages;
                }
            })
            fs.writeFileSync("./channels/ariywariy_users_system/users/users.json", JSON.stringify(content), function (error) {
                if (error) throw error; // если возникла ошибка
            });
            messageCounterBuffer = []
        }, 3600);

    })
};
module.exports = handleAriyUsersSystem;