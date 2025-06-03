const { SlashCommandBuilder } = require('discord.js');
const { getUserFile } = require('../../utils/user');
const { getAllAchievements } = require('../../utils/achievements');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('achievements')
    .setDescription('Zeigt deine freigeschalteten Erfolge'),
  category: 'heart-game',

  async execute(interaction) {
    const { data } = getUserFile(interaction.user.id);
    const unlocked = data.achievements || {};
    const all = getAllAchievements();

    const shown = all.map(name => {
      const symbol = unlocked[name] ? `:vOk` : `:vError:`;
      return `${symbol} ${name}`;
    });

    await interaction.reply({
      content: `**Deine Erfolge:**\n\n${shown.join('\n')}`,
    });
  }
};
