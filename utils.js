const { EmbedBuilder } = require("discord.js");

const colorCodes = {
    red: "#F6305B",
    green: "#30F668",
    blue: "#30BEF6"
}

function simpleEmbedBuilder(options = {}) {
    const color = colorCodes[options.color] ?? colorCodes["blue"];
    const title = options.title;
    const titleURL = options.titleURL;
    const description = options.description;

    let embed = new EmbedBuilder().setColor(color);
    if (title) embed.setTitle(title);
    if (titleURL) embed.setURL(titleURL);
    if (description) embed.setDescription(description);

    return { embeds: [embed] }
}

function standardEmbedBuilder() {}

function fullEmbedBuilder() {}

module.exports = { simpleEmbedBuilder, standardEmbedBuilder, fullEmbedBuilder };