const { PermissionsBitField, PermissionFlagsBits } = require("discord.js");
const  { betterEmbedBuilder } = require("../../utils");

module.exports = {
    name: "clear",
    description: "Supprime les messages",
    category: "Modération",
    aliases: ["delete"],
    permission: "moderateur",
    template: [
        {type: "int", required: true, name: "montant"}
    ],
    execute(client, message, args) {
        if (args[0] <= 0 && args[0] >= 100) {
            message.channel.send(betterEmbedBuilder({description: "`⚠️` Veuillez donner un nombre entier compris entre 1 et 100.", color: "red"}));
            return;
        }
        message.channel.bulkDelete(args[0], true);
    }
}