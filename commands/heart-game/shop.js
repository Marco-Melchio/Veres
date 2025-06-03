const { SlashCommandBuilder } = require('discord.js');
const { getUserFile } = require('../../utils/user');
const {
  buildShopEmbed,
  buildInventoryEmbed,
  buildShopButtons
} = require('../../utils/shopUI');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('shop')
    .setDescription('Zeigt alle kaufbaren Upgrades mit Leveln'),
  category: 'heart-game',

  async execute(interaction) {
    const { data } = getUserFile(interaction.user.id);

    const shopEmbed = buildShopEmbed(data, interaction.user);
    const invEmbed = buildInventoryEmbed(data, interaction.user);
    const buttons = buildShopButtons(data);

    await interaction.reply({
      embeds: [shopEmbed, invEmbed],
      components: buttons,
    });
  }
};