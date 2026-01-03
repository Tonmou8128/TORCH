const { betterEmbedBuilder } = require("../../utils");

module.exports = {
    name: "nuke",
    description: "Réinitialise le salon",
    category: "Modération",
    aliases: ["resetchannel", "clearall"],
    permissions: "Administrator",
    async execute(client, message) {
        await message.channel.clone().then((channel) => channel.setPosition(message.channel.position));
        message.channel.delete().catch((error) => message.channel.send(betterEmbedBuilder({color: "red", description: "`⚠️` Une erreur est survenue (le salon a quand même été clone je crois)"})));
    }
}