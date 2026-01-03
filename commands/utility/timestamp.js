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
        let date = Math.floor(Date.now()/1000);
        if (args[0] === "help") {
            const time = 
            message.channel.send(betterEmbedBuilder({color: "blue", title: "`⌚` Aide sur le système de timestamp", description: `- Heure raccourcie: \`t\` (<t:${date}:t>)\n
                                                                                                                             - Heure agrandie: \`T\` (<t:${date}:T>)\n
                                                                                                                             - Date raccourcie: \`d\` (<t:${date}:d>)\n
                                                                                                                             - Date agrandie: \`D\` (<t:${date}:D>)\n
                                                                                                                             - Date agrandie avec heure raccourcie: \`f\` (<t:${date}:f>)\n
                                                                                                                             - Date agrandie avec jour et heure raccourcie: \`F\` (<t:${date}:f>)\n
                                                                                                                             - Relatif: \`R\` (<t:${date}:R>)`}));
            return;
        }
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
        message.channel.send(betterEmbedBuilder({color: "green", description: `\`⌚\` Timestamp: <t:${date}:${args[0]}> \`<t:${date}:${args[0]}>\``}))
    }
}