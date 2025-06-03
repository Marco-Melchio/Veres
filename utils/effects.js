function getLoveDropBonus(userData) {
  const level = userData.upgradeLevels?.['Liebesmagnet'] ?? 0;
  return Math.floor(level / 2); // +1 Drop pro 2 Level
}

function getRareMultiplier(userData) {
  const level = userData.upgradeLevels?.['Herzregen'] ?? 0;
  return level * 0.05; // 5% mehr Chance auf doppelten Drop
}

module.exports = {
  getLoveDropBonus,
  getRareMultiplier
};
