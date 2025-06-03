const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const { getUserFile } = require('../../utils/user');


module.exports = {
  data: new SlashCommandBuilder()
    .setName('autolove')
    .setDescription('Sammelt automatisch Herzen alle 60 Minuten'),
  category: 'heart-game',

  async execute(interaction) {
    const userId = interaction.user.id;
    const { data, file } = getUserFile(userId);

    if (!data.upgrades.includes('Autoliebe')) {
      return interaction.reply({
        content: '❌ Du besitzt das Upgrade **Autoliebe** nicht. Kaufe es mit `/buy Autoliebe`.'
      });
    }

    const now = Date.now();
    const last = data.lastClaim ? new Date(data.lastClaim).getTime() : 0;
    const diff = now - last;

    if (diff < 1000 * 60 * 60) {
      const minutes = Math.ceil((60 - diff / 1000 / 60));
      return interaction.reply({
        content: `🕒 Du musst noch **${minutes} Minute${minutes !== 1 ? 'n' : ''}** warten, bevor du Autoliebe erneut verwenden kannst.`
      });
    }

    data.hearts += 1;
    data.lastClaim = new Date().toISOString();
    fs.writeFileSync(file, JSON.stringify(data, null, 2));

    await interaction.reply({
      content: `💘 Du hast 1 ❤️ durch Autoliebe erhalten!\nAktueller Stand: **${data.hearts}** ❤️.`
    });
  },
};
