const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('userinfo')
    .setDescription('Zeigt Infos über dich selbst'),
  category: 'moderation',
  
  async execute(interaction) {
    const user = interaction.user;
    await interaction.reply(`👤 Nutzer: ${user.tag}\n🆔 ID: ${user.id}\n⏰ Account erstellt: ${user.createdAt}`);
  },
};
