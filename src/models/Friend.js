// ============================================================
// Friend 数据模型 — 宠物的 NPC 伙伴关系记录
// ============================================================

import { nanoid } from '../core/nanoid.js';

/**
 * @param {object} opts
 * @param {string} opts.petId
 * @param {string} opts.npcTemplateId   - 对应 friends.js 静态模板
 * @param {object} opts.template        - 从静态模板冗余存储一份（防模板变更破坏旧存档）
 */
export function createFriend({ petId, npcTemplateId, template }) {
  const now = Date.now();
  return {
    id: `friend_${nanoid()}`,
    petId,
    npcTemplateId,
    nickname:        template.defaultNickname,
    species:         template.species,
    personality:     template.personality,
    avatarCssClass:  template.avatarCssClass,
    spriteUrl:       template.spriteUrl ?? null,

    intimacy:        0,
    visitFrequency:  template.defaultVisitFrequency ?? 'medium',
    lastVisitAt:     null,
    nextVisitAt:     now + msUntilNextVisit('medium'),
    visitCount:      0,

    unlockedAt:      now,
    isActive:        true,
  };
}

/** 计算下次来访间隔（毫秒） */
export function msUntilNextVisit(frequency) {
  const INTERVALS = {
    low:    48 * 3600_000,
    medium: 24 * 3600_000,
    high:   12 * 3600_000,
  };
  const base = INTERVALS[frequency] ?? INTERVALS.medium;
  // ±2小时随机窗口
  const jitter = (Math.random() * 2 - 1) * 2 * 3600_000;
  return base + jitter;
}
