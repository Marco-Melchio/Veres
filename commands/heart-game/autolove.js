const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getUser } = require('../../utils/user');


module.exports = {
  data: new SlashCommandBuilder()
    .setName('autolove')
    .setDescription('Sammelt automatisch Herzen alle 60 Minuten'),
  category: 'heart-game',

  async execute(interaction) {
    const userId = interaction.user.id;
    const { data, save } = await getUser(userId);

    if (!data.upgrades.includes('AutoLove')) {
      const embed = new EmbedBuilder()
        .setAuthor({
          name: interaction.user.username,
          iconURL: interaction.user.displayAvatarURL({ dynamic: true })
        })
        .setColor(0xff0000)
        .setDescription('❌ Du besitzt das Upgrade **AutoLove** nicht. Kaufe es mit `/buy AutoLove`.')
        .setFooter({ text: `${interaction.user.username}` });
      return interaction.reply({ embeds: [embed] });
    }

    const now = Date.now();
    const last = data.lastClaim ? new Date(data.lastClaim).getTime() : 0;
    const diff = now - last;

    if (diff < 1000 * 60 * 60) {
      const minutes = Math.ceil((60 - diff / 1000 / 60));
      const embed = new EmbedBuilder()
        .setAuthor({
          name: interaction.user.username,
          iconURL: interaction.user.displayAvatarURL({ dynamic: true })
        })
        .setColor(0xff0000)
        .setDescription(`🕒 Du musst noch **${minutes} Minute${minutes !== 1 ? 'n' : ''}** warten, bevor du AutoLove erneut verwenden kannst.`)
        .setFooter({ text: `${interaction.user.username}` });
      return interaction.reply({ embeds: [embed] });
    }

    data.hearts += 1;
    data.lastClaim = new Date().toISOString();
    await save(data);

    const embed = new EmbedBuilder()
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true })
      })
      .setColor(0xff0000)
      .setDescription(`💘 Du hast 1 ❤️ durch Autoliebe erhalten!\nAktueller Stand: **${data.hearts}** ❤️.`)
      .setFooter({ text: `${interaction.user.username}` });

    await interaction.reply({ embeds: [embed] });
  },
};