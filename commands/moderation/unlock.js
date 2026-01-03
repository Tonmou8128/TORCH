const { PermissionFlagsBits } = require("discord.js");
const { betterEmbedBuilder } = require("../../utils")

module.exports = {
    name: "unlock",
    description: "Permet aux membres d'écrire dans le salon",
    category: "Modération",
    permissions: "BanMembers",
    execute(client, message) {
        message.channel.permissionOverwrites.delete(message.guild.id);
        message.channel.send(betterEmbedBuilder({color: "green", description: "`✅` Le salon a bien été débloqué."}));
    }
}