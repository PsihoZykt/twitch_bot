let getSpellText = (spell) => {
    return {
        name: spell.name.replace('/ /g', "_"),
        text: `Cпелл ${spell.level} лвла ${spell.Magic}. Мана: ${spell.cost}. [Баз.] ${spell.basic} [Продв.] ${spell.advanced} [Эксп.] ${spell.expert} `
    }
}
module.exports  = getSpellText;
// "name":"Магическая стрела",
//     "level":1,
//     "cost":5,
//     "basic":"Выбор цели: вражеское существо. Наносит СМ*10+10 урона.",
//     "advanced":"То же, но СМ*10+20 урона.",
//     "expert":"То же, но СМ*10+30 урона.",
//     "Magic":"None"