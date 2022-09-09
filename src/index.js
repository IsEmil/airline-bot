const {
    Client,
    Routes,
    GatewayIntentBits,
    EmbedBuilder,
} = require("discord.js");
const { REST } = require('@discordjs/rest');
const mongoose = require("mongoose");
const noblox = require("noblox.js");
const path = require("path");
const fs = require("fs");

const config = require("./config.js");
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.DirectMessages
    ]
});

let commandMap = new Map();

/**
 * @description Loads all available commands
 */
 function loadCommands() {
    const commandsPath = path.join(__dirname, 'interactions');
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        try {
            const filePath = path.join(commandsPath, file);
            const command = require(filePath);
            commandMap.set(command.data.name, command);
            console.log(`[Airline Bot]: Loaded command '${command.data.name}.js'`);
        } catch (err) {
            console.log(err);
        }
    }
}

/**
 * @description Loads all slash commands
 */
 function deployCommands() {
    const commands = [];
    const commandsPath = path.join(__dirname, 'interactions');
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        commands.push(command.data.toJSON());
    }

    const rest = new REST({ version: '9' }).setToken(config.token);

    rest.put(Routes.applicationGuildCommands(client.user.id, config.guild), { body: commands }).then(() => {
        console.log('[Airline Bot]: Successfully registered application commands.')
    }).catch((err) => {
        console.log(err)
    });
}

client.on("ready", () => {
    console.log("[Airline Bot]: Client Ready");
});

client.on("interactionCreate", (interaction) => {
    if (interaction.isCommand()) {
        if (commandMap.has(interaction.commandName)) {
            interaction.deferReply().then(async () => {
                try {
                    const command = commandMap.get(interaction.commandName);

                    // execute
                    command.execute(interaction, interaction.member, client);
                } catch (e) {
                    console.log(`Error in command ${interaction.commandName}: ${e}`);
                    interaction.editReply({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle("Error")
                                .setDescription(`An error occurred executing the \`${interaction.commandName}\` command Please try again later.`)
                                .setColor(config.embeds.colors.danger)
                        ]
                    });
                }
            });
        } else {
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Error")
                        .setDescription(`Unknown Command - ID: \`${interaction.commandId}\``)
                        .setColor(config.embeds.colors.danger)
                ], ephemeral: true
            });
        }
    }
});

mongoose.connect(config.mongo, {
    useNewUrlParser: true,
}).then(() => {
    console.log("[Airline Bot]: Connected to MongoDB");
    client.login(config.token).then(async () => {
        console.log("[Airline Bot]: Logged In");
        deployCommands();
        loadCommands();
        if (config.roblox_ranking) {
            await noblox.setCookie(config.roblox).then((rblx) => {
                console.log(`[Airline Bot]: Logged in as ${rblx.UserName} [${rblx.UserID}]`)
            }).catch(() => {
                console.log(`[Airline Bot]: Failed to login to roblox`)
            });
        }
    }).catch((err) => {
        console.log("[Airline Bot]: Error Logging In");
        console.log(err)
    });
}).catch((err) => {
    console.log("[Airline Bot]: Error Connecting To Database");
    console.log(err)
});