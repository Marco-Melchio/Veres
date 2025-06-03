const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const { getUserFile } = require('../../utils/user');

function getReward(streak) {
  return 50 + streak * 10; // steigert sich pro Tag
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('daily')
    .setDescription('Erhalte deine tägliche Liebes-Belohnung'),
  category: 'heart-game',

  async execute(interaction) {
    const { data, file } = getUserFile(interaction.user.id);
    const now = Date.now();
    const last = data.lastDaily ? new Date(data.lastDaily).getTime() : 0;

    if (now - last < 1000 * 60 * 60 * 24) {
      const hours = Math.ceil((24 - (now - last) / 1000 / 60 / 60));
      return interaction.reply({
        content: `🕒 Du hast deine Belohnung heute schon erhalten. Komm in **${hours}h** wieder.`
      });
    }

    // Streak prüfen
    const yesterday = now - 1000 * 60 * 60 * 48;
    if (last < yesterday) {
      data.streak = 1;
    } else {
      data.streak++;
    }

    const reward = getReward(data.streak);
    data.coins += reward;
    data.lastDaily = new Date().toISOString();

    fs.writeFileSync(file, JSON.stringify(data, null, 2));

    await interaction.reply({
      content: `🎁 Du hast deine tägliche Belohnung erhalten: **${reward} Coins**!\nLogin-Streak: ${data.streak} 🔥`
    });
  }
};
