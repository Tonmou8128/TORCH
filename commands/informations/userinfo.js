const { betterEmbedBuilder } = require("../../utils.js");

module.exports = {
    name: "userinfo",
    description: "Liste les informations d'un utilisateur",
    category: "Informations",
    aliases: ["profile"],
    template: [
        {type: "member", required: false, name: "utilisateur"}
    ],
    execute(client, message, args) {
        let member = args[0] ?? message.member;
        const fields = [
            {title: "Mention", description: `<@${member.id}>`, inline: true},
            {title: "Nom d'utilisateur", description: member.user.username, inline: true},
            {title: "Identifiant", description: member.id, inline: true},
            {title: "Date de création du compte", description: `<t:${Math.floor(member.user.createdTimestamp/1000)}:f>`, inline: true},
            {title: "Date d'arrivée dans le serveur", description: `<t:${Math.floor(member.joinedTimestamp/1000)}:f>`, inline: true},
            {title: "Rôles", description: member.roles.cache.filter(role => role.id !== message.guild.id).sort((x, y) => y.position - x.position).map(role => `<@&${role.id}>`).join(" ")}
        ]
        message.channel.send(betterEmbedBuilder({title: `\`📂\` Informations sur ${member.user.displayName}`, color: "blue", fields: fields, thumbnail: member.user.displayAvatarURL()}));
    }
}