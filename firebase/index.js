//initialize firebase db
const serviceAccount = require('../twitch-bot-b6618-fa374aff3fee.json');
const {initializeApp, cert} = require('firebase-admin/app');
const {getFirestore,} = require('firebase-admin/firestore');
initializeApp({
    credential: cert(serviceAccount)
});
const db = getFirestore();
module.exports = db;