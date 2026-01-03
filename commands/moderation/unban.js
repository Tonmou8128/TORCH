const { betterEmbedBuilder } = require("../../utils")

module.exports = {
    name: "unban",
    description: "Débannit un membre",
    category: "Modération",
    permission: "BanMembers",
    delete: true,
    template: [
        {type: "user", required: true, name: "utilisateur"}
    ],
    execute(client, message, args) {
        message.guild.bans.remove(args[0]);
        message.channel.send(betterEmbedBuilder({color: "green", description: `\`⛓️‍💥\` <@${args[0].id}> a été débanni.`}));
    }
}