require("dotenv").config();

module.exports = exports = {
    token: process.env.TOKEN, // These you don't touch.
    mongo: process.env.MONGO_URI, // These you don't touch.
    guild: "", // Your discord guild id here so slash commands can be created.
    roblox: "", // Your roblox bot account cookie (how to get roblox cookie: https://noblox.js.org/tutorial-Authentication.html)
    roblox_ranking: false, // If you wish the bot to autorank the user in roblox group.
    group: 0, // Your roblox group id

    embeds: {
        colors: {
            default: "#2f3136",
            primary: "#4752c4",
            success: "#359553",
            danger: "#d53b3e"
        }
    }
}