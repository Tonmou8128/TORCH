const { Client, GatewayIntentBits, Events } = require("discord.js");
const { token } = require("./secret.json");
const fs = require("fs");
const Module = require("module");

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Map();

function registerAllCommands(client) {
    const allCategoryFolders = fs.readdirSync("./commands").filter(folder => fs.statSync(`./commands/${folder}`).isDirectory()); 
    allCategoryFolders.forEach(categoryFolder => {
        const allCommandsOfCategory = fs.readdirSync(`./commands/${categoryFolder}`).filter(file => file.endsWith(".js"));
        allCommandsOfCategory.forEach(file => {
            const module = require(`./commands/${categoryFolder}/${file}`);
            registerSingleCommand(client, module);
        })
    })
}

function registerSingleCommand(client, module) {
    const triggers = [module.name, ...(module.aliases ?? [])];
    triggers.forEach(trigger => client.commands.set(trigger, module));
}

function registerAllEvents(client) {
    const eventFiles = fs.readdirSync("./events").filter(file => file.endsWith(".js"));
    eventFiles.forEach(file => {
        const module = require(`./events/${file}`);
        registerSingleEvent(client, module);
    })
}

function registerSingleEvent(client, module) {
    if (module.once) client.once(module.trigger, (...args) => module.execute(client, ...args));
    else client.on(module.trigger, (...args) => module.execute(client, ...args))
}

client.once(Events.ClientReady, (readyClient) => {
    registerAllCommands(readyClient);
    registerAllEvents(readyClient);
    console.log("Ready !")
});

client.login(token);