function getLoveDropBonus(userData) {
  const level = userData.upgradeLevels?.['LoveMagnet'] ?? 0;
  return Math.floor(level / 2); // +1 Drop pro 2 Level
}

function getRareMultiplier(userData) {
  const level = userData.upgradeLevels?.['Streak-Booster'] ?? 0;
  return level * 0.05; // 5% mehr Chance auf doppelten Drop
}

module.exports = {
  getLoveDropBonus,
  getRareMultiplier
};
