// ============================================================
// PlayerProfile 数据模型
// ============================================================

import { nanoid } from '../core/nanoid.js';

export function createPlayerProfile({ trainerName }) {
  const now = Date.now();
  return {
    id: `player_${nanoid()}`,
    trainerName,
    createdAt:   now,
    lastLoginAt: now,

    loginStreak: 1,
    totalDays:   1,

    stats: {
      totalInteractions:  0,
      evolutionsWitnessed: 0,
      eventsCompleted:    0,
      diariesGenerated:   0,
    },

    unlockedFeatures: [],  // 'diary' | 'friend_visit' | 'trainer_chat'

    // 最近 20 条宠物对话历史（超出时丢弃最旧）
    chatHistory: [],

    settings: {
      llmApiKey:            '',
      llmModel:             'gpt-4o-mini',
      llmEndpoint:          'https://api.openai.com/v1',
      soundEnabled:         true,
      notificationsEnabled: true,
      language:             'zh-CN',
    },
  };
}

export function validatePlayerProfile(profile) {
  if (!profile?.id) throw new Error('Invalid profile: missing id');
  profile.settings ??= {};
  profile.chatHistory ??= [];
  profile.unlockedFeatures ??= [];
  return profile;
}
