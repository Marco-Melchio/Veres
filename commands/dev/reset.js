const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('reset')
    .setDescription('Setzt deinen Fortschritt zurück (nur Dev)'),
  category: 'dev',

  async execute(interaction) {
    if (interaction.user.id !== '483580738571337728') {
      return interaction.reply({ content: '⛔ Nicht erlaubt.', flags: 1 << 6 });
    }

    const file = path.join(__dirname, '../../data/users', `${interaction.user.id}.json`);
    fs.writeFileSync(file, JSON.stringify({ hearts: 0, coins: 0, upgrades: [], lastClaim: null }, null, 2));

    await interaction.reply({ content: '🧼 Dein Fortschritt wurde zurückgesetzt.', flags: 1 << 6 });
  },
};
