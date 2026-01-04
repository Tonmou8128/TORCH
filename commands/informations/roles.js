const { betterEmbedBuilder } = require("../../utils");

module.exports = {
    name: "roles",
    description: "Liste tous les rôles du serveur",
    category: "Informations",
    async execute(client, message) {
        let everyRoles = await message.guild.roles.fetch();
        message.channel.send(betterEmbedBuilder({color: "blue", title: "`📜` Liste des rôles", description: everyRoles.filter(role => role.id !== message.guild.id).sort((x, y) => y.position - x.position).map(role => `<@&${role.id}>`).join(" ")}));
    }
}