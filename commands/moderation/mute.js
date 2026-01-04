const { betterEmbedBuilder } = require("../../utils.js");
const { mutedRoleName } = require("../../config.json");

module.exports = {
    name: "mute",
    description: "Rend un membre muet",
    category: "Modération",
    permission: "helper",
    delete: true,
    template: [
        {type: "member", required: true, name: "crimier"},
        {type: "string", required: false, name: "raison"}
    ],
    async execute(client, message, args) {
        if (args[0].permissions.has("ManageMessages")) {
            message.channel.send(betterEmbedBuilder({color: "red", description: "`❌` Ce membre ne peut pas être réduit au silence."}));
            return;
        }
        const roles = await message.guild.roles.fetch();
        const mutedRole = roles.find(role => role.name === mutedRoleName);
        if (!mutedRole) {
            message.channel.send(betterEmbedBuilder({color: "red", description: `\`⚠️\` Il n'y a pas de rôle "Muted" sur le serveur.`}));
            return;
        };
        if (args[0].roles.cache.some(role => role === mutedRole)) {
            message.channel.send(betterEmbedBuilder({color: "red", description: "`⚠️` Ce membre est déjà muet."}));
            return;
        };
        args[0].roles.add(mutedRole);
        let reason = "aucune justification";
        if (args[1]) reason = args[1];
        message.channel.send(betterEmbedBuilder({color: "green", description: `\`🔇\` <@${args[0].id}> a été réduit au silence pour ${reason}.`}));
    }
}