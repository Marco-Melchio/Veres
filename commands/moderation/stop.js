const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stop')
    .setDescription('Stoppt den Bot (nur für Admins)'),
  category: 'moderation',
  
  async execute(interaction) {
    if (interaction.user.id !== '483580738571337728') {
      return interaction.reply({ content: '🚫 Nur der Admin kann den Bot stoppen.', ephemeral: true });
    }

    await interaction.reply('👋 Bot wird gestoppt...');
    process.exit(0); // beendet Node.js
  },
};
