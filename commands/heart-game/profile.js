const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const { getUserFile } = require('../../utils/user');

function autoAssignTitle(data) {
  const total = Object.values(data.inventory).reduce((a, b) => a + b, 0);
  if (total >= 50) return 'Legendärer Liebhaber';
  if (total >= 20) return 'Erfahrener Verführer';
  if (total >= 5) return 'Herzsammler';
  return 'Anfänger der Liebe';
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('profile')
    .setDescription('Zeigt dein Herzjäger-Profil'),
  category: 'heart-game',

  async execute(interaction) {
    const { data, file } = getUserFile(interaction.user.id);
    data.title = autoAssignTitle(data); // auto-update title
    fs.writeFileSync(file, JSON.stringify(data, null, 2));

    const embed = new EmbedBuilder()
      .setTitle(`💘 Profil von ${interaction.user.username}`)
      .setDescription(`🏷️ Titel: **${data.title}**`)
      .addFields(
        { name: '💰 Coins', value: `${data.coins}`, inline: true },
        { name: '🔥 Streak', value: `${data.streak}`, inline: true },
        { name: '❤️ Common', value: `${data.inventory.Common}`, inline: true },
        { name: '💖 Rare', value: `${data.inventory.Rare}`, inline: true },
        { name: '💘 Epic', value: `${data.inventory.Epic}`, inline: true },
        { name: '💎 Legendary', value: `${data.inventory.Legendary}`, inline: true }
      )
      .setColor(0xff66cc)
      .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
      .setFooter({ text: 'Veres' });

    await interaction.reply({ embeds: [embed] });
  }
};