// commands/buy.js

const { SlashCommandBuilder } = require('discord.js');
const { getUser } = require('../../utils/user');
const upgrades = require('../../utils/shopItems');

// Emojis aus der zentralen Datei importieren:
const { EMOJI_GOOD, EMOJI_BAD } = require('../../utils/emojis');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('buy')
    .setDescription('Kaufe ein Upgrade aus dem Shop')
    .addStringOption(opt =>
      opt
        .setName('item')
        .setDescription('Name des Upgrades')
        .setRequired(true)
        .setAutocomplete(true)
    ),
  category: 'heart-game',

  // Autocomplete-Handler: Zeigt nur verfügbare Upgrades (level < maxLevel).
  async autocomplete(interaction) {
    const focused = interaction.options.getFocused();
    const { data } = await getUser(interaction.user.id);

    // Sicherstellen, dass data.upgradeLevels ein Objekt ist
    data.upgradeLevels = data.upgradeLevels ?? {};
    const alreadyLevels = data.upgradeLevels;

    const options = Object.entries(upgrades)
      .filter(([name, item]) => {
        const lvl = alreadyLevels[name] ?? 0;
        return lvl < item.maxLevel && name.toLowerCase().startsWith(focused.toLowerCase());
      })
      .slice(0, 10)
      .map(([name]) => ({ name, value: name }));

    await interaction.respond(options);
  },

  // Execute-Handler: Führt den Kauf durch (Antworten sind öffentlich sichtbar).
  async execute(interaction) {
    const name = interaction.options.getString('item');
    const { data, save } = await getUser(interaction.user.id);

    // Default-Werte initialisieren
    data.coins = data.coins ?? 0;
    data.upgradeLevels = data.upgradeLevels ?? {};
    const currentLevel = data.upgradeLevels[name] ?? 0;

    // Prüfen, ob Upgrade existiert
    const upgrade = upgrades[name];
    if (!upgrade) {
      return interaction.reply({
        content: `${EMOJI_BAD} Dieses Upgrade existiert nicht.`,
        // keine ephemeral-Eigenschaft = öffentlich
      });
    }

    // Prüfen, ob bereits Max-Level erreicht ist
    if (currentLevel >= upgrade.maxLevel) {
      return interaction.reply({
        content: `**${name}** ist bereits auf Max-Level.`,
      });
    }

    // Preis berechnen
    const price = Math.floor(upgrade.basePrice * Math.pow(upgrade.scaling, currentLevel));

    // Prüfen, ob genug Coins vorhanden sind
    if (data.coins < price) {
      return interaction.reply({
        content: `${EMOJI_BAD} Du hast nicht genug Coins für **${name}**. Benötigt: **${price}**, du hast: **${data.coins}**`,
      });
    }

    // Coins abziehen & Level erhöhen
    data.coins -= price;
    data.upgradeLevels[name] = currentLevel + 1;

    // Optional: Rolle vergeben, falls maxLevel erreicht
    if (upgrade.role && data.upgradeLevels[name] === upgrade.maxLevel) {
      const role = interaction.guild.roles.cache.find(r => r.name === upgrade.role);
      if (role) {
        const member = await interaction.guild.members.fetch(interaction.user.id);
        await member.roles.add(role).catch(() => {});
      }
    }

    // Daten speichern
    await save(data);

    return interaction.reply({
      content: `${EMOJI_GOOD} Du hast **${name}** auf Level ${data.upgradeLevels[name]} gekauft!`,
    });
  },
};
