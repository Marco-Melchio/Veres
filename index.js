require('dotenv').config();
const {
  Client,
  Collection,
  GatewayIntentBits,
  REST,
  Routes,
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require('discord.js');
const fs = require('fs');
const path = require('path');
const PREFIX = 'v.';

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

const commands = [];

function loadCommands(dir = path.join(__dirname, 'commands')) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      loadCommands(fullPath);
    } else if (file.endsWith('.js')) {
      try {
        const command = require(fullPath);
        if (!command.data || !command.execute) {
          console.log(' ');
          console.warn(`ERROR     | Ungültiger Command (fehlende Struktur): ${fullPath}`);
          continue;
        }

        // Validierung
        const json = command.data.toJSON?.();
        if (!json) {
          console.warn(`ERROR     | .toJSON() fehlt bei: ${fullPath}`);
          continue;
        }

        if (!json.name || typeof json.name !== 'string') {
          console.warn(`ERROR     | Name fehlt oder ungültig bei: ${fullPath}`);
          continue;
        }

        if (!json.description || typeof json.description !== 'string') {
          console.warn(`ERROR     | Beschreibung fehlt bei: ${fullPath}`);
          continue;
        }

        // OK
        client.commands.set(command.data.name, command);
        commands.push(json);
        console.log(`SUCCESFULLY | ${json.name}`);
      } catch (error) {
        console.error(`ERROR     | Fehler beim Laden von ${fullPath}:`, error.message);
      }
    }
  }
}

loadCommands();

client.once('ready', async () => {
  console.log(`\nLOGIN       | Eingeloggt als ${client.user.tag}`);

  const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
  const guildId = '822450632598355999';

  console.log('DEBUG       | Bot-ID:', client.user.id);
  console.log('DEBUG       | Guild-ID:', guildId);
  console.log('DEBUG       | Commands:', commands.length);

  try {
    console.log('\nDELETE      | Lösche alte Commands...');
    await rest.put(Routes.applicationGuildCommands(client.user.id, guildId), { body: [] });
    console.log('DELETE      | Alte Commands gelöscht.');

    console.log('\nREGIST      | Registriere neue Slash-Commands...');
    await rest.put(
      Routes.applicationGuildCommands(client.user.id, guildId),
      //Routes.applicationCommands(client.user.id),
      { body: commands }
    );
    console.log('SUCCESFULLY | Registrierung abgeschlossen!');
  } catch (error) {
    console.error('\nERROR     | Fehler beim Registrieren:\n', error);
  }
});

client.on('interactionCreate', async (interaction) => {
  // --- 1) Autocomplete-Interaction abfangen ---
  if (interaction.isAutocomplete()) {
    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
      if (command.autocomplete) {
        await command.autocomplete(interaction);
      }
    } catch (err) {
      console.error(`ERROR     | Fehler im Autocomplete-Handler von /${interaction.commandName}:`, err);
    }
    return;
  }

  // --- 2) Slash-Command (Execute) abfangen ---
  if (interaction.isChatInputCommand()) {
    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
      await command.execute(interaction);
    } catch (err) {
      console.error(`ERROR     | Fehler bei /${interaction.commandName}:`, err);
      if (!interaction.replied) {
        await interaction.reply({ content: 'ERROR     | Fehler beim Ausführen.' });
      }
    }
    return;
  }

  // --- 3) Dropdown-Menü bei /help ---
  if (interaction.isStringSelectMenu()) {
    if (interaction.customId === 'help-category') {
      const category = interaction.values[0];
      const discordImageUrl =
        'https://cdn.discordapp.com/attachments/1378314925499482163/1378315047066931231/veres_bright.png';

      const filtered = [...client.commands.values()].filter((cmd) => cmd.category === category);
      const embed = new EmbedBuilder()
        .setTitle(`📁 Kategorie: ${category}`)
        .setThumbnail(discordImageUrl)
        .setDescription('Folgende Befehle gehören zu dieser Kategorie:')
        .setColor(0xff0000)
        .addFields(
          filtered.map((cmd) => ({
            name: `/${cmd.data.name}`,
            value: cmd.data.description || 'Keine Beschreibung',
          }))
        );

      await interaction.update({ embeds: [embed] });
    }
    return;
  }

  // --- 4) Button-Klicks ---
  if (interaction.isButton()) {
    // === Hilfe schließen ===
    if (interaction.customId === 'close-help') {
      try {
        await interaction.message.delete();
      } catch (err) {
        console.error('❌ Fehler beim Löschen der Hilfenachricht:', err);
      }
      return;
    }

    // === Shop-Buttons ===
    if (interaction.customId.startsWith('buy_')) {
      const { getUserFile } = require('./utils/user');
      const shopItems = require('./utils/shopItems');
      const {
        buildShopEmbed,
        buildInventoryEmbed,
        buildShopButtons,
      } = require('./utils/shopUI');
      const fsSync = require('fs');

      const name = interaction.customId.replace('buy_', '');
      const { data, file } = getUserFile(interaction.user.id);
      const item = shopItems[name];
      if (!item) return;

      const level = data.upgradeLevels?.[name] ?? 0;
      const price = Math.floor(item.basePrice * Math.pow(item.scaling, level));

      if (level >= item.maxLevel) {
        return interaction.followUp({
          content: `🔒 **${name}** ist bereits auf Max-Level.`,
        });
      }

      if (data.coins < price) {
        return interaction.followUp({
          content: `❌ Du hast nicht genug Coins!\nBenötigt: **${price}**, du hast: **${data.coins}** 💰`,
        });
      }

      data.coins -= price;
      if (!data.upgradeLevels) data.upgradeLevels = {};
      data.upgradeLevels[name] = level + 1;

      // Rolle geben (optional)
      if (item.role && data.upgradeLevels[name] === item.maxLevel) {
        const role = interaction.guild.roles.cache.find((r) => r.name === item.role);
        if (role) {
          const member = await interaction.guild.members.fetch(interaction.user.id);
          await member.roles.add(role).catch(() => {});
        }
      }

      fsSync.writeFileSync(file, JSON.stringify(data, null, 2));

      const shopEmbed = buildShopEmbed(data, interaction.user);
      const invEmbed = buildInventoryEmbed(data, interaction.user);
      const buttons = buildShopButtons(data);

      await interaction.update({
        embeds: [shopEmbed, invEmbed],
        components: buttons,
      });

      await interaction.followUp({
        content: `✅ Du hast **${name}** auf Level ${data.upgradeLevels[name]} verbessert!`,
      });
    }
    return;
  }
});

// Prefix-Commands (v.<befehl>) – optional, falls du auch Text-Commands haben willst
client.on('messageCreate', async (message) => {
  if (message.author.bot || !message.content.startsWith(PREFIX)) return;

  const args = message.content.slice(PREFIX.length).trim().split(/\s+/);
  const commandName = args.shift().toLowerCase();

  const command = client.commands.get(commandName);
  if (!command) {
    return message.reply(`❌ Unbekannter Command: \`${commandName}\``);
  }

  try {
    // Simuliere eine Interaction
    const fakeInteraction = {
      user: message.author,
      channel: message.channel,
      reply: (...args) => message.reply(...args),
      followUp: (...args) => message.reply(...args),
      member: message.member,
      guild: message.guild,
      options: {
        getString: (optName) => args[0] // nur einfaches Beispiel
      }
    };

    await command.execute(fakeInteraction, args);
  } catch (error) {
    console.error(`❌ Fehler bei Prefix-Command "${commandName}":`, error);
    await message.reply('❌ Beim Ausführen ist ein Fehler passiert.');
  }
});

client.login(process.env.DISCORD_TOKEN);
