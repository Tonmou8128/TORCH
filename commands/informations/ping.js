module.exports = {
    name: "ping",
    description: 'Réponds par "Pong !"',
    category: "Informations",
    execute(client, message) {
        message.channel.send("Pong !");
    }
}