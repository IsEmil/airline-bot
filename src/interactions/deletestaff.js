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

    try {
        let staffRecord = await Staff.findOne({
            name: staff_name,
        }).exec();

        if (!staffRecord) {
            return interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Error")
                        .setDescription(`**${staff_name}** is not a staff role!`)
                        .setColor(config.embeds.colors.danger)
                ]
            });
        }

        await Staff.deleteOne({
            _id: staffRecord._id,
        });

        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Success")
                    .setDescription(`Successfully deleted **${staff_name}** from the staff list!`)
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
                    .setDescription(`An error occurred deleting ${staff_name} from the staff list!`)
                    .setColor(config.embeds.colors.danger)
            ]
        });
    }
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('deletestaff')
        .setDescription('Deletes a staff role')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption(option => option.setName('name').setDescription('What is the staff role name?').setRequired(true)),
    execute: run
};