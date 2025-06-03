const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('reload')
    .setDescription('Lädt alle Commands neu (nur für Admins)'),
  category: 'dev',

  async execute(interaction) {
    if (interaction.user.id !== '483580738571337728') {
      return interaction.reply({
        content: '🚫 Nur der Bot-Entwickler darf diesen Befehl nutzen.',
      });
    }

    await interaction.deferReply({ flags: 1 << 6 }); // ⏳ Zeit gewinnen

    const client = interaction.client;
    const commandDir = path.join(__dirname, '..', '..', 'commands');
    let count = 0;

    client.commands.clear();

    function reload(dir) {
      const files = fs.readdirSync(dir);
      for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
          reload(fullPath);
        } else if (file.endsWith('.js')) {
          try {
            delete require.cache[require.resolve(fullPath)];
            const command = require(fullPath);
            if (!command.data || !command.execute) continue;
            client.commands.set(command.data.name, command);
            count++;
          } catch (err) {
            console.warn(`❌ Fehler beim Neuladen von ${file}: ${err.message}`);
          }
        }
      }
    }

    try {
      reload(commandDir);
      await interaction.editReply({
        content: `✅ **${count}** Commands erfolgreich neu geladen.`
      });
    } catch (error) {
      console.error('Fehler beim Neuladen:', error);
      await interaction.editReply({
        content: '❌ Fehler beim Neuladen.',
      });
    }
  },
};
