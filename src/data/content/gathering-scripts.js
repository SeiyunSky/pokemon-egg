// ============================================================
// gathering-scripts.js — 朋友聚会场景配置
//
// 用途：定义聚会场景的触发条件和话题种子，
//       AI 根据这些种子生成具体的多角色对话内容。
//
// 如何编辑：
//   - 修改 topicSeeds 改变聚会对话的话题方向
//   - 修改 triggerConditions 调整什么时候触发哪种聚会
//   - 新增 scene：复制一个条目，改 id 和内容
//
// 注意：这里只定义"话题方向"，不写具体台词。
//       台词由 AI 在 Phase 4 根据这些种子实时生成。
// ============================================================

export const GATHERING_SCENES = [

  // ── 日常来访（最普通的聚会）─────────────────────────────────────────────
  {
    id: 'casual_visit',
    label: '普通来访',
    triggerConditions: {
      // 没有特殊条件，周期性来访时使用此场景
      type: 'scheduled',
    },
    topicSeeds: [
      // TODO: 填入话题种子，例如：
      // '聊最近天气，宠物会提到最近的某件收藏品',
      // '好友带来了一件小东西，讨论一下这东西从哪来',
      'TODO: 填入日常来访的话题方向',
    ],
    dialogueTurns: { min: 3, max: 5 },  // TODO: 调整对话轮数
    possibleDrops: [
      // TODO: 这个场景可能掉落的收藏品模板 id 列表
    ],
    promptHint: 'TODO: 填入聚会场景的整体氛围描述，供 AI 把握语气',
  },

  // ── 好友发现了某件收藏品 ────────────────────────────────────────────────
  {
    id: 'curious_about_collectible',
    label: '好友对收藏品感兴趣',
    triggerConditions: {
      type: 'collectible_trigger',
      // 当宠物有特定类型的收藏品时，好友来访可能触发此场景
      requiredCollectibleCategories: ['object', 'friend_gift'],  // TODO: 调整
    },
    topicSeeds: [
      // TODO: 例如 '好友注意到了某件东西，想知道来历'
      // '宠物解释了这件东西的故事，好友有自己的联想'
      'TODO: 填入好友对收藏品好奇时的对话方向',
    ],
    dialogueTurns: { min: 4, max: 6 },
    possibleDrops: [],
    promptHint: 'TODO',
  },

  // ── 安慰来访（宠物心情低落时）──────────────────────────────────────────
  {
    id: 'comfort_visit',
    label: '安慰来访',
    triggerConditions: {
      type: 'stat_trigger',
      condition: 'mood < 40',  // 心情低于 40 时可能触发
    },
    topicSeeds: [
      // TODO: 例如 '好友察觉到宠物状态不好，没有直接问，而是做了别的事'
      // '对话里有空白和停顿，不需要解决问题，只是陪着'
      'TODO: 填入安慰场景的对话方向，要自然不要说教',
    ],
    dialogueTurns: { min: 3, max: 4 },
    possibleDrops: ['memory_fragment_daily'],
    promptHint: 'TODO',
  },

  // ── 庆祝进化 ────────────────────────────────────────────────────────────
  {
    id: 'celebrate_evolution',
    label: '庆祝进化',
    triggerConditions: {
      type: 'event_trigger',
      event: 'pet:evolution',  // 进化后下一次好友来访使用此场景
    },
    topicSeeds: [
      // TODO: 例如 '好友第一次见到进化后的样子，有点惊讶有点高兴'
      // '聊进化前后有什么不一样的感觉'
      'TODO: 填入进化庆祝场景的对话方向',
    ],
    dialogueTurns: { min: 4, max: 6 },
    possibleDrops: ['memory_fragment_milestone'],
    promptHint: 'TODO',
  },

  // TODO: 可以继续添加更多场景，例如：
  // - 节日聚会
  // - 探索归来分享
  // - 好友自己遇到了什么事来倾诉
];

// ── 聚会对话的 AI Prompt 模板框架 ─────────────────────────────────────────
export const GATHERING_PROMPT_TEMPLATE = {
  version: 'v1.0',

  // TODO: 填入 system prompt
  // 需要包含：多角色扮演规则、对话格式要求、不能做的事
  systemPrompt: 'TODO',

  // TODO: 填入 user prompt 模板
  // 可用变量：{{petName}} {{petSpecies}} {{petPersonality}} {{petStats}}
  //           {{friendName}} {{friendSpecies}} {{friendPersonality}}
  //           {{sceneTopics}} {{relevantCollectibles}} {{recentMemories}}
  userPrompt: 'TODO',

  // 输出格式（AI 必须返回此格式）
  outputFormat: `
[
  { "speaker": "宠物名", "text": "台词" },
  { "speaker": "好友名", "text": "台词" },
  ...
]
  `.trim(),
};
