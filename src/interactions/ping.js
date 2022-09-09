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
  GuildMember,
  Client,
} = require('discord.js');

/**
 * @description The function executed when a command is invoked
 * @param {Interactions} interaction
 * @param {GuildMember} member 
 * @param {Client} client
 */
async function run(interaction, member, client) {
  interaction.editReply({
    content: `${client.ws.ping} ms`
  });
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!'),
  execute: run
};