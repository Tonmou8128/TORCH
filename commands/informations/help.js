const { embedBuilder, usagePrinter } = require("../../utils.js");

module.exports = {
    name: "help",
    description: "Liste toutes les commandes disponibles, ou donne des précisions sur une en particulier",
    category: "informations",
    template: [
        {type: "string", required: false, unique: true, name: "command"}
    ],
    execute(client, message, args) {
        if (args.length > 0) {
            const command = client.commands.get(...args);
            if (!command) {
                message.channel.send(embedBuilder({color: "red", description: `\`⚠️\` **Erreur:** La commande *${args[0]}* est inconnue.`}))
                return;
            }
            let aliasText = "";
            if (command.aliases) aliasText = `\n- **Alias:** ${command.aliases.join(", ")}`;
            message.channel.send(embedBuilder({color: "blue", title: `\`📜\` Informations sur la commande ${command.name}`, description: `- **Description:** ${command.description}\n- **Usage:** \`${usagePrinter(command)}\`${aliasText}\n- **Permission:** ${command.permission ?? "Aucune"}`}))
        }
        else {
            let categories = {} // must be like this: {informations: [{name: ping, command: module}, ...], test: [{...}]}
            let fields = []
            const allCommands = client.commands;
            for (const [name, command] of allCommands.entries()) {
                if (!categories[command.category]) categories[command.category] = [];
                const alias = command.aliases ?? []
                if (!alias.includes(name)) categories[command.category].push(command);
            }
            for (const key of Object.keys(categories)) {
                let desc = "";
                categories[key].forEach(command => {
                    desc += `- **${command.name}**: ${command.description}\n`
                });
                fields.push({title: key, description: desc.slice(0, -2)});
            }
            message.channel.send(embedBuilder({color: "blue", title: "`📜` Liste des commandes", fields: fields}));
        }
    }
}