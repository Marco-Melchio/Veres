const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getUserFile } = require('../../utils/user');
const { getAllAchievements } = require('../../utils/achievements');
const { EMOJI_OK, EMOJI_ERROR } = require('../../utils/emojis');

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
      const symbol = unlocked[name] ? `${EMOJI_OK}` : `${EMOJI_ERROR}`;
      return `${symbol} ${name}`;
    });

    const embed = new EmbedBuilder()
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true })
      })
      .setTitle('🏆 Deine Erfolge')
      .setDescription(shown.map(s => `${s}`).join('\n'))
      .setColor(0xff66cc)
      .setFooter({ text: `${interaction.user.username}` });

    await interaction.reply({ embeds: [embed] });
  }
};