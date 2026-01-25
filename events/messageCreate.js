const { Events } = require("discord.js");
const { prefix, owner, permissions } = require("../config.json");
const { protectedServers } = require("../secret.json");
const { betterEmbedBuilder, usagePrinter } = require("../utils.js");
const { raw } = require("mysql2");

module.exports = {
    trigger: Events.MessageCreate,
    async execute(client, message) {
        if (message.content.startsWith(prefix)) await commandHandler(client, message);
        else autorespondHandler(client, message); // for other usages
    }
}

async function commandHandler(client, message) {
    if (!message.guild) {
        message.channel.send(betterEmbedBuilder({color: "red", description: "`⚠️` **Erreur:** Les commandes ne sont pas disponibles en message privé."}));
        return;
    }

    const allCommands = client.commands;
    let args = message.content.slice(prefix.length).trim().split(/ +/g);
    const name = args.shift().toLowerCase();
    const element = allCommands.get(name);
    if (!element) return;
    if (!protectedServersHandler(element, message)) return;
    if (element.delete) message.delete();
    if (!permissionsHandler(element, message)) return;
    const betterArgs = await argumentsHandler(client, element, args, message);
    if (!betterArgs) return;
    element.execute(client, message, betterArgs);
}

async function argumentsHandler(client, element, args, message) {
    let betterArgs = [];
    const template = element.template ?? [];
    const lastArgTemplate = template[template.length - 1] ?? {};

    const canExceed = lastArgTemplate.type === "string" && !lastArgTemplate.unique;
    if (args.length > template.length && !canExceed) {
        message.channel.send(betterEmbedBuilder({color: "red", description: `\`⚠️\` **Erreur:** Un élément inattendu a été rencontré: "*${args[args.length - 1]}*".\n\`📌\` **Usage:** \`${usagePrinter(element)}\``}));
        return false;
    }

    for (let i = 0; i < template.length; i++) {
        const type = template[i].type;
        const required = template[i].required;
        const name = template[i].name;
        const options = template[i].options;
        const rawArg = args[i];

        if (!rawArg) {
            if (required) {
                message.channel.send(betterEmbedBuilder({color: "red", description: `\`⚠️\` **Erreur:** L'argument obligatoire *${name}* est manquant.\n\`📌\` **Usage:** \`${usagePrinter(element)}\``}));
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
                    message.channel.send(betterEmbedBuilder({color: "red", description: `\`⚠️\` **Erreur:** L'argument *${name}* est incorrect. Un *int* est demandé.\n\`📌\` **Usage:** \`${usagePrinter(element)}\``}));
                    return false;
                }
                betterArgs.push(intArg);
                break;
            case "float":
                const floatArg = parseFloat(rawArg);
                if (Number.isNaN(floatArg)) {
                    message.channel.send(betterEmbedBuilder({color: "red", description: `\`⚠️\` **Erreur:** L'argument *${name}* est incorrect. Un *float* est demandé.\n\`📌\` **Usage:** \`${usagePrinter(element)}\``}));
                    return false;
                }
                betterArgs.push(floatArg);
                break;
            case "member":
                let member;
                const memberId = rawArg.replace("<@", "").replace("!", "").replace(">", "");
                member = await message.guild.members.fetch(memberId).catch(() => null);
                if (!member) {
                    message.channel.send(betterEmbedBuilder({color: "red", description: `\`⚠️\` **Erreur:** L'argument *${name}* est incorrect. Un *membre* (mention ou id.) est demandé.\n\`📌\` **Usage:** \`${usagePrinter(element)}\``}));
                    return false;
                }
                betterArgs.push(member);
                break;
            case "user":
                let user;
                const userId = rawArg.replace("<@", "").replace("!", "").replace(">", "");
                user = await client.users.fetch(userId);
                if (!user) {
                    message.channel.send(betterEmbedBuilder({color: "red", description: `\`⚠️\` **Erreur:** L'argument *${name}* est incorrect. Un *utilisateur* (mention ou id.) est demandé.\n\`📌\` **Usage:** \`${usagePrinter(element)}\``}));
                    return false;
                }
                betterArgs.push(user);
                break;
            case "boolean":
                if (rawArg === true) betterArgs.push(true);
                else if (rawArg === false) betterArgs.push(false);
                else {
                    message.channel.send(betterEmbedBuilder({color: "red", description: `\`⚠️\` **Erreur:** L'argument *${name}* est incorrect. Un booléen est demandé.\n\`📌\` **Usage:** \`${usagePrinter(element)}\``}))
                    return false
                };
                break;
            default:
                message.channel.send(betterEmbedBuilder({color: "red", description: `\`⚠️\` **Erreur:** Une erreur lors de la gestion des arguments de la commande est survenue. Type demandé: *${type}* pour l'argument *${name}* de la commande *${element.name}*.\n\`📌\` **Usage:** \`${usagePrinter(element)}\``}));
                return false;
        }
        if (options && !options.includes(rawArg)) {
            message.channel.send(betterEmbedBuilder({color: "red", description: `\`⚠️\` **Erreur:** L'argument *${rawArg}* doit être parmi \`${options}\`.\n\`📌\` **Usage:** \`${usagePrinter(element)}\``}));
            return false
        }
    }

    return betterArgs;
}

function permissionsHandler(element, message) {
    const rawPermission = element.permission;
    if (!rawPermission) return true;
    const permission = permissions[rawPermission];
    const member = message.member;
    if (permission === "owner" && member.id === owner) return true;
    if (member.permissions.has(permission)) return true;
    message.channel.send(betterEmbedBuilder({color: "red", description: `\`❌\` Vous n'avez pas la permission d'utiliser la commande **${element.name}**.`}))
    return false;
}

function protectedServersHandler(element, message) {
    if (element.protected && !protectedServers.includes(message.guild.id.toString())) {
        message.channel.send(betterEmbedBuilder({color: "red", description: "`❌` Cette commande n'est pas disponible dans ce serveur."}));
        return false
    }
    return true
}

function autorespondHandler(client, message) {
    client.autoresponds.forEach(autorespond => {
        if (message.content.split(" ").includes(autorespond.entry) && message.guild.id.toString() === autorespond.server) {
            message.channel.send(autorespond.response);
        }
    })
}