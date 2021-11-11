// !
const removeExclamation = (word) => {
    return word.slice(1)
}
// #
const removeNumberSign = word => {
    return word.slice(1);
}

const parseMessage = (message) => {
// this shit needs to find exclamation point (!command) in the middle of message
    var commandRe = /!([\wа-яА-Я]+)/g;
    let regResult = commandRe.exec(message);
    if (regResult !== null) {
        return {
            commandType: regResult[0],
            index: regResult.index,
            initialMessage: regResult.input,
        }
    }
    return {
        initialMessage: message
    }


}
module.exports = parseMessage