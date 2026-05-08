// ============================================================
// DiaryEntry 数据模型
// ============================================================

import { nanoid } from '../core/nanoid.js';

/**
 * @param {object} opts
 * @param {string} opts.petId
 * @param {string} opts.date            - YYYY-MM-DD
 * @param {string} opts.title
 * @param {string} opts.content
 * @param {'llm'|'fallback'} opts.generationMethod
 * @param {string} opts.llmModel
 * @param {object} opts.contextSnapshot - 生成时的快照，存档后不再依赖实时数据
 * @param {'warm'|'melancholy'|'excited'|'peaceful'} opts.mood
 */
export function createDiaryEntry({ petId, date, title, content, generationMethod, llmModel = '', contextSnapshot = {}, mood = 'peaceful' }) {
  return {
    id: `diary_${nanoid()}`,
    petId,
    date,
    generatedAt:      Date.now(),
    generationMethod,
    llmModel,
    promptVersion:    'v1.0',
    title,
    content,
    contextSnapshot,
    mood,
    isRead: false,
  };
}
