// ============================================================
// Pet 数据模型
// ============================================================

import { nanoid } from '../core/nanoid.js';

/**
 * 创建新宠物
 * @param {object} opts
 * @param {string} opts.speciesId        - 对应 pokemonOutcomes.js 中的 id
 * @param {string} opts.nickname
 * @param {object} opts.attributeWeights - 孵化问答树累计权重
 * @param {string} opts.personalityTrait - 'curious'|'lazy'|'energetic'|'timid'|'proud'
 * @returns {Pet}
 */
export function createPet({ speciesId, nickname, attributeWeights, personalityTrait = 'curious' }) {
  const now = Date.now();
  return {
    id: `pet_${nanoid()}`,
    speciesId,
    nickname,
    evolutionStage: 1,

    attributeWeights: {
      fire: 0, water: 0, grass: 0, electric: 0,
      psychic: 0, ghost: 0, fighting: 0, dragon: 0,
      ...attributeWeights,
    },

    stats: {
      hunger:   80,
      mood:     70,
      intimacy: 10,
      energy:   80,
    },

    experience: 0,
    evolutionThresholds: [100, 400],  // 可由 pokemonOutcomes 覆盖

    bornAt:          now,
    lastInteractAt:  now,
    lastFedAt:       now,

    personality: buildPersonality(personalityTrait),

    unlockedActions: ['feed', 'play', 'pat'],

    dailySummary: buildDailySummary(),
  };
}

export function buildPersonality(trait) {
  const PROFILES = {
    curious:   { trait: 'curious',   moodBias: 1.0, energyBias: 1.0, description: '好奇心旺盛，喜欢探索新事物，有时会对细节出神' },
    lazy:      { trait: 'lazy',      moodBias: 0.8, energyBias: 0.7, description: '慵懒散漫，但内心细腻，被照顾好了会悄悄依赖你' },
    energetic: { trait: 'energetic', moodBias: 1.2, energyBias: 1.4, description: '精力充沛，停不下来，玩耍是它最快乐的事' },
    timid:     { trait: 'timid',     moodBias: 0.9, energyBias: 0.9, description: '胆子小，需要时间建立信任，但一旦信任就非常黏人' },
    proud:     { trait: 'proud',     moodBias: 1.1, energyBias: 1.1, description: '傲娇，不轻易表现感情，但暗地里很在乎训练师' },
  };
  return PROFILES[trait] ?? PROFILES.curious;
}

export function buildDailySummary(date = todayStr()) {
  return {
    date,
    feedCount:        0,
    playCount:        0,
    patCount:         0,
    eventsTriggered:  [],
    statChanges:      { hunger: 0, mood: 0, intimacy: 0, energy: 0 },
    itemsUsed:        [],
    moodPeak:         'normal',
  };
}

export function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

/**
 * 校验 Pet 对象完整性（存档加载时使用）
 * 对缺失字段补默认值，而不是拒绝
 */
export function validatePet(pet) {
  if (!pet || !pet.id) throw new Error('Invalid pet: missing id');
  // 补全可能缺失的字段（旧存档兼容）
  pet.stats       ??= { hunger: 50, mood: 50, intimacy: 10, energy: 50 };
  pet.personality ??= buildPersonality('curious');
  pet.dailySummary ??= buildDailySummary();
  pet.unlockedActions ??= ['feed', 'play', 'pat'];
  return pet;
}
