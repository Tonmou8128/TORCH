const { betterEmbedBuilder } = require("../../utils");

module.exports = {
    name: "sql",
    description: "Exécute une requête sur la base de donnée",
    category: "Administration",
    aliases: ["db", "mysql"],
    permission: "administrateur",
    protected: true,
    template: [
        {type: "string", required: true, name: "requête"}
    ],
    async execute(client, message, args) {
        const query = args.join(" ");
        let response;
        try {
            response = await client.db.query(query);
        } catch (error) {
            message.channel.send(betterEmbedBuilder({color: "red", title: "`⚠️` **Erreur:** Une erreur avec la requête est survenue.", description: error.message}));
            return;
        }
        const rows = response[0];
        let dbMessage = "";
        if (Array.isArray(rows)) {
            rows.forEach(line => {
                for (const [key, value] of Object.entries(line)) {
                    dbMessage += `**${key}**: ${value}\n`;
                }
                dbMessage += "\n";
            });
            message.channel.send(dbMessage?.length > 0 ? dbMessage : "Aucun résulatat");
        }
        else message.channel.send(betterEmbedBuilder({color: "green", description: "`✅` Requête effectuée avec succès."}));
    }
}