const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const { getUserFile } = require('../../utils/user');

const titleRoles = {
  'Anfänger der Liebe': 'Anfänger der Liebe',
  'Herzsammler': 'Herzsammler',
  'Erfahrener Verführer': 'Erfahrener Verführer',
  'Legendärer Liebhaber': 'Legendärer Liebhaber'
};

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
    const oldTitle = data.title;
    const newTitle = autoAssignTitle(data);
    data.title = newTitle; // auto-update title
    fs.writeFileSync(file, JSON.stringify(data, null, 2));

    if (interaction.guild) {
      try {
        const member = await interaction.guild.members.fetch(interaction.user.id);
        const oldRoleName = titleRoles[oldTitle];
        const newRoleName = titleRoles[newTitle];
        if (oldRoleName && oldRoleName !== newRoleName) {
          const oldRole = interaction.guild.roles.cache.find(r => r.name === oldRoleName);
          if (oldRole) await member.roles.remove(oldRole).catch(() => {});
        }
        if (newRoleName) {
          const role = interaction.guild.roles.cache.find(r => r.name === newRoleName);
          if (role) await member.roles.add(role).catch(() => {});
        }
      } catch {
        // ignore role errors
      }
    }

    const embed = new EmbedBuilder()
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true })
      })
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
      .setColor(0xff0000)
      .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
      .setFooter({ text: `${interaction.user.username}` });

    await interaction.reply({ embeds: [embed] });
  }
};