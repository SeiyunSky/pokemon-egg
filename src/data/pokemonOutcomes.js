// ============================================================
// pokemonOutcomes.js — 宝可梦结局数据
// 原有15种 + 新增：乌波、谜拟Q、差不多娃娃
// 每种宝可梦含进化链数据
// ============================================================

// 辅助：判断某属性是否为所有属性中最高（且唯一最高）
function isHighest(attrs, key) {
  const val = attrs[key];
  return Object.entries(attrs).every(([k, v]) => k === key || v <= val);
}

// ============================================================
// 进化链定义
// stage: 进化阶段数据数组，index = evolutionStage - 1
// ============================================================
const EVOLUTION_CHAINS = {
  bulbasaur: [
    { speciesId: 'bulbasaur',  name: '妙蛙种子', nameEn: 'Bulbasaur',  sprite: '▿', color: '#81c784' },
    { speciesId: 'ivysaur',   name: '妙蛙草',   nameEn: 'Ivysaur',    sprite: '◈', color: '#66bb6a' },
    { speciesId: 'venusaur',  name: '妙蛙花',   nameEn: 'Venusaur',   sprite: '❋', color: '#4caf50' },
  ],
  charmander: [
    { speciesId: 'charmander',  name: '小火龙',   nameEn: 'Charmander',  sprite: '◉', color: '#ff8a65' },
    { speciesId: 'charmeleon',  name: '火恐龙',   nameEn: 'Charmeleon',  sprite: '★', color: '#ff7043' },
    { speciesId: 'charizard',   name: '喷火龙',   nameEn: 'Charizard',   sprite: '★', color: '#ff6b35' },
  ],
  squirtle: [
    { speciesId: 'squirtle',   name: '杰尼龟',  nameEn: 'Squirtle',   sprite: '○', color: '#4fc3f7' },
    { speciesId: 'wartortle',  name: '卡咪龟',  nameEn: 'Wartortle',  sprite: '◎', color: '#29b6f6' },
    { speciesId: 'blastoise',  name: '水箭龟',  nameEn: 'Blastoise',  sprite: '◎', color: '#0288d1' },
  ],
  pikachu: [
    { speciesId: 'pikachu',  name: '皮卡丘',  nameEn: 'Pikachu',  sprite: '●', color: '#ffd54f' },
    { speciesId: 'raichu',   name: '雷丘',    nameEn: 'Raichu',   sprite: '◆', color: '#ffb300' },
  ],
  gengar: [
    { speciesId: 'gastly',   name: '鬼斯',  nameEn: 'Gastly',   sprite: '◌', color: '#ce93d8' },
    { speciesId: 'haunter',  name: '鬼斯通', nameEn: 'Haunter', sprite: '▲', color: '#ab47bc' },
    { speciesId: 'gengar',   name: '耿鬼',  nameEn: 'Gengar',   sprite: '▲', color: '#9575cd' },
  ],
  clefairy: [
    { speciesId: 'clefairy',  name: '皮皮',    nameEn: 'Clefairy',  sprite: '☆', color: '#f48fb1' },
    { speciesId: 'clefable',  name: '皮可西',  nameEn: 'Clefable',  sprite: '★', color: '#f06292' },
  ],
  dratini: [
    { speciesId: 'dratini',    name: '迷你龙',  nameEn: 'Dratini',    sprite: '※', color: '#7986cb' },
    { speciesId: 'dragonair',  name: '哈克龙',  nameEn: 'Dragonair',  sprite: '❈', color: '#5c6bc0' },
    { speciesId: 'dragonite',  name: '快龙',    nameEn: 'Dragonite',  sprite: '✦', color: '#ef6c00' },
  ],
  // 单形态或特殊
  eevee:      [{ speciesId: 'eevee',      name: '伊布',     nameEn: 'Eevee',      sprite: '✧', color: '#e8c97e' }],
  mewtwo:     [{ speciesId: 'mewtwo',     name: '超梦',     nameEn: 'Mewtwo',     sprite: '✦', color: '#ce93d8' }],
  jolteon:    [{ speciesId: 'jolteon',    name: '雷伊布',   nameEn: 'Jolteon',    sprite: '◆', color: '#ffd54f' }],
  tentacool:  [{ speciesId: 'tentacool',  name: '拟宝珠',   nameEn: 'Tentacool',  sprite: '◇', color: '#80deea' }],
  weepinbell: [{ speciesId: 'weepinbell', name: '口呆花',   nameEn: 'Weepinbell', sprite: '❋', color: '#aed581' }],
  misdreavus: [{ speciesId: 'misdreavus', name: '梦妖',     nameEn: 'Misdreavus', sprite: '◈', color: '#b39ddb' }],
  hitmonchan: [{ speciesId: 'hitmonchan', name: '沙瓦朗',   nameEn: 'Hitmonchan', sprite: '■', color: '#ffb74d' }],
  // 新增
  wooper: [
    { speciesId: 'wooper',     name: '乌波',   nameEn: 'Wooper',    sprite: '♦', color: '#80cbc4' },
    { speciesId: 'quagsire',   name: '沼王',   nameEn: 'Quagsire',  sprite: '♣', color: '#4db6ac' },
  ],
  mimikyu: [
    { speciesId: 'mimikyu',    name: '谜拟Q',  nameEn: 'Mimikyu',   sprite: '✕', color: '#ffe082' },
  ],
  snubbull: [
    { speciesId: 'snubbull',   name: '差不多娃娃', nameEn: 'Snubbull', sprite: '♥', color: '#f48fb1' },
    { speciesId: 'granbull',   name: '布鲁',       nameEn: 'Granbull', sprite: '♥', color: '#f06292' },
  ],
};

// ============================================================
// 结局列表（判定优先级从上到下）
// chain: 进化链 key（对应 EVOLUTION_CHAINS）
// evolutionThresholds: 各阶段经验阈值
// ============================================================
export const POKEMON_OUTCOMES = [
  {
    id: 'eevee',
    chain: 'eevee',
    types: ['普通'],
    rarity: '隐藏',
    evolutionThresholds: [],  // 伊布不自动进化
    description: '你是所有可能性的集合体。没有人能预测你会成为什么——包括你自己。这正是你最珍贵的地方。无限的未来，从这里开始。',
    condition: (a) => Math.max(...Object.values(a)) < 5,
    defaultPersonality: 'curious',
  },
  {
    id: 'mewtwo',
    chain: 'mewtwo',
    types: ['超能力'],
    rarity: '传说',
    evolutionThresholds: [],
    description: '你触碰了意识的边界，然后穿越了它。你不属于任何地方，但你比任何存在都更了解自己。孤独是你的选择，也是你的力量。',
    condition: (a) => isHighest(a, 'psychic') && a.psychic >= 9,
    defaultPersonality: 'proud',
  },
  // ── 新增：谜拟Q（优先级高于 gengar/misdreavus）──
  {
    id: 'mimikyu',
    chain: 'mimikyu',
    types: ['幽灵', '妖精'],
    rarity: '稀有',
    evolutionThresholds: [],
    description: '你穿着一件拼凑的外衣，不是因为欺骗，而是因为太渴望被接受。那件衣服下面的真实的你，比任何人想象的都更温柔。',
    condition: (a) => isHighest(a, 'ghost') && a.psychic >= 5,
    defaultPersonality: 'timid',
  },
  {
    id: 'charizard',
    chain: 'charmander',
    types: ['火', '飞行'],
    rarity: '稀有',
    evolutionThresholds: [120, 500],
    description: '你是火与天空的交汇。你燃烧，你飞翔，你从不解释自己。那道尾焰只要还在，就证明你仍然在燃烧。',
    condition: (a) => isHighest(a, 'fire') && a.dragon >= 4,
    defaultPersonality: 'proud',
  },
  {
    id: 'misdreavus',
    chain: 'misdreavus',
    types: ['幽灵'],
    rarity: '罕见',
    evolutionThresholds: [],
    description: '你学会了在两个世界之间漂浮。你能看见别人看不见的，也能消失在别人找不到的地方。夜晚是你真正的家。',
    condition: (a) => isHighest(a, 'ghost') && a.psychic >= 3,
    defaultPersonality: 'timid',
  },
  {
    id: 'jolteon',
    chain: 'jolteon',
    types: ['电'],
    rarity: '罕见',
    evolutionThresholds: [],
    description: '你是速度与电光。你用行动说话，你从不等待。每一根刺都是一个决定，每一道闪光都是你真实的样子。',
    condition: (a) => isHighest(a, 'electric') && a.fighting >= 3,
    defaultPersonality: 'energetic',
  },
  // ── 新增：乌波（水属性 + 草倾向）──
  {
    id: 'wooper',
    chain: 'wooper',
    types: ['水', '地面'],
    rarity: '罕见',
    evolutionThresholds: [80, 300],
    description: '你总是那副憨憨的表情，走路也歪歪斜斜的。但你从来不担心——因为你知道，有人在旁边看着你，这就够了。',
    condition: (a) => isHighest(a, 'water') && a.grass >= 3,
    defaultPersonality: 'lazy',
  },
  {
    id: 'tentacool',
    chain: 'tentacool',
    types: ['水', '毒'],
    rarity: '罕见',
    evolutionThresholds: [],
    description: '你漂浮在边界上——水面和水下，现实和梦境之间。你不属于哪一边，你属于两边。透明不是软弱，而是一种看穿一切的方式。',
    condition: (a) => isHighest(a, 'water') && a.ghost >= 3,
    defaultPersonality: 'curious',
  },
  {
    id: 'weepinbell',
    chain: 'weepinbell',
    types: ['草', '毒'],
    rarity: '罕见',
    evolutionThresholds: [],
    description: '你安静地生长，用触须感知一切。你有无限的耐心等待最好的时机，然后在别人还没反应过来的时候，完成蜕变。',
    condition: (a) => isHighest(a, 'grass') && a.psychic >= 4,
    defaultPersonality: 'lazy',
  },
  {
    id: 'dratini',
    chain: 'dratini',
    types: ['龙'],
    rarity: '稀有',
    evolutionThresholds: [150, 600],
    description: '你是古老事物的开始。很少有人见过你，但每个人都在寻找你。湖底深处的秘密，只有你知道。',
    condition: (a) => isHighest(a, 'dragon'),
    defaultPersonality: 'proud',
  },
  {
    id: 'charmander',
    chain: 'charmander',
    types: ['火'],
    rarity: '普通',
    evolutionThresholds: [100, 400],
    description: '你心里有一团火。它不大，但它是你的，它从不熄灭。无论前方多难走，那道尾焰始终指引着你。',
    condition: (a) => isHighest(a, 'fire'),
    defaultPersonality: 'energetic',
  },
  {
    id: 'pikachu',
    chain: 'pikachu',
    types: ['电'],
    rarity: '普通',
    evolutionThresholds: [100, 350],
    description: '你浑身是电，停不下来。但你愿意和值得信任的人待在一起。那道电流，是你表达爱的方式。',
    condition: (a) => isHighest(a, 'electric'),
    defaultPersonality: 'energetic',
  },
  {
    id: 'gengar',
    chain: 'gengar',
    types: ['幽灵', '毒'],
    rarity: '普通',
    evolutionThresholds: [80, 300],
    description: '黑暗对你来说不是威胁，而是家。你在阴影里笑着，没有人知道你在笑什么。也许你自己也不知道。',
    condition: (a) => isHighest(a, 'ghost'),
    defaultPersonality: 'curious',
  },
  {
    id: 'bulbasaur',
    chain: 'bulbasaur',
    types: ['草', '毒'],
    rarity: '普通',
    evolutionThresholds: [100, 400],
    description: '你身上长着什么东西。它会长大，但不急，时间很多。你天生知道如何与世界共生，而不是对抗。',
    condition: (a) => isHighest(a, 'grass'),
    defaultPersonality: 'lazy',
  },
  {
    id: 'squirtle',
    chain: 'squirtle',
    types: ['水'],
    rarity: '普通',
    evolutionThresholds: [100, 400],
    description: '你有一个壳，但你不怕打开它。水是你的语言，流动是你的本能。你知道什么时候该坚硬，什么时候该柔软。',
    condition: (a) => isHighest(a, 'water'),
    defaultPersonality: 'timid',
  },
  {
    id: 'clefairy',
    chain: 'clefairy',
    types: ['仙子'],
    rarity: '普通',
    evolutionThresholds: [100, 300],
    description: '你来自哪里，没有人说得清。但你来到这里，就是对的。你的存在本身，就是一种温柔的力量。',
    condition: (a) => isHighest(a, 'psychic'),
    defaultPersonality: 'timid',
  },
  {
    id: 'hitmonchan',
    chain: 'hitmonchan',
    types: ['格斗'],
    rarity: '普通',
    evolutionThresholds: [],
    description: '你用身体理解世界。每一次碰撞都是一种对话，每一次对抗都是一种尊重。你的拳头，比任何语言都诚实。',
    condition: (a) => isHighest(a, 'fighting'),
    defaultPersonality: 'energetic',
  },
  // ── 新增：差不多娃娃（格斗 + 超能力）──
  {
    id: 'snubbull',
    chain: 'snubbull',
    types: ['妖精'],
    rarity: '普通',
    evolutionThresholds: [100, 350],
    description: '你顶着一张让人不敢靠近的脸，但你其实是个黏人精。你只是不知道怎么表达——所以用凶脸代替了拥抱。',
    condition: (a) => isHighest(a, 'fighting') && a.psychic >= 3,
    defaultPersonality: 'proud',
  },
];

/**
 * 根据属性权重判定宝可梦
 * @param {object} attributeWeights
 * @returns {object} 结局对象
 */
export function determineOutcome(attributeWeights) {
  for (const outcome of POKEMON_OUTCOMES) {
    if (outcome.condition(attributeWeights)) return outcome;
  }
  return POKEMON_OUTCOMES.find(o => o.id === 'eevee');
}

/**
 * 获取某只宝可梦在指定进化阶段的外观数据
 * @param {string} chainKey  - e.g. 'bulbasaur'
 * @param {number} stage     - 1-based
 */
export function getStageData(chainKey, stage) {
  const chain = EVOLUTION_CHAINS[chainKey];
  if (!chain) return null;
  return chain[Math.min(stage - 1, chain.length - 1)];
}

export { EVOLUTION_CHAINS };
