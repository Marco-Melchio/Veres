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
      'https://cdn.discordapp.com/attachments/1378314925499482163/1378315047066931231/veres_bright.png?ex=683c276b&is=683ad5eb&hm=a8b791fbd3ed920d23868790adfdd1e8e20ed80a492726a066ce3249d4621a7f&';
    
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