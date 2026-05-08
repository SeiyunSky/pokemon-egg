// ============================================================
// collectible-templates.js — 收藏品生成模板
//
// 用途：AI 生成收藏品时的结构约束，每个模板定义：
//   - promptHint : 给 AI 的生成提示方向（越具体 AI 生成越稳定）
//   - emojiPool  : 这类收藏品可以用哪些 emoji
//   - rarity     : 稀有度权重（common/rare/unique）
//   - slotType   : 可放在小屋的哪类槽位（wall/shelf/floor）
//   - unlockHints: 这类收藏品通常解锁什么（填代码时参考）
//
// 如何编辑：
//   直接修改 promptHint 文字即可改变 AI 生成方向。
//   新增模板：复制一个条目，改 id 和内容，代码会自动识别。
//   删除模板：把 enabled 改为 false，不会影响已生成的收藏品。
// ============================================================

export const COLLECTIBLE_TEMPLATES = [

  // ── 户外捡到的东西 ────────────────────────────────────────────────────────
  {
    id: 'object_found_outdoor',
    enabled: true,
    category: 'object',
    label: '户外拾得物',
    promptHint: [
      // TODO: 填入具体的生成引导，例如：
      // '来自自然环境的小东西，有点神秘，有点普通，但宠物觉得很特别',
      // '物品本身不贵重，但背后有一个小故事',
      'TODO: 填入 AI 生成引导文字',
    ],
    emojiPool: ['🍂', '🪨', '🐚', '🌿', '🪵', '🍄'],  // TODO: 按需增减
    rarity: { common: 0.6, rare: 0.35, unique: 0.05 },
    slotType: ['shelf', 'floor'],
    unlockHints: [
      // TODO: 说明这类收藏品通常解锁什么互动或话术
    ],
  },

  // ── 城镇捡到的东西 ────────────────────────────────────────────────────────
  {
    id: 'object_found_town',
    enabled: true,
    category: 'object',
    label: '城镇拾得物',
    promptHint: [
      // TODO: 例如 '来自人类生活的遗留物，有点旧，让宠物对人类生活产生好奇'
      'TODO: 填入 AI 生成引导文字',
    ],
    emojiPool: ['🎩', '📎', '🪙', '🔑', '📬', '🧷'],  // TODO: 按需增减
    rarity: { common: 0.5, rare: 0.4, unique: 0.1 },
    slotType: ['wall', 'shelf'],
    unlockHints: [],
  },

  // ── 海边捡到的东西 ────────────────────────────────────────────────────────
  {
    id: 'object_found_beach',
    enabled: true,
    category: 'object',
    label: '海边拾得物',
    promptHint: [
      'TODO: 填入 AI 生成引导文字',
    ],
    emojiPool: ['🐚', '🪸', '🫧', '🌊', '⛵', '🪝'],
    rarity: { common: 0.5, rare: 0.4, unique: 0.1 },
    slotType: ['shelf', 'floor'],
    unlockHints: [],
  },

  // ── 记忆碎片 ──────────────────────────────────────────────────────────────
  {
    id: 'memory_fragment_daily',
    enabled: true,
    category: 'memory_fragment',
    label: '日常记忆碎片',
    promptHint: [
      // TODO: 例如 '某个平凡但让宠物印象深刻的瞬间，用第一人称宠物视角描述'
      // '不超过两句话，有情绪，像一张快照'
      'TODO: 填入 AI 生成引导文字',
    ],
    emojiPool: ['💭', '🌙', '✨', '💫', '🫧'],
    rarity: { common: 0.3, rare: 0.6, unique: 0.1 },
    slotType: ['wall'],   // 记忆碎片只挂墙上
    unlockHints: [
      // TODO: 记忆碎片通常让宠物在对话中提及该记忆
    ],
  },

  // ── 记忆碎片（里程碑）────────────────────────────────────────────────────
  {
    id: 'memory_fragment_milestone',
    enabled: true,
    category: 'memory_fragment',
    label: '里程碑记忆',
    promptHint: [
      // TODO: 例如 '记录一个重要时刻，语气郑重但不煽情，像一块小纪念牌'
      'TODO: 填入 AI 生成引导文字',
    ],
    emojiPool: ['🏅', '⭐', '🎖️', '📜'],
    rarity: { common: 0, rare: 0.3, unique: 0.7 },
    slotType: ['wall'],
    unlockHints: [],
  },

  // ── 技能/癖好 ─────────────────────────────────────────────────────────────
  {
    id: 'skill_quirk_learned',
    enabled: true,
    category: 'skill_quirk',
    label: '学会的技能或癖好',
    promptHint: [
      // TODO: 例如 '宠物无意间学会了某个小动作或养成了某个习惯，带点可爱的违和感'
      'TODO: 填入 AI 生成引导文字',
    ],
    emojiPool: ['🎪', '🤸', '💤', '👃', '🌀', '🎭'],
    rarity: { common: 0.2, rare: 0.6, unique: 0.2 },
    slotType: ['floor'],  // 技能展示在地板区域（宠物身边）
    unlockHints: [
      // TODO: 技能/癖好通常解锁特殊动画或互动动作
    ],
  },

  // ── 好友礼物（每个好友各一个模板）────────────────────────────────────────
  {
    id: 'friend_gift_wooper',
    enabled: true,
    category: 'friend_gift',
    label: '乌波带来的礼物',
    promptHint: [
      // TODO: 例如 '和泥土、水、憨厚相关，带点乌波特有的不知道这算不算礼物的气质'
      'TODO: 填入 AI 生成引导文字',
    ],
    emojiPool: ['🪣', '💧', '🟫', '🌱'],
    rarity: { common: 0.5, rare: 0.4, unique: 0.1 },
    slotType: ['floor', 'shelf'],
    unlockHints: [],
  },

  {
    id: 'friend_gift_mimikyu',
    enabled: true,
    category: 'friend_gift',
    label: '谜拟Q带来的礼物',
    promptHint: [
      // TODO: 例如 '布料、针线、伪装相关，带点谜拟Q想被接受的温柔心意'
      'TODO: 填入 AI 生成引导文字',
    ],
    emojiPool: ['🧵', '🪡', '👻', '🎭', '🧸'],
    rarity: { common: 0.3, rare: 0.5, unique: 0.2 },
    slotType: ['wall', 'shelf'],
    unlockHints: [],
  },

  {
    id: 'friend_gift_snubbull',
    enabled: true,
    category: 'friend_gift',
    label: '差不多娃娃带来的礼物',
    promptHint: [
      // TODO: 例如 '咬过的东西或粉色物品，体现差不多娃娃凶脸软心的特质'
      'TODO: 填入 AI 生成引导文字',
    ],
    emojiPool: ['🦷', '🎀', '💗', '🧸'],
    rarity: { common: 0.5, rare: 0.4, unique: 0.1 },
    slotType: ['floor', 'shelf'],
    unlockHints: [],
  },

  // ── 节日限定 ──────────────────────────────────────────────────────────────
  {
    id: 'seasonal_birthday',
    enabled: true,
    category: 'seasonal',
    label: '宠物生日纪念物',
    promptHint: [
      // TODO: 例如 '生日专属，每年一次，记录宠物这一年的成长，有点感慨有点温暖'
      'TODO: 填入 AI 生成引导文字',
    ],
    emojiPool: ['🎂', '🕯️', '🎁', '🎈', '🎊'],
    rarity: { common: 0, rare: 0, unique: 1.0 },  // 生日纪念物必为 unique
    slotType: ['wall', 'shelf'],
    unlockHints: [],
  },

  // TODO: 按需添加更多节日模板（春节、圣诞、万圣节等）
];
