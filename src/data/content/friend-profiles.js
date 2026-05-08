// ============================================================
// friend-profiles.js — 好友性格、礼物池、来访条件
//
// 用途：定义所有 NPC 好友的完整配置。
//       全量数据（好友详情）在这里，ChromaDB RAG 里只存浓缩摘要。
//
// 如何编辑：
//   - 修改 personality.description 改变 AI 扮演该好友的语气
//   - 修改 visitConditions 调整解锁和来访触发逻辑
//   - 修改 giftPool 增减该好友会带来的礼物类型
//   - 新增好友：复制一个条目，改 id 和内容
// ============================================================

export const FRIEND_PROFILES = [

  // ── 乌波 ──────────────────────────────────────────────────────────────────
  {
    id: 'wooper',
    name: '乌波',
    species: 'Wooper',
    emoji: '💧',
    avatarCssClass: 'sprite-wooper',
    spriteUrl: '/assets/sprites/wooper.gif',  // TODO: 放入对应图片

    personality: {
      trait: 'lazy',
      description: [
        // TODO: 填入具体性格描述，供 AI 扮演时参考，例如：
        // '说话简短，经常停顿，不是不想说，是想了很久也没想好怎么说',
        // '不太理解复杂情绪，但会用行动表达关心，比如突然送来一坨泥巴',
        'TODO: 填入乌波的性格描述',
      ],
      // 口头禅 / 说话习惯（AI 生成对话时偶尔使用）
      speechQuirks: [
        // TODO: 例如 '经常在句子末尾加"......"表示还在思考'
        'TODO',
      ],
    },

    visitConditions: {
      unlockRequirement: {
        petIntimacy: 20,  // 宠物亲密度达到此值才解锁乌波
        // TODO: 可以加其他解锁条件
      },
      baseIntervalHours: 24,
      specialTriggers: [
        {
          condition: 'pet_has_water_collectible',  // TODO: 定义触发条件
          description: '宠物有水系收藏品时乌波必来',
          scene: 'curious_about_collectible',
        },
        // TODO: 可以添加更多特殊触发条件
      ],
    },

    giftPool: [
      'friend_gift_wooper',  // 对应 collectible-templates.js 中的模板 id
      // TODO: 可以指定固定道具 id（items.js 中的）
    ],

    // 浓缩摘要（存入 ChromaDB RAG 的版本，比 description 更短）
    ragSummary: 'TODO: 一两句话概括乌波的核心特质，供 AI 检索时快速理解',
  },

  // ── 谜拟Q ─────────────────────────────────────────────────────────────────
  {
    id: 'mimikyu',
    name: '谜拟Q',
    species: 'Mimikyu',
    emoji: '🎭',
    avatarCssClass: 'sprite-mimikyu',
    spriteUrl: '/assets/sprites/mimikyu.gif',  // TODO

    personality: {
      trait: 'timid',
      description: [
        // TODO: 例如 '渴望被喜欢，说话很小心，总是先问对方感受再说自己的'
        'TODO: 填入谜拟Q的性格描述',
      ],
      speechQuirks: ['TODO'],
    },

    visitConditions: {
      unlockRequirement: {
        petIntimacy: 30,
        requiredCollectibleCategory: 'friend_gift',  // 需要先有任意好友礼物
        // TODO: 可以加更多条件
      },
      baseIntervalHours: 48,
      specialTriggers: [
        {
          condition: 'pet_mood_low',
          description: '宠物心情 < 40 时谜拟Q来安慰',
          scene: 'comfort_visit',
        },
      ],
    },

    giftPool: ['friend_gift_mimikyu'],
    ragSummary: 'TODO',
  },

  // ── 差不多娃娃 ────────────────────────────────────────────────────────────
  {
    id: 'snubbull',
    name: '差不多娃娃',
    species: 'Snubbull',
    emoji: '💗',
    avatarCssClass: 'sprite-snubbull',
    spriteUrl: '/assets/sprites/snubbull.gif',  // TODO

    personality: {
      trait: 'proud',
      description: [
        // TODO: 例如 '表面上很凶，实际上很黏，表达关心的方式很奇怪但是真诚'
        'TODO: 填入差不多娃娃的性格描述',
      ],
      speechQuirks: ['TODO'],
    },

    visitConditions: {
      unlockRequirement: {
        petIntimacy: 25,
      },
      baseIntervalHours: 36,
      specialTriggers: [
        {
          condition: 'pet_evolution',
          description: '宠物进化后差不多娃娃来庆祝',
          scene: 'celebrate_evolution',
        },
      ],
    },

    giftPool: ['friend_gift_snubbull'],
    ragSummary: 'TODO',
  },

  // TODO: 可以继续添加更多好友
  // 建议下一个好友：和主宠物种类相关的 NPC（根据孵化结果动态解锁）
];
