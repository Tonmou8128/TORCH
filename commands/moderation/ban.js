const { betterEmbedBuilder } = require("../../utils")

module.exports = {
    name: "ban",
    description: "Bannit un membre",
    category: "Modération",
    permission: "BanMembers",
    delete: true,
    template: [
        {type: "member", required: true, name: "crimier"},
        {type: "string", required: false, name: "raison"}
    ],
    execute(client, message, args) {
        if (args[0].permissions.has("BanMembers")) {
            message.channel.send(betterEmbedBuilder({color: "red", description: "`❌` Ce membre ne peut pas être banni."}));
            return;
        }
        args[0].ban({reason: args[1]});
        let reason = "aucune justification";
        if (args[1]) reason = args[1];
        message.channel.send(betterEmbedBuilder({color: "green", description: `\`🔨\` <@${args[0].id}> a été banni pour ${reason}.`}));
    }
}