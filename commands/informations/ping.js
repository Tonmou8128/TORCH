module.exports = {
    name: "ping",
    description: 'Réponds par "Pong !"',
    category: "informations",
    template: [],
    execute(client, message) {
        message.channel.send("Pong !");
    }
}