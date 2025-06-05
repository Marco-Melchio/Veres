const { pool, init } = require('./db');

const defaultData = {
  inventory: { Common: 0, Rare: 0, Epic: 0, Legendary: 0 },
  coins: 0,
  upgrades: [],
  lastClaim: null,
  lastDaily: null,
  streak: 0,
  title: 'Anfänger der Liebe',
};

let initialized = false;

async function getUser(userId) {
  if (!initialized) {
    await init();
    initialized = true;
  }
  const [rows] = await pool.query('SELECT data FROM users WHERE id=?', [userId]);
  let data;
  if (rows.length === 0) {
    data = { ...defaultData };
    await pool.query('INSERT INTO users (id, data) VALUES (?, ?)', [userId, JSON.stringify(data)]);
  } else {
    if (typeof rows[0].data === 'string') {
      data = JSON.parse(rows[0].data);
    } else {
      data = rows[0].data;
    }
  }

  for (const key in defaultData) {
    if (data[key] === undefined) data[key] = defaultData[key];
  }
  for (const heart in defaultData.inventory) {
    if (!data.inventory) data.inventory = {};
    if (data.inventory[heart] === undefined) data.inventory[heart] = 0;
  }
  await pool.query('UPDATE users SET data=? WHERE id=?', [JSON.stringify(data), userId]);

  async function save(updated) {
    await pool.query('UPDATE users SET data=? WHERE id=?', [JSON.stringify(updated), userId]);
  }

  return { data, save };
}

module.exports = { getUser, defaultData };
