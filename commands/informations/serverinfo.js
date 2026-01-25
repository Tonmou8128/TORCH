const { betterEmbedBuilder } = require("../../utils.js")

module.exports = {
    name: "serverinfo",
    description: "Affiche les informations du serveur",
    category: "Informations",
    execute(client, message) {
        const guild = message.guild;
        const fields = [
            {title: "Description", description: guild.description ?? "Aucune description"},
            {title: "Identifiant", description: guild.id, inline: true},
            {title: "Propriétaire", description: `<@${guild.ownerId}>`, inline: true},
            {title: "Date de création", description: `<t:${Math.floor(guild.createdTimestamp/1000)}:f>`, inline: true},
            {title: "Membres", description: guild.memberCount.toString(), inline: true}
        ]
        message.channel.send(betterEmbedBuilder({title: `\`📖\` Informations sur le serveur ${guild.name}`, color: "blue", fields: fields, thumbnail: guild.iconURL()}))
    }
}