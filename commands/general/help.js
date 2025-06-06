// help.js

const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Zeigt eine Übersicht aller Kategorien'),
  category: 'general',

  async execute(interaction) {
    const client = interaction.client;
    const allCommands = [...client.commands.values()];
    const categories = [...new Set(allCommands.map(cmd => cmd.category))];

    // Hier setzt du die CDN-URL deines in Discord hochgeladenen Bildes ein:
    const discordImageUrl =
      'https://cdn.discordapp.com/attachments/1378314925499482163/1378315047066931231/veres_bright.png?ex=68401beb&is=683eca6b&hm=5a153bbe938c85fb37aabf40a2ebec17f9aa03b4f39a75419caa4333bdf3720b&';
    
    const embed = new EmbedBuilder()
      .setTitle('📚 Hilfe-Menü')
      .setDescription(
        'Wähle eine Kategorie im Dropdown-Menü aus.'
      )
      .setThumbnail(discordImageUrl) // Thumbnail per Discord-CDN
      .setColor(0xff0000)
      .setFooter({ text: 'Slash Commands Übersicht' });

    const menu = new StringSelectMenuBuilder()
      .setCustomId('help-category')
      .setPlaceholder('Kategorie auswählen...')
      .addOptions(
        categories.map((cat) => ({
          label: cat,
          value: cat,
          description: `Befehle der Kategorie: ${cat}`,
        }))
      );

    const closeButton = new ButtonBuilder()
      .setCustomId('close-help')
      .setLabel('❌ Schließen')
      .setStyle(ButtonStyle.Secondary);

    const row = new ActionRowBuilder().addComponents(menu);
    const buttonRow = new ActionRowBuilder().addComponents(closeButton);

    // Kein files:[], weil wir die URL nutzen
    await interaction.reply({
      embeds: [embed],
      components: [row, buttonRow],
    });
  },
};