// ============================================================
// ai-prompt-templates.js — 所有 AI 功能的 Prompt 模板
//
// 用途：集中管理全部 AI 功能的 system prompt 和 user prompt。
//       Phase 4 实现 LLMService 时直接引用此文件。
//       现在只留框架，TODO 标注需要填写的位置。
//
// 如何编辑：
//   - 修改 systemPrompt / userPrompt 调整 AI 行为
//   - {{变量名}} 是运行时替换的占位符，不要改格式
//   - version 字段变更时，DiaryEntry.promptVersion 会记录
//     以便日后追踪 prompt 迭代对生成质量的影响
//
// 变量说明见每个模板的 availableVars 字段
// ============================================================

export const AI_PROMPT_TEMPLATES = {

  // ── 宠物日记 ────────────────────────────────────────────────────────────
  diary: {
    version: 'v1.0',
    availableVars: [
      '{{petName}}',          // 宠物昵称
      '{{petSpecies}}',       // 宠物种类
      '{{petPersonality}}',   // 性格描述
      '{{intimacy}}',         // 亲密度 0-100
      '{{trainerName}}',      // 训练师名字
      '{{date}}',             // 日期（中文格式）
      '{{feedCount}}',        // 今日喂食次数
      '{{playCount}}',        // 今日玩耍次数
      '{{patCount}}',         // 今日抚摸次数
      '{{eventsTriggered}}',  // 今日触发的事件名称列表
      '{{itemsUsed}}',        // 今日使用的道具
      '{{moodPeak}}',         // 今日最高情绪标签
      '{{statAtEnd}}',        // 今日结束时的状态值
      '{{ragMemories}}',      // RAG 检索到的相关记忆片段（3条以内）
    ],
    systemPrompt: `TODO`,
    // TODO: 参考 DESIGN.md 第八节的设计要求填写
    // 关键约束：第一人称宠物视角、性格影响语气、亲密度影响称呼、150-250字、禁止套话开头

    userPrompt: `TODO`,
    // TODO: 把 availableVars 里的变量组织成清晰的上下文传给 AI
  },

  // ── 宠物对话 ────────────────────────────────────────────────────────────
  petChat: {
    version: 'v1.0',
    availableVars: [
      '{{petName}}', '{{petSpecies}}', '{{petPersonality}}',
      '{{hunger}}', '{{mood}}', '{{intimacy}}', '{{energy}}',
      '{{trainerName}}',
      '{{chatHistory}}',      // 最近 20 条对话历史（已格式化）
      '{{ragMemories}}',      // RAG 检索到的相关记忆
      '{{relevantCollectibles}}',  // 当前小屋中的相关收藏品名称
    ],
    systemPrompt: `TODO`,
    // TODO: 关键约束：只说音节（亲密度>60可偶尔说人话）、通过动作表达情绪
    // 不直接说"我饿了"，用括号标注动作描述

    userPrompt: `TODO`,
  },

  // ── 训练师对话 ──────────────────────────────────────────────────────────
  trainerChat: {
    version: 'v1.0',
    availableVars: [
      '{{petName}}', '{{petSpecies}}', '{{petStats}}',
      '{{experience}}', '{{evolutionThreshold}}',
      '{{trainerName}}', '{{loginStreak}}',
      '{{recentEvents}}',
      '{{chatHistory}}',      // 最近 10 条训练师对话历史
    ],
    systemPrompt: `TODO`,
    // TODO: 训练师角色设定、给出具体数据驱动的建议、偶尔分享宝可梦知识

    userPrompt: `TODO`,
  },

  // ── 动态事件生成 ────────────────────────────────────────────────────────
  eventGenerate: {
    version: 'v1.0',
    availableVars: [
      '{{petName}}', '{{petSpecies}}', '{{petPersonality}}',
      '{{petStats}}',
      '{{season}}', '{{timeOfDay}}', '{{dayOfWeek}}',
      '{{recentEventIds}}',   // 避免重复的近期事件 id 列表
    ],
    systemPrompt: `TODO`,
    userPrompt: `TODO`,
    // TODO: 必须输出严格 JSON 格式（title/body/choices[]/itemDrop）
    // 格式错误时前端 fallback 到静态事件
    outputFormat: {
      title: 'string（8字以内）',
      body: 'string（60-100字）',
      choices: [
        {
          label: 'string（10字以内）',
          effect: { mood: 'number', energy: 'number', intimacy: 'number', expGain: 'number' },
          outcomeText: 'string（20-30字）',
        },
      ],
      itemDrop: 'collectible_template_id | null',
    },
  },

  // ── 收藏品生成 ──────────────────────────────────────────────────────────
  collectibleGenerate: {
    version: 'v1.0',
    availableVars: [
      '{{petName}}', '{{petSpecies}}', '{{petPersonality}}',
      '{{templateId}}',       // collectible-templates.js 中的模板 id
      '{{promptHint}}',       // 模板中定义的 promptHint
      '{{sourceContext}}',    // 来源背景（事件描述 / 探索方向等）
      '{{rarity}}',           // 目标稀有度
    ],
    systemPrompt: `TODO`,
    userPrompt: `TODO`,
    outputFormat: {
      name: 'string（10字以内）',
      description: 'string（40-80字，有故事感，独特）',
    },
  },

  // ── 探索报告 ────────────────────────────────────────────────────────────
  explorationReport: {
    version: 'v1.0',
    availableVars: [
      '{{petName}}', '{{petSpecies}}', '{{petPersonality}}',
      '{{direction}}',        // 探索方向（forest/town/beach）
      '{{directionLabel}}',   // 中文方向名称
      '{{durationMinutes}}',  // 探索时长（分钟）
      '{{itemName}}',         // 带回来的物品名称（已由系统决定）
      '{{promptHint}}',       // exploration-templates.js 中的 promptHint
    ],
    systemPrompt: `TODO`,
    userPrompt: `TODO`,
    outputFormat: {
      story: 'string（探索经历，60-100字）',
      itemStory: 'string（物品来源故事，30-60字）',
    },
  },

  // ── 聚会对话 ────────────────────────────────────────────────────────────
  gatheringDialogue: {
    version: 'v1.0',
    availableVars: [
      '{{petName}}', '{{petSpecies}}', '{{petPersonality}}', '{{petStats}}',
      '{{friendName}}', '{{friendSpecies}}', '{{friendPersonality}}',
      '{{sceneId}}',          // gathering-scripts.js 中的场景 id
      '{{topicSeeds}}',       // 场景的话题种子
      '{{relevantCollectibles}}',  // 当前小屋相关收藏品
      '{{ragMemories}}',      // RAG 检索到的相关记忆
      '{{dialogueTurns}}',    // 目标对话轮数
    ],
    systemPrompt: `TODO`,
    userPrompt: `TODO`,
    outputFormat: `[{"speaker":"宠物名","text":"台词"},...]`,
  },

  // ── 每日签到 AI 奖励文案 ────────────────────────────────────────────────
  dailyRewardCollectible: {
    version: 'v1.0',
    availableVars: [
      '{{petName}}', '{{petSpecies}}', '{{petPersonality}}',
      '{{templateId}}', '{{promptHint}}',
      '{{season}}', '{{loginStreak}}',
    ],
    systemPrompt: `TODO`,
    userPrompt: `TODO`,
    outputFormat: {
      name: 'string（10字以内）',
      description: 'string（30-60字，轻松有趣）',
    },
  },

  // ── 宠物催促通知文案 ────────────────────────────────────────────────────
  urgentNotification: {
    version: 'v1.0',
    availableVars: [
      '{{petName}}', '{{petSpecies}}', '{{petPersonality}}',
      '{{urgentStat}}',       // 哪个状态危急（hunger/mood/energy）
      '{{statValue}}',        // 当前数值
    ],
    systemPrompt: `TODO`,
    userPrompt: `TODO`,
    outputFormat: {
      text: 'string（1-2句，宠物语气，不超过30字）',
    },
  },
};
