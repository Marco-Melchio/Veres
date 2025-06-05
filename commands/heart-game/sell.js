const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getUser } = require('../../utils/user');
const {
  EMOJI_OK,
  EMOJI_WARN,
  EMOJI_ERROR,
  EMOJI_INFO,
  EMOJI_COIN,
  EMOJI_BLACK_HEART,
  EMOJI_SILVER_HEART,
  EMOJI_GOLD_HEART,
  EMOJI_SKY_HEART,
  EMOJI_VERES_HEART,
  EMOJI_GALAXY_HEART,
  EMOJI_LOLI_HEART,
  EMOJI_BRONZE_HEART,
  EMOJI_TOXIC_HEART,
  EMOJI_HEALTH_HEART,
  EMOJI_BROWN_HEART
} = require('../../utils/emojis');

const values = {
  Common: 5,
  Rare: 15,
  Epic: 50,
  Legendary: 250
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('sell')
    .setDescription('Verkaufe alle Herzen für Coins'),
  category: 'heart-game',

  async execute(interaction) {
    const { data, save } = await getUser(interaction.user.id);

    let totalCoins = 0;
    let sold = [];

    for (const type in data.inventory) {
      const count = data.inventory[type];
      const value = values[type] ?? 0;
      if (count > 0) {
        totalCoins += count * value;
        sold.push(`${count} × ${type} (${value}💰)`);
        data.inventory[type] = 0;
      }
    }

    if (totalCoins === 0) {
      return interaction.reply({ content: `${EMOJI_INFO} Du hast keine Herzen zu verkaufen.` });
    }

    data.coins += totalCoins;
    await save(data);

    const embed = new EmbedBuilder()
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true })
      })
      .setTitle('💸 Verkauf')
      .setDescription(sold.map(s => `• ${s}`).join('\n'))
      .addFields({ name: 'Erhalten', value: `${totalCoins} ${EMOJI_COIN}` })
      .setColor(0xff0000)
      .setFooter({ text: `${interaction.user.username}` });

    await interaction.reply({ embeds: [embed] });
  }
};
