// ============================================================
// 属性定义
// ============================================================
const ATTRIBUTES = {
  fire:     { label: '火',    color: '#ff6b35' },
  water:    { label: '水',    color: '#4fc3f7' },
  grass:    { label: '草',    color: '#81c784' },
  electric: { label: '电',    color: '#ffd54f' },
  psychic:  { label: '超能力', color: '#f48fb1' },
  ghost:    { label: '幽灵',  color: '#ce93d8' },
  fighting: { label: '格斗',  color: '#ffb74d' },
  dragon:   { label: '龙',    color: '#7986cb' },
};

// ============================================================
// 辅助函数
// ============================================================
function isHighest(attrs, key) {
  const val = attrs[key];
  return Object.entries(attrs).every(([k, v]) => k === key || v <= val);
}

// ============================================================
// 宝可梦结局（判定优先级从上到下）
// ============================================================
const POKEMON_OUTCOMES = [
  {
    id: 'eevee',
    name: '伊布',
    nameEn: 'Eevee',
    types: ['普通'],
    rarity: '隐藏',
    sprite: '✧',
    color: '#e8c97e',
    description: '你是所有可能性的集合体。没有人能预测你会成为什么——包括你自己。这正是你最珍贵的地方。无限的未来，从这里开始。',
    condition: (a) => Math.max(...Object.values(a)) < 5,
  },
  {
    id: 'mewtwo',
    name: '超梦',
    nameEn: 'Mewtwo',
    types: ['超能力'],
    rarity: '传说',
    sprite: '✦',
    color: '#ce93d8',
    description: '你触碰了意识的边界，然后穿越了它。你不属于任何地方，但你比任何存在都更了解自己。孤独是你的选择，也是你的力量。',
    condition: (a) => isHighest(a, 'psychic') && a.psychic >= 9,
  },
  {
    id: 'charizard',
    name: '喷火龙',
    nameEn: 'Charizard',
    types: ['火', '飞行'],
    rarity: '稀有',
    sprite: '★',
    color: '#ff6b35',
    description: '你是火与天空的交汇。你燃烧，你飞翔，你从不解释自己。那道尾焰只要还在，就证明你仍然在燃烧。',
    condition: (a) => isHighest(a, 'fire') && a.dragon >= 4,
  },
  {
    id: 'misdreavus',
    name: '梦妖',
    nameEn: 'Misdreavus',
    types: ['幽灵'],
    rarity: '罕见',
    sprite: '◈',
    color: '#b39ddb',
    description: '你学会了在两个世界之间漂浮。你能看见别人看不见的，也能消失在别人找不到的地方。夜晚是你真正的家。',
    condition: (a) => isHighest(a, 'ghost') && a.psychic >= 3,
  },
  {
    id: 'jolteon',
    name: '雷伊布',
    nameEn: 'Jolteon',
    types: ['电'],
    rarity: '罕见',
    sprite: '◆',
    color: '#ffd54f',
    description: '你是速度与电光。你用行动说话，你从不等待。每一根刺都是一个决定，每一道闪光都是你真实的样子。',
    condition: (a) => isHighest(a, 'electric') && a.fighting >= 3,
  },
  {
    id: 'tentacool',
    name: '拟宝珠',
    nameEn: 'Tentacool',
    types: ['水', '毒'],
    rarity: '罕见',
    sprite: '◇',
    color: '#80deea',
    description: '你漂浮在边界上——水面和水下，现实和梦境之间。你不属于哪一边，你属于两边。透明不是软弱，而是一种看穿一切的方式。',
    condition: (a) => isHighest(a, 'water') && a.ghost >= 3,
  },
  {
    id: 'weepinbell',
    name: '口呆花',
    nameEn: 'Weepinbell',
    types: ['草', '毒'],
    rarity: '罕见',
    sprite: '❋',
    color: '#aed581',
    description: '你安静地生长，用触须感知一切。你有无限的耐心等待最好的时机，然后在别人还没反应过来的时候，完成蜕变。',
    condition: (a) => isHighest(a, 'grass') && a.psychic >= 4,
  },
  {
    id: 'dratini',
    name: '迷你龙',
    nameEn: 'Dratini',
    types: ['龙'],
    rarity: '稀有',
    sprite: '※',
    color: '#7986cb',
    description: '你是古老事物的开始。很少有人见过你，但每个人都在寻找你。湖底深处的秘密，只有你知道。',
    condition: (a) => isHighest(a, 'dragon'),
  },
  {
    id: 'charmander',
    name: '小火龙',
    nameEn: 'Charmander',
    types: ['火'],
    rarity: '普通',
    sprite: '◉',
    color: '#ff8a65',
    description: '你心里有一团火。它不大，但它是你的，它从不熄灭。无论前方多难走，那道尾焰始终指引着你。',
    condition: (a) => isHighest(a, 'fire'),
  },
  {
    id: 'pikachu',
    name: '皮卡丘',
    nameEn: 'Pikachu',
    types: ['电'],
    rarity: '普通',
    sprite: '●',
    color: '#ffd54f',
    description: '你浑身是电，停不下来。但你愿意和值得信任的人待在一起。那道电流，是你表达爱的方式。',
    condition: (a) => isHighest(a, 'electric'),
  },
  {
    id: 'gengar',
    name: '耿鬼',
    nameEn: 'Gengar',
    types: ['幽灵', '毒'],
    rarity: '普通',
    sprite: '▲',
    color: '#9575cd',
    description: '黑暗对你来说不是威胁，而是家。你在阴影里笑着，没有人知道你在笑什么。也许你自己也不知道。',
    condition: (a) => isHighest(a, 'ghost'),
  },
  {
    id: 'bulbasaur',
    name: '妙蛙种子',
    nameEn: 'Bulbasaur',
    types: ['草', '毒'],
    rarity: '普通',
    sprite: '▿',
    color: '#81c784',
    description: '你身上长着什么东西。它会长大，但不急，时间很多。你天生知道如何与世界共生，而不是对抗。',
    condition: (a) => isHighest(a, 'grass'),
  },
  {
    id: 'squirtle',
    name: '杰尼龟',
    nameEn: 'Squirtle',
    types: ['水'],
    rarity: '普通',
    sprite: '○',
    color: '#4fc3f7',
    description: '你有一个壳，但你不怕打开它。水是你的语言，流动是你的本能。你知道什么时候该坚硬，什么时候该柔软。',
    condition: (a) => isHighest(a, 'water'),
  },
  {
    id: 'clefairy',
    name: '皮皮',
    nameEn: 'Clefairy',
    types: ['仙子'],
    rarity: '普通',
    sprite: '☆',
    color: '#f48fb1',
    description: '你来自哪里，没有人说得清。但你来到这里，就是对的。你的存在本身，就是一种温柔的力量。',
    condition: (a) => isHighest(a, 'psychic'),
  },
  {
    id: 'hitmonchan',
    name: '沙瓦朗',
    nameEn: 'Hitmonchan',
    types: ['格斗'],
    rarity: '普通',
    sprite: '■',
    color: '#ffb74d',
    description: '你用身体理解世界。每一次碰撞都是一种对话，每一次对抗都是一种尊重。你的拳头，比任何语言都诚实。',
    condition: (a) => isHighest(a, 'fighting'),
  },
];

// ============================================================
// 场景数据
// ============================================================
const SCENES = {
  scene_01: {
    text: [
      '黑暗。',
      '温热的黑暗。',
      '你感受到自己——',
      '或者说，你第一次意识到「感受」这件事。',
      '周围有一层弧形的壁，微微有弹性。',
      '你听见外面有声音，低沉而遥远，',
      '像是大地的呼吸。',
      '有什么东西在等着你。',
    ],
    choices: [
      {
        text: '顺着温暖的方向，向里缩去。',
        weights: { fire: 2, dragon: 1 },
        next: 'scene_02_fire',
      },
      {
        text: '用力感知外面的声音，试图辨认它。',
        weights: { psychic: 2, electric: 1 },
        next: 'scene_02_mind',
      },
      {
        text: '用身体去触碰周围的壁，试探它的质地。',
        weights: { water: 1, ghost: 1, grass: 1 },
        next: 'scene_02_sense',
      },
    ],
  },

  scene_02_fire: {
    text: [
      '温暖从中心生长出来。',
      '你发现自己的内部藏着某种明亮的东西——',
      '它不刺眼，只是热，',
      '像一块被攥在掌心的石头。',
      '外面的声音变近了，是风，是山，',
      '是什么正在远处燃烧的东西。',
      '你在它面前，感到一种奇特的亲近。',
    ],
    choices: [
      {
        text: '让那股热意扩散开来，充满整个空间。',
        weights: { fire: 3 },
        next: 'scene_03_a',
      },
      {
        text: '把热意压回中心，变成一个密实的核。',
        weights: { fire: 1, dragon: 2 },
        next: 'scene_03_b',
      },
    ],
  },

  scene_02_mind: {
    text: [
      '声音像涟漪一样在你内部展开——',
      '你听见了：水流声，落叶声，',
      '一种你没有名字的颤抖。',
      '但更奇特的是，',
      '你似乎感受到了外面某个存在的「情绪」。',
      '它在等待。有些焦虑，也有些期待。',
      '你和它之间，隔着这一层薄薄的壁。',
    ],
    choices: [
      {
        text: '向那个存在传递你的存在感——轻轻地，像一束光。',
        weights: { psychic: 3 },
        next: 'scene_03_a',
      },
      {
        text: '沉默地观察它，不发出任何信号。',
        weights: { ghost: 2, psychic: 1 },
        next: 'scene_03_b',
      },
    ],
  },

  scene_02_sense: {
    text: [
      '壁的质感非常复杂——',
      '某处光滑，某处粗粝，',
      '某处潮湿，某处温暖。',
      '你意识到每一处不同，都在告诉你一些事情。',
      '下方有隐隐的震动，',
      '像是有什么在土里移动。',
      '这种细致的注意让你感到某种满足。',
    ],
    choices: [
      {
        text: '把注意力集中在那股震动上，感受它的规律。',
        weights: { electric: 2, fighting: 1 },
        next: 'scene_03_c',
      },
      {
        text: '把所有感知均匀铺开，像一张网。',
        weights: { grass: 2, water: 1 },
        next: 'scene_03_c',
      },
    ],
  },

  scene_03_a: {
    text: [
      '你感觉自己正在变大——',
      '不是身体，是某种意义上的「存在感」。',
      '壁开始微微颤抖，外面的声音更清晰了。',
      '你听见了一种有节奏的声音：',
      '远的、近的、交错的。',
      '像心跳，又像某种倒数。',
    ],
    choices: [
      {
        text: '跟着那个节奏，让自己也跟着震动。',
        weights: { electric: 2, fire: 1 },
        next: 'scene_04',
      },
      {
        text: '把自己的意识向外延伸，试着触碰外面。',
        weights: { psychic: 2, ghost: 1 },
        next: 'scene_04',
      },
      {
        text: '收缩，然后在最饱满的一刻猛然扩张。',
        weights: { fighting: 2, fire: 1 },
        next: 'scene_04',
      },
    ],
  },

  scene_03_b: {
    text: [
      '你在静默中积蓄着什么。',
      '那道壁开始变薄——不是你推的，',
      '是时间在做这件事。',
      '某处出现了一条细线，光从那里漏进来。',
      '不是强烈的光，',
      '是一种极浅的、带着蓝色的光。',
      '你盯着它，思考它意味着什么。',
    ],
    choices: [
      {
        text: '研究那道光，试图从中读取信息。',
        weights: { psychic: 3 },
        next: 'scene_04',
      },
      {
        text: '把身体移向暗处，让自己和影子融为一体。',
        weights: { ghost: 3 },
        next: 'scene_04',
      },
      {
        text: '用指节轻轻敲击那道裂缝。',
        weights: { fighting: 1, water: 1, electric: 1 },
        next: 'scene_04',
      },
    ],
  },

  scene_03_c: {
    text: [
      '你的感知变成了一棵树——',
      '根向下，枝向上，',
      '叶子铺满了整个空间。',
      '你感受到了水分，感受到了矿物质的味道，',
      '感受到了有什么东西',
      '正在外面的泥土里等你。',
      '它不着急。它像是等了很久了。',
    ],
    choices: [
      {
        text: '向那个等待的东西靠近，感受它的轮廓。',
        weights: { grass: 2, psychic: 1 },
        next: 'scene_04',
      },
      {
        text: '扎根，让自己变得更重、更实。',
        weights: { fighting: 2, grass: 1 },
        next: 'scene_04',
      },
      {
        text: '像水一样流动，找到最低处，然后停下来。',
        weights: { water: 3 },
        next: 'scene_04',
      },
    ],
  },

  scene_04: {
    text: [
      '裂缝变大了。',
      '你没有刻意推，但它在扩张。',
      '从一条线，到一个十字，',
      '到一片复杂的网络。',
      '外面的光越来越亮——',
      '是一种湿润的、带着泥土气息的光。',
      '你感受到一种巨大的压力，',
      '从外向内，从内向外，同时存在。',
      '这是什么感觉？',
    ],
    choices: [
      {
        text: '是恐惧。但我不退缩。我用力顶着那道壁。',
        weights: { fighting: 3 },
        next: 'scene_05_force',
      },
      {
        text: '是期待。我已经准备好了。我沿着裂缝生长。',
        weights: { grass: 2, water: 1 },
        next: 'scene_05_grow',
      },
      {
        text: '我说不清楚。我选择等待，看它怎样发展。',
        weights: { ghost: 2, psychic: 1 },
        next: 'scene_05_wait',
      },
    ],
  },

  scene_05_force: {
    text: [
      '你集中全身，推。',
      '壁开裂的声音像一声闷雷，',
      '光从四面涌入——',
      '比你想象的要多，比你想象的要烫。',
      '你的第一口气带着泥土和草的气味。',
      '还有某种东西在等着你：',
      '是一片你从来没有见过，',
      '但好像本来就认识的风景。',
    ],
    choices: [
      {
        text: '站起来。不管腿是否颤抖。',
        weights: { fighting: 2, fire: 1 },
        next: 'scene_06_end',
      },
      {
        text: '先趴着。感受地面的温度和质感。',
        weights: { grass: 1, water: 1, dragon: 1 },
        next: 'scene_06_end',
      },
    ],
  },

  scene_05_grow: {
    text: [
      '你顺着裂缝延伸自己。',
      '壁不是被打破的——',
      '是被你从内部撑开的，',
      '像一朵花在展开。',
      '光是绿色的，或者说，空气是绿色的。',
      '你听见水声、虫声、',
      '风吹过树叶的声音。',
      '你在某种意义上，早就在这里了。',
    ],
    choices: [
      {
        text: '把根留在原处，只让枝叶展开。',
        weights: { grass: 3 },
        next: 'scene_06_end',
      },
      {
        text: '连根拔起，向有光的地方移动。',
        weights: { water: 2, electric: 1 },
        next: 'scene_06_end',
      },
    ],
  },

  scene_05_wait: {
    text: [
      '你等待着。',
      '然后，不是你破开了壳——',
      '是壳自己打开了。',
      '像一个礼物被拆开，',
      '只是你是那个礼物。',
      '光轻轻托起你。',
      '你感受到了：',
      '某种来自外部的、温柔的、不知来源的目光。',
      '它一直在看着你。',
    ],
    choices: [
      {
        text: '向那道目光看过去，与它对视。',
        weights: { psychic: 3 },
        next: 'scene_06_end',
      },
      {
        text: '消失进光里，看看那道目光是否还能找到你。',
        weights: { ghost: 3 },
        next: 'scene_06_end',
      },
    ],
  },

  scene_06_end: {
    text: [
      '你出来了。',
      ' ',
      '世界比你想象的要大——',
      '也比你想象的要小。',
      '它刚好能装下你。',
      ' ',
      '你还没有看到自己。',
      '你只知道你有手（或者爪），有脚，',
      '有某种感觉是翅膀，',
      '也可能不是翅膀。',
      ' ',
      '有一个声音，从很远的地方传来，',
      '叫了你一个名字。',
      ' ',
      '你听见了。',
      '那就是你。',
    ],
    choices: [],
    isEnding: true,
  },
};
