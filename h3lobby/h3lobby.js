let axios = require('axios')
let cheerio = require('cheerio')
let h3lobby = {
    getStreamerName(channel, words) {
        let streamerName = ""
        if (channel === "#ariywariy") streamerName = "Ariy";
        else if (channel === "#borodatiyky") streamerName = "BorodatiyKu";
        else streamerName = channel.substr(1);
        if (words.length > 1) {
            streamerName = words[1];
        }
        return streamerName;
    },
    getRating(channel, words) {
        let streamerName = this.getStreamerName(channel, words)

        return axios.get(`https://heroes3.tv/${streamerName}#g`).then((res, err) => {
            if (err) return console.error(err);
            let $ = cheerio.load(res.data);
            let title = $('.rating.val');
            return `У стримера сейчас ${title.text()} рейтинга`
        })

    },
    getStats(channel, words) {
        let streamerName = this.getStreamerName(channel, words)
        return axios.get(`https://heroes3.tv/${streamerName}#g`).then((res, err) => {
            if (err) return console.error(err);
            let $ = cheerio.load(res.data);

            // let games = $('.games.val').text();
            let games = $('.games.val')["0"].children[0].data

            if ($('.val.winColor').get(0) === undefined) {
                return `Игрок ${streamerName} не найден`
            }
            let wins = $('.val.winColor').get(0).children[0].data
            let loses = $('.val.defColor').get(0).children[0].data
            // let winrate = $('.val.winColor').children().text()
            let winrate = $('.val.winColor').children()["0"].children[0].data
            return `Всего игр: ${games}. ${wins} побед, ${loses} поражений. Винрейт: ${winrate}. Если на аккаунт зарегистрированно несколько ников, отображается статистика только одного`

        })
    },
    getLast(channel, words) {
        let streamerName = this.getStreamerName(channel, words)
        return axios.get(`https://heroes3.tv/${streamerName}#g`).then((res, err) => {
            if (err) return console.error(err);


            let $ = cheerio.load(res.data);

            let result = $('.gameHistory').children('div').first().children('.gameResult').children('.result').attr('class').split(' ')[1]
            let opp = $('.gameHistory').children('div').first().children('.opp')['1'].children[1].children[0].data
            return `Последняя игра ${result} против ${opp}`

        })
    }
}

module.exports = h3lobby;