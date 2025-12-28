const { EmbedBuilder } = require("discord.js");
const { prefix } = require("./config.json");

const colorCodes = {
    red: "#F6305B",
    green: "#30F668",
    blue: "#30BEF6"
}

function embedBuilder(options) {
    let embed = new EmbedBuilder().setColor(colorCodes[options.color] ?? colorCodes["blue"]);
    if (options.title) embed.setTitle(options.title);
    if (options.titleURL) embed.setURL(options.titleURL);
    if (options.description) embed.setDescription(options.description);
    let finalAuthor = {};
    if (options.author) finalAuthor.name = options.author;
    if (options.authorImage) finalAuthor.iconURL = options.authorImage;
    if (Object.keys(finalAuthor).length !== 0) embed.setAuthor(finalAuthor);
    if (options.image) embed.setImage(options.image);
    if (options.thumbnail) embed.setThumbnail(options.thumbnail);
    let finalFooter = {};
    if (options.footer) finalFooter.text = options.footer;
    if (options.footerImage) finalFooter.iconURL = options.footerImage;
    if (Object.keys(finalFooter).length !== 0) embed.setFooter(finalFooter);
    let finalFields = [];
    let rawFields = options.fields ?? [];
    rawFields.forEach(field => { // fields look like: [{title: title, description: description, inline: true}, {title: ...}]
        let finalSingleField = {};
        if (field.title) finalSingleField.name = field.title;
        if (field.description) finalSingleField.value = field.description;
        if (field.inline) finalSingleFields.inline = field.inline;
        finalFields.push(finalSingleField);
    });
    if (finalFields.length !== 0) embed.addFields(...finalFields);
    return { embeds: [embed] }
}

function usagePrinter(element) {
    let usage = `${prefix}${element.name}`;
    template = element.template ?? [];
    template.forEach(argument => {
        if (argument.required) usage += ` <${argument.name}>`;
        else usage += ` [${argument.name}]`;
    })
    return usage;
}

module.exports = { embedBuilder, usagePrinter };