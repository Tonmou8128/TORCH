const  { betterEmbedBuilder } = require("../../utils");

module.exports = {
    name: "clear",
    description: "Supprime les messages",
    category: "Modération",
    aliases: ["delete"],
    permissions: "BanMembers",
    template: [
        {type: "int", required: true, name: "montant"}
    ],
    execute(client, message, args) {
        if (args[0] <= 0) {
            message.channel.send(betterEmbedBuilder({description: "`⚠️` Veuillez donner un nombre entier supérieur à 0", color: "red"}));
            return;
        }
        message.channel.bulkDelete(args[0], true);
    }
}