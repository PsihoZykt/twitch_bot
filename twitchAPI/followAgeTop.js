let axios = require('axios')
let getFollowAgeTop = (userstate) => {
    let channelId = userstate["room-id"];
    return axios.get(`https://api.twitch.tv/helix/users/follows?to_id=${channelId}&first=100`, {
        headers: {
            "Authorization": "Bearer 9tlch0mg5br3b9h3wupia08ivo4kws",
            "Client-ID": "gp762nuuoqcoxypju8c569th9wz7q5",
            first: 100,
        }
    }).then((res) => {
        return axios.get(`https://api.twitch.tv/helix/users/follows?to_id=${channelId}&first=100&after=${res.data.pagination.cursor}`, {
            headers: {
                "Authorization": "Bearer 9tlch0mg5br3b9h3wupia08ivo4kws",
                "Client-ID": "gp762nuuoqcoxypju8c569th9wz7q5",
            }
        }).then(res => {
            return axios.get(`https://api.twitch.tv/helix/users/follows?to_id=${channelId}&first=100&after=${res.data.pagination.cursor}`, {
                headers: {
                    "Authorization": "Bearer 9tlch0mg5br3b9h3wupia08ivo4kws",
                    "Client-ID": "gp762nuuoqcoxypju8c569th9wz7q5",
                }
            }).then(res => {
                return axios.get(`https://api.twitch.tv/helix/users/follows?to_id=${channelId}&first=100&after=${res.data.pagination.cursor}`, {
                    headers: {
                        "Authorization": "Bearer 9tlch0mg5br3b9h3wupia08ivo4kws",
                        "Client-ID": "gp762nuuoqcoxypju8c569th9wz7q5",
                    }
                }).then(res => {
                })
            })
        })
    })
}
module.exports = getFollowAgeTop;