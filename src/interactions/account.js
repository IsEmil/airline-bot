const {
    ContextMenuCommandBuilder,
    ApplicationCommandType,
    SlashCommandBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    SelectMenuBuilder,
    ModalBuilder,
    Interactions,
    EmbedBuilder,
    GuildMember,
    Client,
} = require('discord.js');

const Clients = require("../models/Client");
const Staff = require("../models/Staff");

const config = require("../config.js");

/**
 * @description The function executed when a command is invoked
 * @param {Interactions} interaction
 * @param {GuildMember} member 
 * @param {Client} client
 */
async function run(interaction, member, client) {
    const user = interaction.options.getMember('user') ? interaction.options.getMember('user') : interaction.member

    try {
        let clientRecord = await Clients.findOne({
            discord: user.id,
        }).populate("staff.role").exec();

        if (!clientRecord) {
            return interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Error")
                        .setDescription(`**${user.username}#${user.discriminator}** is not verified!`)
                        .setColor(config.embeds.colors.danger)
                ]
            });
        }

        const staffs = clientRecord.staff.filter((p) => {
            return p.role;
        });

        const staffString = staffs.map((p) => {
            const { name } = p.role;
            return `${name}`;
        }).join("\n");

        if (staffs.length === 0) {
            return interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(config.embeds.colors.default)
                        .setTitle("Profile")
                        .addFields(
                            { name: "User", value: `<@${user.user.id}>`},
                            { name: "Roles", value: `None` },
                            { name: "Balance", value: `R$${clientRecord.balance}` }
                        )
                        .setThumbnail(`https://www.roblox.com/headshot-thumbnail/image?userId=${clientRecord.roblox}&width=420&height=420&format=png`)
                ]
            });
        }

        return interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setColor(config.embeds.colors.default)
                    .setTitle("Profile")
                    .addFields(
                        { name: "User", value: `<@${user.user.id}>`},
                        { name: "Roles", value: `${staffString}` },
                        { name: "Balance", value: `R$${clientRecord.balance}` }
                    )
                    .setThumbnail(`https://www.roblox.com/headshot-thumbnail/image?userId=${clientRecord.roblox}&width=420&height=420&format=png`)
            ]
        });
    } catch (err) {
        console.log(err)
        interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Error")
                    .setDescription(`An error occurred viewing account!`)
                    .setColor(config.embeds.colors.danger)
            ]
        });
    }
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('account')
        .setDescription('View your account or another user\'s account')
        .addUserOption(option => option.setName('user').setDescription('Which user you wanna view?')),
    execute: run
};