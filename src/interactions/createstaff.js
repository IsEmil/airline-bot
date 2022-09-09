const {
    ContextMenuCommandBuilder,
    ApplicationCommandType,
    SlashCommandBuilder,
    PermissionFlagsBits,
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

const Staff = require("../models/Staff");
const config = require("../config.js");

/**
 * @description The function executed when a command is invoked
 * @param {Interactions} interaction
 * @param {GuildMember} member 
 * @param {Client} client
 */
async function run(interaction, member, client) {
    const staff_name = interaction.options.getString('name');
    const staff_roblox = interaction.options.getString('roblox');
    const staff_role = interaction.options.getRole('role');

    try {
        let newStaff = new Staff({
            name: staff_name,
            "roles.roblox": staff_roblox,
            "roles.discord": staff_role.id,
        });

        await newStaff.save();

        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Success")
                    .setDescription(`Successfully added **${staff_name}** to the staff list!`)
                    .setColor(config.embeds.colors.success)
            ],
            ephemeral: true
        });
    } catch (err) {
        console.log(err)
        interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Error")
                    .setDescription(`An error occurred adding **${staff_name}** to a user!`)
                    .setColor(config.embeds.colors.danger)
            ]
        });
    }
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('createstaff')
        .setDescription('Creates a new staff role')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption(option => option.setName('name').setDescription('What will the staff role name be?').setRequired(true))
        .addStringOption(option => option.setName('roblox').setDescription('Please provide roblox role id.').setRequired(true))
        .addRoleOption(option => option.setName('role').setDescription('Please provide the role they will get.').setRequired(true)),
    execute: run
};