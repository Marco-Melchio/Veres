const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('c')
    .setDescription('Listet alle verfügbaren Commands auf'),
  category: 'general',

  async execute(interaction) {
    const commands = [...interaction.client.commands.values()];
    const list = commands.map(cmd => `• \`/${cmd.data.name}\` – ${cmd.data.description}`).join('\n');
    await interaction.reply({ content: `📜 Alle Befehle:\n${list}`, flags: 1 << 6, });
  },
};
