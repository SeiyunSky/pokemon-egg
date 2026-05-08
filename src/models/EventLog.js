// ============================================================
// EventLog 数据模型 — 单条游戏事件记录
// ============================================================

import { nanoid } from '../core/nanoid.js';

/**
 * @param {object} opts
 * @param {string} opts.petId
 * @param {'daily_event'|'friend_visit'|'evolution'|'interaction'|'system'} opts.type
 * @param {string} opts.eventTemplateId  - 静态模板 id，AI 生成时为 'ai_generated'
 * @param {string} opts.title
 * @param {string} opts.body
 * @param {Array}  opts.choices          - [{ label, effect, outcomeText }]
 * @param {boolean} opts.isAiGenerated
 */
export function createEventLog({ petId, type, eventTemplateId, title, body, choices = [], isAiGenerated = false }) {
  return {
    id: `evt_${nanoid()}`,
    petId,
    type,
    eventTemplateId,
    title,
    body,
    choices,           // 记录玩家选择后写入 chosen: true
    outcome: null,     // 选择后填充：{ statChanges, itemDrops, expGain }
    triggeredAt: Date.now(),
    resolvedAt:  null,
    isAiGenerated,
  };
}

export function resolveEvent(log, choiceIndex, outcome) {
  if (log.choices[choiceIndex]) {
    log.choices[choiceIndex].chosen = true;
  }
  log.outcome = outcome;
  log.resolvedAt = Date.now();
  return log;
}
