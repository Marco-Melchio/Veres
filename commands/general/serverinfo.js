const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('serverinfo')
    .setDescription('Zeigt Infos über diesen Server'),
  category: 'general',
  
  async execute(interaction) {
    const guild = interaction.guild;
    await interaction.reply(`📛 Servername: ${guild.name}\n👥 Mitglieder: ${guild.memberCount}\n🆔 ID: ${guild.id}`);
  },
};
