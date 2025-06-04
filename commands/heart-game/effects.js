const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getUserFile } = require('../../utils/user');
const { getLoveDropBonus, getRareMultiplier } = require('../../utils/effects');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('effects')
    .setDescription('Zeigt deine aktiven Spiel-Boni'),
  category: 'heart-game',

  async execute(interaction) {
    const { data } = getUserFile(interaction.user.id);
    const drops = getLoveDropBonus(data);
    const mult = (getRareMultiplier(data) * 100).toFixed(1);

    const embed = new EmbedBuilder()
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true })
      })
      .setTitle('🎯 Aktive Effekte')
      .setColor(0xff0000)
      .setDescription(`➕ Extra-Herzen: **+${drops}** pro /love\n🎲 Chance auf doppelte Herzen: **${mult}%**`)
      .setFooter({ text: `${interaction.user.username}` });

    await interaction.reply({ embeds: [embed] });
  }
};
