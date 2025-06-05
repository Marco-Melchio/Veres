const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getLoveDropBonus, getRareMultiplier } = require('../../utils/effects');
const { getUser } = require('../../utils/user');
const { checkAchievements } = require('../../utils/achievements');

const heartTypes = [
  { name: 'Common', emoji: '❤️', chance: 60 },
  { name: 'Rare', emoji: '💖', chance: 25 },
  { name: 'Epic', emoji: '💘', chance: 10 },
  { name: 'Legendary', emoji: '💎', chance: 5 }
];

function dropHeart() {
  const roll = Math.random() * 100;
  let sum = 0;
  for (const heart of heartTypes) {
    sum += heart.chance;
    if (roll <= sum) return heart;
  }
  return heartTypes[0];
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('love')
    .setDescription('Finde mehrere Herzen – vielleicht sogar legendäre!'),
  category: 'heart-game',

  async execute(interaction) {
    const { data, save } = await getUser(interaction.user.id);

    const baseCount = Math.floor(Math.random() * 3) + 1;
    const bonus = getLoveDropBonus(data);
    const dropCount = baseCount + bonus;

    const results = {};

    for (let i = 0; i < dropCount; i++) {
      const heart = dropHeart();
      const multiplier = Math.random() < getRareMultiplier(data) ? 2 : 1;

      data.inventory[heart.name] += multiplier;
      results[heart.name] = (results[heart.name] || 0) + multiplier;
    }

    const unlocked = await checkAchievements(interaction.user.id, data, save);
    await save(data);

    const earnedList = Object.entries(results)
      .map(([type, count]) => {
        const emoji = heartTypes.find(h => h.name === type).emoji;
        return `${emoji} **${type}** × ${count}`;
      }).join('\n');

    const totalList = heartTypes.map(h =>
      `${h.emoji} ${h.name}: ${data.inventory[h.name]}`
    ).join('\n');

    const embed = new EmbedBuilder()
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true })
      })
      .setTitle(`❤️ Du hast ${dropCount} Herz${dropCount > 1 ? 'en' : ''} gefunden`)
      .setDescription(earnedList)
      .setColor(0xff0000)
      .setFooter({ text: `${interaction.user.username}` });

    if (unlocked.length > 0) {
      embed.addFields({ name: 'Neue Erfolge', value: unlocked.map(u => `• ${u}`).join('\n') });
    }

    embed.addFields({ name: 'Aktueller Stand', value: totalList });

    await interaction.reply({ embeds: [embed] });
  },
};
