const { betterEmbedBuilder } = require("../../utils.js");

module.exports = {
    name: "timestamp",
    description: "Donne l'heure indiquée",
    category: "Utilitaire",
    aliases: ["ts", "date"],
    template: [
        {type: "string", required: true, unique: true, name: "format"},
        {type: "string", required: false, unique: true, name: "date"}
    ],
    execute(client, message, args) {
        let date;
        if (args[1]) {
            const [calendar, hour, minute, second] = args[1].split(":");
            const [day, month, year] = calendar.split("/");
            console.log(year, month - 1, day, hour, minute, second)
            date = Math.floor(new Date(year, month - 1, day, hour, minute, second).getTime()/1000);
            if (!date) {
                message.channel.send(betterEmbedBuilder({color: "red", description: "`⚠️` Erreur avec la date donnée"}))
                return;
            }
        }
        else date = Math.floor(Date.now()/1000);
        message.channel.send(betterEmbedBuilder({color: "green", description: `\`⌚\` Timestamp: <t:${date}:${args[0]}> \`<t:${date}:${args[0]}>\``}))
    }
}