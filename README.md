# 💘 Veres – Discord-Bot

**Veres** ist ein interaktiver Discord-Bot mit einem liebevoll gestalteten Herzspiel. Benutzer können Herzen sammeln, Erfolge freischalten, tägliche Belohnungen erhalten, Items kaufen, Upgrades durchführen, und sich mit anderen Spielern im Leaderboard messen. Mit hübsch gestalteten Embeds und einer durchdachten Benutzererfahrung macht Veres den Server-Alltag bunter.

---

## ⚙️ Features

- `/love` – Finde zufällige Herzen (Common bis Legendary)
- `/daily` – Erhalte tägliche Coins mit Streak-Bonus
- `/shop` – Kaufe Upgrades und schalte neue Fähigkeiten frei
- `/buy <item>` – Kaufe ein spezifisches Upgrade
- `/autolove` – Automatisches Herzsammeln mit Cooldown
- `/inventory` – Zeigt Coins, Herzen, Upgrades und Titel
- `/sell` – Verkaufe gesammelte Herzen für Coins
- `/profile` – Dein öffentliches Herzjäger-Profil
- `/achievements` – Übersicht über freigeschaltete Erfolge
- `/effects` – Zeigt aktive Boni (Drop-Bonus, Multiplikator)
- `/leaderboard` – Die Top 5 reichsten Spieler

---

## 🧠 Architektur

- **Command Loader**: Lädt alle Slash-Commands rekursiv aus dem `commands/`-Verzeichnis
- **Benutzerdaten**: Als JSON-Dateien unter `data/users/` gespeichert
- **Shop & Upgrades**: Zentrale Definitionen in `utils/shopItems.js`
- **Hilfesystem**: Dynamisch generierte Kategorieliste mit Buttons und Dropdown-Menü
- **Effekte & Achievements**: Modular erweiterbar

---

## 🧪 Beispiel: Eigene Commands hinzufügen

```js
// commands/heart-game/hug.js
module.exports = {
  data: new SlashCommandBuilder()
    .setName('hug')
    .setDescription('Umarme jemanden auf dem Server')
    .addUserOption(opt => opt.setName('user').setDescription('Wer bekommt die Umarmung?').setRequired(true)),
  category: 'general',

  async execute(interaction) {
    const user = interaction.options.getUser('user');
    await interaction.reply(`${interaction.user.username} umarmt ${user.username} 🤗`);
  }
};
```

## ❤️ Mitwirken

Pull Requests, Vorschläge und Ideen sind herzlich willkommen. Für grössere Änderungen bitte zuerst ein Issue eröffnen.

