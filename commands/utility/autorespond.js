const { betterEmbedBuilder, loadAutoresponds } = require("../../utils");

module.exports = {
    name: "autorespond",
    description: "Permet la gestion des réponses automatiques",
    category: "Utilitaire",
    permission: "moderateur",
    template: [
        {type: "string", required: true, name: "type", options: ["set", "delete", "list", "update"]},
        {type: "string", required: false, name: "entrée - valeur | entrée | null"}
    ],
    async execute(client, message, args) {
        switch(args[0]) {
            case "set":
                const splittedArgs = args[1].split(" ");
                if (splittedArgs.length < 2) {
                    message.channel.send(betterEmbedBuilder({color: "red", description: `\`⚠️\` **Erreur**: Veuillez spécifier une entrée et une réponse automatique.`}))
                    return;
                }
                await client.db.query("INSERT INTO autorespond (entry, response, server) VALUES (?, ?, ?)", [splittedArgs[0], splittedArgs.slice(1).join(" "), message.guild.id.toString()]);
                client.autoresponds.push({entry:splittedArgs[0], response: splittedArgs.slice(1).join(" "), server: message.guild.id});
                message.channel.send(betterEmbedBuilder({color: "green", description: `\`✅\` La réponse automatique suivante a bien été associée à **${splittedArgs[0]}**:\n${splittedArgs.slice(1).join(" ")}`}));
                break;

            case "delete":
                if (args[1].split(" ").length !== 1) {
                    message.channel.send(betterEmbedBuilder({color: "red", description: args[1] ? `\`⚠️\` **Erreur**: Veuillez spécifier uniquement une réponse automatique à supprimer.` : `\`⚠️\` **Erreur**: Veuillez spécifier une réponse automatique à supprimer.`}));
                    return;
                }
                let autorespondFound = false;
                client.autoresponds.forEach(autorespond => {
                    if (autorespond.entry === args[1]) {
                        autorespondFound = true
                    }
                });
                if (autorespondFound) {
                    await client.db.query("DELETE FROM autorespond WHERE entry = ?", [args[1]]);
                    client.autoresponds = client.autoresponds.filter(autorespond => autorespond.entry !== args[1]);
                    message.channel.send(betterEmbedBuilder({color: "green", description: `\`✅\` La réponse automatique **${args[1]}** a bien été supprimée.`}));
                }
                break;

            case "list":
                let response = "";
                client.autoresponds.forEach(autorespond => {
                    response += `- **${autorespond.entry}**:\n> ${autorespond.response}\n\n`
                });
                message.channel.send(betterEmbedBuilder({color: "blue", title: "`📜` Liste des réponses automatiques", description: response.length > 0 ? response.slice(0, -2) : "Aucune réponse automatique définie"}))
                break;

            case "update":
                loadAutoresponds(client);
                message.channel.send(betterEmbedBuilder({color: "green", description: "`✅` Les réponses automatiques ont été mis à jour."}));
                break;
        }
    }
}