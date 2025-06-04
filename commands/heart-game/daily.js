const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const { EMOJI_COIN } = require('../../utils/emojis');
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
      const embed = new EmbedBuilder()
        .setAuthor({
          name: interaction.user.username,
          iconURL: interaction.user.displayAvatarURL({ dynamic: true })
        })
        .setColor(0xff0000)
        .setDescription(`🕒 Du hast deine Belohnung heute schon erhalten. Komm in **${hours}h** wieder.`)
        .setFooter({ text: `${interaction.user.username}` });
      return interaction.reply({ embeds: [embed] });
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

    const embed = new EmbedBuilder()
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true })
      })
      .setTitle('🎁 Tägliche Belohnung')
      .setColor(0xff0000)
      .setDescription(`Du erhältst **${reward}** ${EMOJI_COIN}`)
      .addFields(
        { name: '🔥 Streak', value: `${data.streak}`, inline: true },
        { name: 'Coins', value: `${data.coins}`, inline: true }
      )
      .setFooter({ text: `${interaction.user.username}` });

    await interaction.reply({ embeds: [embed] });
  }
};
