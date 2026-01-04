const { betterEmbedBuilder } = require("../../utils.js");
const { mutedRoleName } = require("../../config.json");

module.exports = {
    name: "unmute",
    description: "Révoque le mutisme d'un membre",
    category: "Modération",
    permission: "helper",
    delete: true,
    template: [
        {type: "member", required: true, name: "crimier"}
    ],
    async execute(client, message, args) {
        const roles = await message.guild.roles.fetch();
        const mutedRole = roles.find(role => role.name === mutedRoleName);
        if (!mutedRole) {
            message.channel.send(betterEmbedBuilder({color: "red", description: `\`⚠️\` Il n'y a pas de rôle "Muted" sur le serveur.`}));
            return;
        };
        if (!args[0].roles.cache.some(role => role === mutedRole)) {
            message.channel.send(betterEmbedBuilder({color: "red", description: "`⚠️` Ce membre n'est pas muet."}));
            return;
        };
        args[0].roles.remove(mutedRole);
        message.channel.send(betterEmbedBuilder({color: "green", description: `\`🔉\` <@${args[0].id}> peut désormais s'exprimer.`}));
    }
}