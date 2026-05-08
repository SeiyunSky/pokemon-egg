// ============================================================
// exploration-templates.js — 探索任务模板
//
// 用途：定义三个探索方向的参数，包括：
//   - duration    : 探索时长范围（分钟）
//   - energyCost  : 消耗精力值
//   - collectibleTemplates : 从哪些收藏品模板中掉落
//   - dropRate    : 掉落概率
//   - promptHint  : 给 AI 生成探索报告时的场景描述方向
//
// 如何编辑：
//   修改 promptHint 改变 AI 叙述风格和场景细节。
//   修改 collectibleTemplates 改变该方向的掉落池。
//   修改 dropRate 调整掉落概率（0-1）。
// ============================================================

export const EXPLORATION_TEMPLATES = {

  // ── 森林探索 ──────────────────────────────────────────────────────────────
  forest: {
    id: 'forest',
    label: '去森林里走走',
    emoji: '🌲',
    duration: { min: 60, max: 120 },   // 分钟，TODO: 按游戏节奏调整
    energyCost: 25,
    collectibleTemplates: [
      'object_found_outdoor',
      'memory_fragment_daily',
      // TODO: 可以加更多森林专属模板
    ],
    dropRate: 0.75,   // TODO: 调整掉落概率
    promptHint: [
      // TODO: 例如 '安静的森林，光线从树缝里透进来，宠物独自走了很久'
      // '语气要有点孤独但不悲伤，像一个人的散步'
      'TODO: 填入森林探索的场景氛围描述',
    ],
    // 特殊事件触发条件（概率性，影响探索报告叙事）
    specialEvents: [
      // TODO: 例如 { id: 'met_stranger', probability: 0.1, promptAddition: '...' }
    ],
  },

  // ── 城镇探索 ──────────────────────────────────────────────────────────────
  town: {
    id: 'town',
    label: '去城镇逛逛',
    emoji: '🏘️',
    duration: { min: 90, max: 180 },
    energyCost: 20,
    collectibleTemplates: [
      'object_found_town',
      'memory_fragment_daily',
      'skill_quirk_learned',
    ],
    dropRate: 0.8,
    promptHint: [
      // TODO: 例如 '人来人往的地方，宠物有点不自在但又很好奇，东张西望'
      'TODO: 填入城镇探索的场景氛围描述',
    ],
    specialEvents: [],
  },

  // ── 海边探索 ──────────────────────────────────────────────────────────────
  beach: {
    id: 'beach',
    label: '去海边看看',
    emoji: '🌊',
    duration: { min: 120, max: 180 },
    energyCost: 30,
    collectibleTemplates: [
      'object_found_beach',
      'memory_fragment_daily',
      // TODO: 海边探索可能触发好友线索
    ],
    dropRate: 0.85,
    promptHint: [
      // TODO: 例如 '海浪声很响，宠物坐在礁石上，风把毛吹乱了'
      'TODO: 填入海边探索的场景氛围描述',
    ],
    specialEvents: [],
  },
};

// ── 探索报告的 AI Prompt 模板框架 ─────────────────────────────────────────
// 用途：探索结束后，AI 根据此模板生成探索报告正文
// Phase 4 时在 LLMService 中引用，这里只定义结构
export const EXPLORATION_REPORT_PROMPT_TEMPLATE = {
  version: 'v1.0',

  // TODO: 填入完整 system prompt
  // 需要包含：宠物性格引导、叙事风格要求、字数限制
  systemPrompt: 'TODO',

  // TODO: 填入 user prompt 模板，变量用 {{变量名}} 标记
  // 可用变量：{{petName}} {{petSpecies}} {{personality}} {{direction}} {{duration}} {{itemName}}
  userPrompt: 'TODO',

  // 输出格式要求（AI 必须遵守）
  outputFormat: {
    story: '探索经历描述，{{字数范围}}字',          // TODO: 填入字数
    itemStory: '物品来源故事，{{字数范围}}字',       // TODO: 填入字数
  },
};
