const { PermissionFlagsBits } = require("discord.js");
const { betterEmbedBuilder } = require("../../utils")

module.exports = {
    name: "lock",
    description: "Empêche les membres d'écrire dans le salon",
    category: "Modération",
    permission: "moderateur",
    execute(client, message) {
        message.channel.permissionOverwrites.set([
            {id: message.guild.id, deny: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.CreatePrivateThreads, PermissionFlagsBits.CreatePublicThreads]}
        ]);
        message.channel.send(betterEmbedBuilder({color: "green", description: "`✅` Le salon a bien été bloqué."}));
    }
}