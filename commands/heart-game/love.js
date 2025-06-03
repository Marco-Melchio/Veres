const { SlashCommandBuilder } = require('discord.js');
const { getLoveDropBonus, getRareMultiplier } = require('../../utils/effects');
const { getUserFile } = require('../../utils/user');
const { checkAchievements } = require('../../utils/achievements');
const fs = require('fs');

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
    const { data, file } = getUserFile(interaction.user.id);

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

    const unlocked = checkAchievements(interaction.user.id, data, file);
    fs.writeFileSync(file, JSON.stringify(data, null, 2));

    const earnedList = Object.entries(results)
      .map(([type, count]) => {
        const emoji = heartTypes.find(h => h.name === type).emoji;
        return `${emoji} **${type}** × ${count}`;
      }).join('\n');

    const totalList = heartTypes.map(h =>
      `${h.emoji} ${h.name}: ${data.inventory[h.name]}`
    ).join('\n');

    let reply = `Du hast **${dropCount} Herz${dropCount > 1 ? 'en' : ''}** gefunden:\n${earnedList}`;

    if (unlocked.length > 0) {
      reply += `\n\n🏆 **Neue Erfolge freigeschaltet!**\n• ${unlocked.join('\n• ')}`;
    }

    reply += `\n\n📦 **Aktueller Stand:**\n${totalList}`;

    await interaction.reply({
      content: reply,
    });
  },
};
