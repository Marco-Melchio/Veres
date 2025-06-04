const EMPTY = '\u200B'; // unsichtbares Zeichen für Platzhalter
const { EMOJI_COIN, EMOJI_BOOSTER, EMOJI_TITEL } = require('./emojis');

function formatUserHeader(user, coins, title, streak) {
  return [
    { name: `${EMOJI_COIN} Coins`, value: `${coins}`, inline: true },
    { name: `${EMOJI_TITEL} Titel`, value: `${title}`, inline: true },
    { name: `${EMOJI_BOOSTER} Streak`, value: `${streak}`, inline: true },
  ];
}

module.exports = { EMPTY, formatUserHeader };
