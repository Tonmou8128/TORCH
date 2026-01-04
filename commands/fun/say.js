module.exports = {
    name: "say",
    description: "Fait parler le bot",
    category: "Fun",
    permission: "helper",
    delete: true,
    template: [
        {type: "string", required: true, name: "message"}
    ],
    execute(client, message, args) {
        message.channel.send(...args);
    }
}