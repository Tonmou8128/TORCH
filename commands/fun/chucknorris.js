module.exports = {
    name: "chucknorris",
    description: "Donne un Chuck Norris fact",
    category: "Fun",
    aliases: ["cn", "chuck", "norris", "chucknorrisfact", "cnf"],
    async execute(client, message) {
        const fact = await fetch("https://www.chuckfacts.xyz/api/rand");
        const jsonFact = await fact.json();
        message.channel.send(jsonFact.joke);
    }
}