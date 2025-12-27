const { Client, GatewayIntentBits, Events } = require("discord.js");
const { token } = require("./secret.json");
const fs = require("fs");

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
client.commands = new Map();

function registerAllCommands(client) {
    const allCategoryFolders = fs.readdirSync("./commands").filter(folder => fs.statSync(`./commands/${folder}`).isDirectory()); 
    allCategoryFolders.forEach(categoryFolder => {
        const allCommandsOfCategory = fs.readdirSync(`./commands/${categoryFolder}`).filter(file => file.endsWith(".js"));
        allCommandsOfCategory.forEach(file => {
            const element = require(`./commands/${categoryFolder}/${file}`);
            registerSingleCommand(client, element);
        })
    })
}

function registerSingleCommand(client, element) {
    const triggers = [element.name, ...(element.aliases ?? [])];
    triggers.forEach(trigger => client.commands.set(trigger, element));
}

function registerAllEvents(client) {
    const eventFiles = fs.readdirSync("./events").filter(file => file.endsWith(".js"));
    eventFiles.forEach(file => {
        const element = require(`./events/${file}`);
        registerSingleEvent(client, element);
    })
}

function registerSingleEvent(client, element) {
    if (element.once) client.once(element.trigger, (...args) => element.execute(client, ...args));
    else client.on(element.trigger, (...args) => element.execute(client, ...args))
}

client.once(Events.ClientReady, (readyClient) => {
    registerAllCommands(readyClient);
    registerAllEvents(readyClient);
    console.log("Ready !")
});

client.login(token);