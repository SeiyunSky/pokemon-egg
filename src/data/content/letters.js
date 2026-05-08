// ============================================================
// letters.js — 信件系统配置
//
// 玩法参考：动物森友会信件机制
//
// 信件来源：
//   1. 好友给宠物的信（乌波、谜拟Q、差不多娃娃偶尔寄来）
//   2. 玩家给自己宠物写信（宠物会有 AI 生成的回信）
//   3. 玩家之间互送信件（社交功能，Phase 后期）
//   4. 系统信件（节日祝福、里程碑纪念）
//
// 信件可以附带收藏品或道具作为礼物。
// 读完的信存入收藏册"信件"页。
//
// 如何编辑：
//   修改 friendLetterTemplates 改变好友来信的话题方向。
//   修改 systemLetterTriggers 调整系统信件的触发条件。
// ============================================================

// ── 好友来信模板 ──────────────────────────────────────────────────────────
// 好友偶尔主动给宠物写信（不是来访，只是寄封信）
export const FRIEND_LETTER_TEMPLATES = [

  {
    id: 'wooper_letter_01',
    senderId: 'wooper',
    triggerCondition: 'random_weekly',   // 每周随机触发一次
    triggerProbability: 0.3,
    attachedItemId: null,                // TODO: 可以附带道具 id
    attachedCollectibleTemplate: 'friend_gift_wooper',  // 随信附上收藏品
    promptHint: [
      // TODO: 例如 '乌波写信，但它不太会写字，内容很简短，有几个错别字，
      //             但是诚意十足，末尾画了一个自画像'
      'TODO: 填入乌波来信的风格和话题方向',
    ],
    signoff: 'TODO: 乌波的信件落款风格',
  },

  {
    id: 'mimikyu_letter_01',
    senderId: 'mimikyu',
    triggerCondition: 'random_weekly',
    triggerProbability: 0.25,
    attachedItemId: null,
    attachedCollectibleTemplate: null,
    promptHint: [
      'TODO: 谜拟Q来信的风格，小心翼翼，话里有话，想说很多但又不敢说太多',
    ],
    signoff: 'TODO',
  },

  {
    id: 'snubbull_letter_01',
    senderId: 'snubbull',
    triggerCondition: 'after_evolution',  // 宠物进化后发来
    triggerProbability: 0.8,
    attachedItemId: null,
    attachedCollectibleTemplate: 'friend_gift_snubbull',
    promptHint: [
      'TODO: 差不多娃娃来信，表面上是找茬，实际是在说恭喜，别人看不出来但很明显',
    ],
    signoff: 'TODO',
  },

  // TODO: 节日限定来信（春节、圣诞、万圣节）
  // TODO: 好友来访之后的感谢信
];

// ── 宠物回信配置 ──────────────────────────────────────────────────────────
// 玩家给宠物写信，宠物会用 AI 生成回信
export const PET_REPLY_CONFIG = {
  enabled: true,
  replyDelayHours: { min: 2, max: 8 },  // TODO: 调整回信延迟（模拟真实感）
  promptHint: [
    // TODO: 例如 '宠物回信，用自己的方式理解了玩家写的内容，
    //             回应里有自己的小心思，不是直接答复而是有点歪楼'
    'TODO: 宠物回信的 AI 生成方向',
  ],
  availableVars: [
    '{{petName}}', '{{petSpecies}}', '{{petPersonality}}',
    '{{intimacy}}', '{{trainerName}}',
    '{{playerLetterContent}}',  // 玩家写的信件内容
    '{{ragMemories}}',          // 检索到的相关记忆
  ],
  systemPrompt: 'TODO',
  userPrompt: 'TODO',
  outputFormat: {
    content: 'string（50-120字，宠物语气）',
    signoff: 'string（宠物的落款，10字以内）',
  },
};

// ── 系统信件触发条件 ──────────────────────────────────────────────────────
// 游戏系统在特定时机发送的信件（非 AI 生成，固定内容模板）
export const SYSTEM_LETTER_TRIGGERS = [

  {
    id: 'welcome_letter',
    trigger: 'first_hatch',   // 第一次孵化后收到
    // TODO: 填入欢迎信的内容模板，语气温暖，介绍基本玩法
    content: 'TODO',
    attachedItemId: 'berry_normal',
    attachedQuantity: 5,
  },

  {
    id: 'evolution_letter',
    trigger: 'on_evolution',  // 每次进化后收到
    // TODO: 填入进化纪念信的内容，可以引用进化阶段数据
    content: 'TODO: 支持 {{petName}} {{evolutionStage}} 等变量',
    attachedCollectibleTemplate: 'memory_fragment_milestone',
  },

  {
    id: 'birthday_letter',
    trigger: 'pet_birthday',  // 宠物生日
    content: 'TODO',
    attachedCollectibleTemplate: 'seasonal_birthday',
  },

  // TODO: 连续登录里程碑信件（7天、30天、100天）
  // TODO: 季节更替通知信
];
