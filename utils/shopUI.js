// shop.js

const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const shopItems = require('./shopItems');
const { formatUserHeader } = require('./embedParts');
const { EMOJI_COIN } = require('./emojis'); // <– Hier importieren wir das Coin-Emoji

function buildShopEmbed(data, user) {
  const embed = new EmbedBuilder()
    .setTitle('🛍️ Veres-Shop')
    // setThumbnail() kannst du hier leer lassen oder mit einer URL füllen, wenn gewünscht
    .setDescription('Willkommen im Veres-Shop! Entdecke mächtige Upgrades, stärke deine Fähigkeiten und hebe dich von den anderen Spielern ab.')
    .addFields({ name: '\u200B', value: '' }) // halbhoher Abstand
    .setColor(0xff0000)
    .setAuthor({
      name: user.username,
      iconURL: user.displayAvatarURL({ dynamic: true })
    });

  // Für jedes Item aus shopItems ein Feld bauen
  for (const [name, item] of Object.entries(shopItems)) {
    const level = data.upgradeLevels?.[name] ?? 0;
    const max = item.maxLevel;
    const price = level < max
      ? Math.floor(item.basePrice * Math.pow(item.scaling, level))
      : '🔒 MAX';

    // Das Item-spezifische Emoji (z.B. item.emoji) oder Standard‐Icon
    const emoji = item.emoji || '🛠️';

    // Wenn price eine Zahl ist, packe nur die Zahl in Backticks, 
    // das Coin-Emoji steht außen:
    const priceText = typeof price === 'number'
      ? `${EMOJI_COIN} \`${price}\``
      : price; // z.B. "🔒 MAX"

    // Der Rest bleibt gleich:
    const title = `${emoji} ${name} Lv. ${level}/${max}  ${priceText}`;

    // Beschreibung: Effekt oder Beschreibung + ggf. Rollenanzeige
    const description = `> ${item.effect || item.description}`;
    const roleLine = item.role ? `> **Rolle bei Max:** ${item.role}` : '';
    const block = [description, roleLine].filter(Boolean).join('\n');

    embed.addFields({
      name:  title,
      value: `${block}\n\u200B`,
      inline: false
    });
  }

  embed.setFooter({ text: `${user.username}` });
  return embed;
}

function buildInventoryEmbed(data, user) {
  const upgrades = data.upgradeLevels ?? {};
  const coins = data.coins ?? 0;
  const streak = data.streak ?? 0;
  const title = data.title || '–';

  const hearts = Object.values(data.inventory ?? {}).reduce((a, b) => a + b, 0);
  const rares = (data.inventory?.Rare ?? 0) + (data.inventory?.Epic ?? 0) + (data.inventory?.Legendary ?? 0);

  const equipped = Object.entries(shopItems).map(([name, item]) => {
    const lvl = upgrades[name] ?? 0;
    return `• **${name}**: Lv.${lvl}/${item.maxLevel}`;
  }).join('\n');

  const stats = [
    `• ❤️ Herzen gesamt: ${hearts}`,
    `• 💎 Seltene Herzen: ${rares}`,
    `• 🔥 Streak: ${streak}`,
    `• 🏷️ Titel: ${title}`
  ].join('\n');

  return new EmbedBuilder()
    .setTitle('__Dein Inventar__')
    .setColor(0xff0000)
    .setAuthor({
      name: user.username,
      iconURL: user.displayAvatarURL({ dynamic: true })
    })
    .setThumbnail(user.displayAvatarURL({ size: 256, dynamic: true }))
    .setDescription(
      `**${EMOJI_COIN} Coins:** ${coins}\n\n` +
      `🧰 Ausrüstung\n${equipped}\n\n📊 Stats\n${stats}`
    )
    .setFooter({ text: `${user.username}` });
}

function buildShopButtons(data) {
  const rows = [];
  let row = new ActionRowBuilder();

  for (const [name, item] of Object.entries(shopItems)) {
    const level = data.upgradeLevels?.[name] ?? 0;
    if (level >= item.maxLevel) continue;

    const button = new ButtonBuilder()
      .setCustomId(`buy_${name}`)
      .setLabel(`${name}`)
      .setStyle(ButtonStyle.Primary);

    row.addComponents(button);
    if (row.components.length === 5) {
      rows.push(row);
      row = new ActionRowBuilder();
    }
  }

  if (row.components.length > 0) rows.push(row);
  return rows;
}

module.exports = {
  buildShopEmbed,
  buildInventoryEmbed,
  buildShopButtons
};
