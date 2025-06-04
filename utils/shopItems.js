const { EMOJI_DART, EMOJI_HEART, EMOJI_SPLITTER, EMOJI_SEARCHER, EMOJI_GOLDDIGGER, EMOJI_BOOSTER } = require('./emojis');

module.exports = {
  'LoveMagnet': {
    basePrice: 100,
    scaling: 1.5,
    maxLevel: 50,
    emoji: `${EMOJI_DART}`,
    description: 'Erhöht die Wahrscheinlichkeit, zusätzliche Herzen bei jedem Fund zu erhalten.'
  },
  'AutoLove': {
    basePrice: 500,
    scaling: 2,
    maxLevel: 100,
    emoji: `${EMOJI_HEART}`,
    description: 'Generiert automatisch ein Herz pro Stunde – auch wenn du offline bist.',
    role: 'Love Farmer'
  },
  'HeartSplitter': {
    basePrice: 600,
    scaling: 1.6,
    maxLevel: 40,
    emoji: `${EMOJI_SPLITTER}`,
    description: '5% Chance auf einen kritischen Herzfund mit dreifachem Wert.'
  },
  'TitelSearcher': {
    basePrice: 1200,
    scaling: 2,
    maxLevel: 20,
    emoji: `${EMOJI_SEARCHER}`,
    description: 'Erhöht drastisch die Chance, legendäre Herzen zu finden.',
    role: 'Legend Hunter'
  },
  'Golddigger': {
    basePrice: 800,
    scaling: 1.5,
    maxLevel: 60,
    emoji: `${EMOJI_GOLDDIGGER}`,
    description: 'Gibt dir beim Verkaufen von Herzen mehr Coins pro Herz.'
  },
  'Streak-Booster': {
    basePrice: 450,
    scaling: 1.3,
    maxLevel: 25,
    emoji: `${EMOJI_BOOSTER}`,
    description: 'Verlängert deinen täglichen Streak bei Inaktivität um einen zusätzlichen Tag.'
  },
};
