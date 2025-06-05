const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { pool, init } = require('../../utils/db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('Zeigt die Top 5 Spieler mit den meisten Coins'),
  category: 'heart-game',

  async execute(interaction) {
    await init();
    const [rows] = await pool.query('SELECT id, data FROM users');
    const users = rows.map(r => {
      const d = typeof r.data === 'string' ? JSON.parse(r.data) : r.data;
      return { id: r.id, coins: d.coins || 0 };
    });

    const top = users.sort((a, b) => b.coins - a.coins).slice(0, 5);

    const entries = await Promise.all(top.map(async (u, i) => {
      const user = await interaction.client.users.fetch(u.id).catch(() => null);
      return `${i + 1}. **${user?.username || 'Unbekannt'}** – ${u.coins} 💰`;
    }));

    const embed = new EmbedBuilder()
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true })
      })
      .setTitle('🏆 Top 5 Lover von Veres')
      .setColor(0xff0000)
      .setDescription(entries.join('\n'))
      .setFooter({ text: `${interaction.user.username}` });

    await interaction.reply({ embeds: [embed] });
  },
};