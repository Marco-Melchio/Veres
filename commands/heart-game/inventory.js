const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getUserFile } = require('../../utils/user');
const shopItems = require('../../utils/shopItems');
const { EMOJI_COIN } = require('../../utils/emojis');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('inventory')
    .setDescription('Zeigt dein cooles Inventar im Profilstil'),
  category: 'heart-game',

  async execute(interaction) {
    const { data } = getUserFile(interaction.user.id);
    const upgrades = data.upgradeLevels ?? {};

    const coins = data.coins ?? 0;
    const streak = data.streak ?? 0;
    const title = data.title || '–';
    const hearts = Object.values(data.inventory ?? {}).reduce((a, b) => a + b, 0);
    const rares = (data.inventory?.Rare ?? 0) + (data.inventory?.Epic ?? 0) + (data.inventory?.Legendary ?? 0);

    // 📋 Ausrüstung
    const equipped = Object.keys(shopItems).map(name => {
      const lvl = upgrades[name] ?? 0;
      return `• **${name}**: Lv.${lvl}/${shopItems[name].maxLevel}`;
    }).join('\n') || '–';

    // 📊 Stats
    const stats = [
      `• ❤️ Herzen gesamt: ${hearts}`,
      `• 💎 Seltene Herzen: ${rares}`,
      `• 🔥 Streak: ${streak}`,
      `• 🏷️ Titel: ${title}`
    ].join('\n');

    const embed = new EmbedBuilder()
      .setAuthor({
        name: `${interaction.user.username}`,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true })
      })
      .setTitle('__Dein Inventar__')
      .setColor(0xff0000)
      .setThumbnail(interaction.user.displayAvatarURL({ size: 256, dynamic: true }))
      .setDescription(
        `**${EMOJI_COIN} Coins:** ${coins}\n\n` +
        `🧰 Ausrüstung\n${equipped}\n\n📊 Stats\n${stats}`
      )
      .setFooter({ text: `${interaction.user.username}` });

    await interaction.reply({ embeds: [embed], flags: 1 << 6 });
  }
};
