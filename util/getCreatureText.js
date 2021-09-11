let getCreatureText = (creature) => {
    let name =  creature.name.replace(/" "/g, "_");
    name = name.replace(/-/g, "_" );
    return {
        name: name,
        text: `${creature.name.toUpperCase()}: Атк: ${creature.attack} Зщт: ${creature.defence} Урон: ${creature.damage} Хп: ${creature.health} Скр: ${creature.speed}  Велью: ${creature.value}. ${creature.level}-й уровень ${creature.town} Способности: ${creature.ability}`
    }
}
module.exports = getCreatureText;
// "name":"Копейщик",
//     "attack":4,
//     "defence":5,
//     "damage":"1—3",
//     "health":10,
//     "speed":4,
//     "ability":"Иммунитет к кавалерийскому бонусу.",
//     "value":80,
//     "level":1,
//     "town":"castle",
//     "upgraded":"no"