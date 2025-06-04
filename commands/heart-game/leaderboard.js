const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('Zeigt die Top 5 Spieler mit den meisten Coins'),
  category: 'heart-game',

  async execute(interaction) {
    const userPath = path.join(__dirname, '../../data/users');
    const files = fs.readdirSync(userPath).filter(f => f.endsWith('.json'));

    const users = files.map(f => {
      const userId = f.replace('.json', '');
      const data = JSON.parse(fs.readFileSync(path.join(userPath, f)));
      return { id: userId, coins: data.coins || 0 };
    });

    const top = users.sort((a, b) => b.coins - a.coins).slice(0, 5);

    const entries = await Promise.all(top.map(async (u, i) => {
      const user = await interaction.client.users.fetch(u.id).catch(() => null);
      return `${i + 1}. **${user?.username || 'Unbekannt'}** – ${u.coins} 💰`;
    }));

    const embed = new EmbedBuilder()
      .setTitle('🏆 Top 5 Lover von Veres')
      .setColor(0xff66cc)
      .setDescription(entries.join('\n'));

    await interaction.reply({ embeds: [embed] });
  },
};