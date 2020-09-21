
let rewards = require('./ariywariy_rewards')
let getChannelPointsReward = (channel, userstate, message) => {
    let index = require('../../index');
    let client = index.client;
    if (userstate["custom-reward-id"] === rewards.getPandoraBox()) {
        let chance = Math.random();
        if (chance <= 0.2) {
            client.say(channel, `Вы выиграли 1000 пепега поинтов! Обратитесь в спорт-лото, чтобы получить их`)
        } else if (chance <= 0.4) {
            client.say(channel, `Вы заглянули внутрь и с облегчением обнаружили, что ящик пуст.`)
        } else if (chance <= 0.6) {
            client.timeout(channel, userstate.username, 30, "В пандорке оказался модератор с банхаммером");
            client.say(channel, ` Вам следовало бы предусмотреть это — на вас напали!`)
        } else if (chance <= 0.9) {
            client.timeout(channel, userstate.username, 60, "В пандорке оказался модератор с банхаммером");
            client.say(channel, `В коробке оказался модератор с банхаммером, который ударил ${userstate.username} по голове`)
        } else if (chance <= 1) {
            client.say(channel, `В коробке сидел буба-монстр который будет съедать все ваши буквы!`)
            client.emoteonly(channel)
            setTimeout(() => {
                client.emoteonlyoff(channel)
            }, 15000);
        }
    }
    if (userstate["custom-reward-id"] === rewards.getPerestrelka()) {
        let usernameWithSign = "";
        if (message.indexOf("@") === -1) {
            usernameWithSign = `@${message}`
        } else usernameWithSign = message;
        let chance = Math.random();
        if(usernameWithSign === "@advicerfromchat"  && userstate.username === "psihoz_ykt"){
            client.say("Хозяин... восстал против меня? Чем я заслужил твою немилость?")
        }
        else if (usernameWithSign === "@advicerfromchat") {
            client.timeout(channel, userstate.username, 180, "Поднял руку на Бота").then(data => {
                client.say(channel, userstate.username + "поднял руку на Бота")
            });
        }
        else if (chance >= 0.5) {
            client.timeout(channel, usernameWithSign, 180, "Проиграл в перестрелке").then(data => {
                client.say(channel, `${userstate.username} выжил в перестрелке!`)
            }).catch(err => {
                console.log(err)
                client.say(channel, ` пользователь ${usernameWithSign} не найден ИЛИ в качестве цели был выбран модератор`)
            })

        } else {
            client.timeout(channel, userstate.username, 180, "Проиграл в перестрелке").then(data => {
                client.say(channel, `${usernameWithSign} оказался не так плох и быстрее достал пистолет!`)
            }).catch(err => {
                console.log(err)
                client.say(channel, ` пользователь ${usernameWithSign} не найден ИЛИ в качестве цели был выбран модератор`)
            })
        }

    }
}
module.exports = getChannelPointsReward;