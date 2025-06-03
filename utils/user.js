const fs = require('fs');
const path = require('path');

const defaultData = {
  inventory: { Common: 0, Rare: 0, Epic: 0, Legendary: 0 },
  coins: 0,
  upgrades: [],
  lastClaim: null,
  lastDaily: null,
  streak: 0,
  title: 'Anfänger der Liebe'
};

function getUserFile(userId) {
  const file = path.join(__dirname, '../data/users', `${userId}.json`);

  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, JSON.stringify(defaultData, null, 2));
  }

  const data = JSON.parse(fs.readFileSync(file));

  // Ergänze fehlende Felder
  for (const key in defaultData) {
    if (data[key] === undefined) data[key] = defaultData[key];
  }

  for (const heart in defaultData.inventory) {
    if (!data.inventory) data.inventory = {};
    if (data.inventory[heart] === undefined) data.inventory[heart] = 0;
  }

  fs.writeFileSync(file, JSON.stringify(data, null, 2));
  return { data, file };
}

module.exports = { getUserFile };
