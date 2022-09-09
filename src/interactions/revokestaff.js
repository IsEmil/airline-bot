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
const noblox = require("noblox.js");

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
    const staff_name = interaction.options.getString('name');
    const user = interaction.options.getUser('user');

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

        const match = clientRecord.staff.find((staff) => {
            const staffMatch = staff.role.name.toString();

            return staffMatch === staff_name.toString();
        });

        if (!match) {
            return interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Error")
                        .setDescription(`**${user.username}#${user.discriminator}** is not a staff!`)
                        .setColor(config.embeds.colors.danger)
                ]
            });
        }

        if (config.roblox_ranking) {
            let rblxGroup = await noblox.getRankInGroup(config.group, Number(clientRecord.roblox));

            if (rblxGroup) {
                await noblox.setRank(config.group, Number(clientRecord.roblox), 1).then(() => {
                    console.log(`[Airline Bot]: Successfully set ${clientRecord.discord}'s rank to 1`);
                }).catch(() => {
                    console.log(`[Airline Bot]: An error occurred while setting rank for ${clientRecord.discord}`);
                })
            }
        }

        await Clients.updateOne({
            _id: clientRecord._id,
        }, {
            $pull: {
                staff: { role: staffRecord._id },
            },
        });

        let memberr = await interaction.guild.members.fetch(user.id)
        await memberr.roles.remove(staffRecord.roles.discord).then(() => {}).catch(() => {});

        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Success")
                    .setDescription(`Successfully revoked **${staff_name}** from **${user.username}#${user.discriminator}**!`)
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
                    .setDescription(`An error occurred while revoking **${staff_name}** from **${user.username}#${user.discriminator}**!`)
                    .setColor(config.embeds.colors.danger)
            ]
        });
    }
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('revokestaff')
        .setDescription('Revoke a users staff role')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption(option => option.setName('name').setDescription('What is the staff role name?').setRequired(true))
        .addUserOption(option => option.setName('user').setDescription('Which user will get revoked the role?').setRequired(true)),
    execute: run
};