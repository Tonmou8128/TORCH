const { Events } = require("discord.js");
const { prefix } = require("../config.json");
const { simpleEmbedBuilder } = require("../utils.js")

module.exports = {
    trigger: Events.MessageCreate,
    async execute(client, message) {
        if (message.content.startsWith(prefix)) await commandHandler(client, message);
        else; // for other usages
    }
}

async function commandHandler(client, message) {
    if (!message.guild) {
        message.channel.send("Les commandes ne sont pas disponibles en message privé.");
        return;
    }

    const allCommands = client.commands;
    let args = message.content.slice(prefix.length).trim().split(/ +/g);
    const name = args.shift().toLowerCase();
    const element = allCommands.get(name);
    if (!element) return;
    const betterArgs = await argumentsHandler(element, args, message);
    if (!betterArgs) return;
    element.execute(client, message, betterArgs);
}

async function argumentsHandler(element, args, message) {
    let betterArgs = [];
    const template = element.template;

    if (args.length > template.length && template[template.length - 1].type !== "string") {
        message.channel.send(simpleEmbedBuilder({color: "red", description: `\`⚠️\` **Erreur:** Un élément innatendu a été rencontré: "*${args[args.length - 1]}*".\n\`📌\` **Usage:** \`${usagePrinter(element)}\``}));
        return false;
    }

    for (let i = 0; i < template.length; i++) {
        const type = template[i].type;
        const required = template[i].required;
        const name = template[i].name;
        const rawArg = args[i];

        if (!rawArg) {
            if (required) {
                message.channel.send(simpleEmbedBuilder({color: "red", description: `\`⚠️\` **Erreur:** L'argument obligatoire *${name}* est manquant.\n\`📌\` **Usage:** \`${usagePrinter(element)}\``}));
                return false;
            }
            else break;
        }

        switch (type) {
            case "string":
                if (i === template.length - 1) {
                    betterArgs.push(args.slice(i).join(" "));
                }
                else betterArgs.push(rawArg);
                break;
            case "int":
                const intArg = parseFloat(rawArg);
                if (!Number.isInteger(intArg)) {
                    message.channel.send(simpleEmbedBuilder({color: "red", description: `\`⚠️\` **Erreur:** L'argument *${name}* est incorrect. Un *int* est demandé.\n\`📌\` **Usage:** \`${usagePrinter(element)}\``}));
                    return false;
                }
                betterArgs.push(intArg);
                break;
            case "float":
                const floatArg = parseFloat(rawArg);
                if (Number.isNaN(floatArg)) {
                    message.channel.send(simpleEmbedBuilder({color: "red", description: `\`⚠️\` **Erreur:** L'argument *${name}* est incorrect. Un *float* est demandé.\n\`📌\` **Usage:** \`${usagePrinter(element)}\``}));
                    return false;
                }
                betterArgs.push(floatArg);
                break;
            case "user":
                let member;
                const id = rawArg.replace("<@", "").replace("!", "").replace(">", "");
                member = await message.guild.members.fetch(id).catch(() => null);
                if (!member) {
                    message.channel.send(simpleEmbedBuilder({color: "red", description: `\`⚠️\` **Erreur:** L'argument *${name}* est incorrect. Un *utilisateur* (mention ou id.) est demandé.\n\`📌\` **Usage:** \`${usagePrinter(element)}\``}));
                    return false;
                }
                betterArgs.push(member);
                break;
            default:
                message.channel.send(simpleEmbedBuilder({color: "red", description: `\`⚠️\` **Erreur:** Une erreur lors de la gestion des arguments de la commande est survenue. Type demandé: *${type}* pour l'argument *${name}* de la commande *${element.name}*.\n\`📌\` **Usage:** \`${usagePrinter(element)}\``}));
        }
    }

    return betterArgs;
}

function usagePrinter(element) {
    let usage = `${prefix}${element.name}`;
    element.template.forEach(argument => {
        if (argument.required) usage += ` <${argument.name}>`;
        else usage += ` [${argument.name}]`;
    })
    return usage;
}