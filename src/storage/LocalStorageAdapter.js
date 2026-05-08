// ============================================================
// LocalStorageAdapter — 基于 localStorage 的完整实现
// ============================================================

import { StorageAdapter } from './StorageAdapter.js';
import Logger from '../core/Logger.js';

const MODULE = 'LocalStorageAdapter';
const SCHEMA_VERSION = 1;

export class LocalStorageAdapter extends StorageAdapter {

  _serialize(value) {
    return JSON.stringify({ _v: SCHEMA_VERSION, _t: Date.now(), data: value });
  }

  _deserialize(raw) {
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw);
      // 版本迁移钩子：未来 _v > 1 时在此做字段补全
      return parsed.data ?? parsed; // 兼容无版本标记的旧数据
    } catch (e) {
      Logger.warn(MODULE, 'Deserialize failed, raw:', raw);
      return null;
    }
  }

  async get(key) {
    return this._deserialize(localStorage.getItem(key));
  }

  async set(key, value) {
    try {
      localStorage.setItem(key, this._serialize(value));
    } catch (e) {
      Logger.error(MODULE, `set "${key}" failed:`, e);
      throw e;
    }
  }

  async remove(key) {
    localStorage.removeItem(key);
  }

  async getMany(keys) {
    const result = new Map();
    for (const key of keys) {
      result.set(key, this._deserialize(localStorage.getItem(key)));
    }
    return result;
  }

  async setMany(entries) {
    for (const [key, value] of entries) {
      await this.set(key, value);
    }
  }

  async listKeys(prefix) {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(prefix)) keys.push(key);
    }
    return keys;
  }

  async clearNamespace(namespace) {
    const keys = await this.listKeys(namespace);
    keys.forEach(k => localStorage.removeItem(k));
    Logger.info(MODULE, `Cleared ${keys.length} keys under "${namespace}"`);
  }

  async healthCheck() {
    try {
      const testKey = '__peg_hc__';
      localStorage.setItem(testKey, '1');
      localStorage.removeItem(testKey);
      return { available: true };
    } catch (e) {
      return { available: false, reason: e.name };
    }
  }

  async exportAll() {
    const keys = await this.listKeys('peg:');
    const entries = {};
    for (const key of keys) {
      entries[key] = this._deserialize(localStorage.getItem(key));
    }
    return JSON.stringify({ _exportedAt: Date.now(), _v: SCHEMA_VERSION, entries });
  }

  async importAll(jsonString) {
    let imported = 0, failed = 0;
    try {
      const { entries } = JSON.parse(jsonString);
      for (const [key, value] of Object.entries(entries)) {
        try {
          await this.set(key, value);
          imported++;
        } catch {
          failed++;
        }
      }
    } catch (e) {
      Logger.error(MODULE, 'importAll parse failed:', e);
      throw e;
    }
    Logger.info(MODULE, `importAll: ${imported} imported, ${failed} failed`);
    return { imported, failed };
  }
}
