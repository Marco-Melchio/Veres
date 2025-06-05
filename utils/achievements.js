
const allAchievements = {
  'Herzenssammler ': user => totalHearts(user) >= 10,
  'Goldgräber ': user => user.coins >= 100,
  'Liebeslegende ': user => (user.inventory?.Legendary ?? 0) >= 1,
  'Loyal Lover ': user => user.streak >= 3,
};

function totalHearts(user) {
  return Object.values(user.inventory || {}).reduce((a, b) => a + b, 0);
}

async function checkAchievements(userId, data, save) {
  if (!data.achievements) data.achievements = {};

  let unlocked = [];

  for (const [name, condition] of Object.entries(allAchievements)) {
    if (!data.achievements[name] && condition(data)) {
      data.achievements[name] = true;
      unlocked.push(name);
    }
  }

  if (unlocked.length > 0) {
    await save(data);
  }

  return unlocked; // für Feedback
}

function getAllAchievements() {
  return Object.keys(allAchievements);
}

module.exports = { checkAchievements, getAllAchievements };
