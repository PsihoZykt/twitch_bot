const OBSWebSocket = require('obs-websocket-js');
const obs = new OBSWebSocket();
let obsConnect = () => {
    obs.connect({
        address: 'ab47b5d2b0b6.ngrok.io',
        password: '$up3rSecretP@ssw0rd'
    })
        .then(() => {
            console.log(`Success! We're connected & authenticated.`);

            return obs.send('GetSceneList');
        })
        .then(data => {
            console.log(`${data.scenes.length} Available Scenes!`);

            data.scenes.forEach(scene => {
                if (scene.name !== data.currentScene) {
                    console.log(`Found a different scene! Switching to Scene: ${scene.name}`);

                    obs.send('SetCurrentScene', {
                        'scene-name': scene.name
                    });
                }
            });
        })
        .catch(err => { // Promise convention dicates you have a catch on every chain.
            console.log(err);
        });

}
let obsTest = () => {
    // obs.send('GetSceneList').then(data => {
    //     console.log(data.scenes[0].sources);
    // });
    obs.send('SetTextGDIPlusProperties', {"source":"Opp_1", "text" : "Testing"}).then(data => {
        // console.log(data);
    }).catch(err => console.log(err));

}

module.exports = {
    obsConnect,
    obsTest,
}

