const EMPTY = '\u200B'; // unsichtbares Zeichen für Platzhalter

function formatUserHeader(user, coins, title, streak) {
  return [
    { name: '💰 Coins', value: `${coins}`, inline: true },
    { name: '🏷️ Titel', value: `${title}`, inline: true },
    { name: '🔥 Streak', value: `${streak}`, inline: true },
  ];
}

module.exports = { EMPTY, formatUserHeader };
