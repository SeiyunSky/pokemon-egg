// ============================================================
// dialogue-lines.js — 收藏品解锁的宠物话术库
//
// 用途：宠物在对话中会主动提及已收藏的东西。
//       这里定义"有哪些话术"，具体说法由 AI 根据性格二次生成。
//       这里的 text 是话题种子，不是最终台词。
//
// 如何编辑：
//   - 修改 text 改变宠物提及这件事的话题方向
//   - 修改 triggerCollectibleId 绑定到具体收藏品
//   - 修改 triggerCondition 调整触发时机
//   - enabled: false 可以临时关闭某条话术
// ============================================================

export const DIALOGUE_LINES = [

  // ── 收藏品相关话术 ────────────────────────────────────────────────────────

  {
    id: 'talk_about_hat',
    enabled: true,
    triggerCollectibleId: null,       // TODO: 填入对应收藏品的 id（生成后确定）
    triggerCollectibleTemplate: 'object_found_town',  // 或用模板类型触发
    triggerCondition: 'random_in_chat',  // 对话中随机触发
    triggerProbability: 0.3,             // TODO: 调整触发概率
    text: 'TODO: 宠物想提起那顶帽子时，话题的方向是什么？它是怎么看待这件东西的？',
    // 例如：'它会把话题绕到那顶帽子上，想猜原来的主人是谁'
  },

  {
    id: 'talk_about_rainy_leaf',
    enabled: true,
    triggerCollectibleId: null,
    triggerCollectibleTemplate: 'object_found_outdoor',
    triggerCondition: 'rainy_weather_or_random',  // TODO: 根据天气或随机触发
    triggerProbability: 0.4,
    text: 'TODO: 宠物想起那片叶子时的话题方向',
  },

  {
    id: 'talk_about_wooper_gift',
    enabled: true,
    triggerCollectibleId: null,
    triggerCollectibleTemplate: 'friend_gift_wooper',
    triggerCondition: 'after_wooper_visit',  // 乌波来访后触发
    triggerProbability: 0.6,
    text: 'TODO: 宠物提到乌波送来的东西时，会说什么方向的话',
  },

  {
    id: 'talk_about_milestone',
    enabled: true,
    triggerCollectibleId: null,
    triggerCollectibleTemplate: 'memory_fragment_milestone',
    triggerCondition: 'intimacy_above_50',  // 亲密度高时才提
    triggerProbability: 0.5,
    text: 'TODO: 宠物提起某个里程碑记忆时的话题方向',
  },

  // TODO: 随着收藏品模板增加，在这里持续添加对应话术
];

// ── 亲密度解锁的固定话术（不依赖收藏品）─────────────────────────────────
export const INTIMACY_UNLOCKED_LINES = [

  {
    id: 'first_nickname',
    enabled: true,
    unlockAtIntimacy: 10,
    description: '宠物开始有口头禅，对话时偶尔出现',
    // TODO: 填入口头禅的方向，例如 '结尾总要加一个疑问，像是在确认对方还在听'
    quirk: 'TODO',
  },

  {
    id: 'say_human_words',
    enabled: true,
    unlockAtIntimacy: 60,
    description: '亲密度 60 后，宠物偶尔能说出简短人话',
    // TODO: 填入人话的方向和限制，例如 '只说不超过5个字的词，而且会立刻假装是偶然'
    quirk: 'TODO',
  },

  // TODO: 可以添加更多亲密度里程碑解锁的话术特性
];
