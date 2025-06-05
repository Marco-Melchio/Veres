const { SlashCommandBuilder } = require('discord.js');
const { pool, init } = require('../../utils/db');
const { defaultData } = require('../../utils/user');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('reset')
    .setDescription('Setzt deinen Fortschritt zurück (nur Dev)'),
  category: 'dev',

  async execute(interaction) {
    if (interaction.user.id !== '483580738571337728') {
      return interaction.reply({ content: '⛔ Nicht erlaubt.', flags: 1 << 6 });
    }

    await init();
    await pool.query(
      'REPLACE INTO users (id, data) VALUES (?, ?)',
      [interaction.user.id, JSON.stringify(defaultData)]
    );

    await interaction.reply({ content: '🧼 Dein Fortschritt wurde zurückgesetzt.', flags: 1 << 6 });
  },
};
