// ============================================================
// daily-rewards.js — 每日签到奖励池
//
// 用途：定义签到奖励的两种形式：
//   1. 固定奖励：直接给道具，无需 AI，稳定可预期
//   2. AI 奖励：给一件由 AI 生成描述的收藏品，每次不同
//
// 如何编辑：
//   - 修改 fixedRewards 的 itemId/quantity 调整固定奖励内容
//   - 修改 aiRewardTemplates 调整 AI 奖励的生成方向
//   - 修改 weights 调整固定/AI 奖励的比例
// ============================================================

// ── 固定奖励池 ────────────────────────────────────────────────────────────
// 直接给道具，不经过 AI
export const FIXED_DAILY_REWARDS = [

  {
    id: 'daily_berry_normal',
    weight: 40,   // 抽中概率权重（相对值，所有 weight 加起来不必等于100）
    type: 'item',
    itemId: 'berry_normal',   // 对应 items.js 中的 id
    quantity: 2,
    message: 'TODO: 玩家看到这个奖励时显示的文字，一句话，轻松随意',
  },

  {
    id: 'daily_berry_spicy',
    weight: 20,
    type: 'item',
    itemId: 'berry_spicy',    // TODO: 确认 items.js 中有此 id
    quantity: 1,
    message: 'TODO',
  },

  {
    id: 'daily_toy',
    weight: 15,
    type: 'item',
    itemId: 'toy_ball',
    quantity: 1,
    message: 'TODO',
  },

  // TODO: 随着 items.js 补充内容，在这里添加更多固定奖励
];

// ── AI 奖励模板池 ─────────────────────────────────────────────────────────
// AI 根据模板生成一件独特收藏品作为奖励
export const AI_DAILY_REWARD_TEMPLATES = [

  {
    id: 'daily_ai_spring',
    weight: 25,
    type: 'ai_collectible',
    season: 'spring',   // 春季（3-5月）触发
    collectibleTemplate: 'object_found_outdoor',
    promptHint: [
      // TODO: 例如 '春天登录，宠物好像在门口等你，顺手捡了一样东西带回来'
      'TODO: 填入春季签到的 AI 奖励生成方向',
    ],
  },

  {
    id: 'daily_ai_summer',
    weight: 25,
    type: 'ai_collectible',
    season: 'summer',
    collectibleTemplate: 'object_found_beach',
    promptHint: [
      'TODO: 填入夏季签到的 AI 奖励生成方向',
    ],
  },

  {
    id: 'daily_ai_autumn',
    weight: 25,
    type: 'ai_collectible',
    season: 'autumn',
    collectibleTemplate: 'object_found_outdoor',
    promptHint: [
      'TODO: 填入秋季签到的 AI 奖励生成方向',
    ],
  },

  {
    id: 'daily_ai_winter',
    weight: 25,
    type: 'ai_collectible',
    season: 'winter',
    collectibleTemplate: 'object_found_town',
    promptHint: [
      'TODO: 填入冬季签到的 AI 奖励生成方向',
    ],
  },

  // TODO: 可以加节日限定的 AI 奖励模板
];

// ── 连续登录奖励 ──────────────────────────────────────────────────────────
// 连续登录 N 天时额外触发
export const STREAK_REWARDS = [
  {
    streakDays: 3,
    type: 'item',
    itemId: 'berry_normal',
    quantity: 5,
    message: 'TODO: 连续3天的鼓励文字',
  },
  {
    streakDays: 7,
    type: 'ai_collectible',
    collectibleTemplate: 'memory_fragment_daily',
    message: 'TODO: 连续7天的特殊奖励文字',
    promptHint: ['TODO: 连续一周登录，宠物有什么特别的感受想记录下来'],
  },
  // TODO: 可以继续添加 14天、30天等里程碑奖励
];
