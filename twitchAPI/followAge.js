let axios = require('axios')
let followAgeEndpoint = "https://api.twitch.tv/helix/users/follows?"

let getFollowAge = (userstate) => {
    let usernameId = userstate["user-id"];
    let channelId = userstate["room-id"];
    return axios.get(`${followAgeEndpoint}from_id=${usernameId}&to_id=${channelId}`, {
        headers: {
            "Authorization": "Bearer 9tlch0mg5br3b9h3wupia08ivo4kws",
            "Client-ID": "gp762nuuoqcoxypju8c569th9wz7q5",
        }
    }).then((res) => {
        let currentDate = new Date();
        let followedDate = new Date(res.data.data[0]["followed_at"]);
        let difDate = currentDate - followedDate;
        let days = Math.ceil(difDate / (1000 * 60 * 60 * 24))
        return `@${userstate.username}, ты отслеживаешь канал уже ${days}d `
    }).catch(err => console.log(err))
}
module.exports = getFollowAge;