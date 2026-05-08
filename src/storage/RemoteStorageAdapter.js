// ============================================================
// RemoteStorageAdapter — REST API 实现
// 对应后端接口（FastAPI /api/v1/save/）：
//   GET    /api/v1/save/{playerId}           拉取全量存档
//   PUT    /api/v1/save/{playerId}           覆盖写入全量存档
//   PATCH  /api/v1/save/{playerId}/{key}     单键更新
//   DELETE /api/v1/save/{playerId}           重置存档
//   GET    /api/health                       健康检查
//
// Phase 5 时将 Config.STORAGE_BACKEND 改为 'remote' 即可激活
// ============================================================

import { StorageAdapter } from './StorageAdapter.js';
import Logger from '../core/Logger.js';

const MODULE = 'RemoteStorageAdapter';

export class RemoteStorageAdapter extends StorageAdapter {
  /**
   * @param {string} baseUrl  例："https://yourdomain.com"
   */
  constructor(baseUrl) {
    super();
    this._baseUrl = baseUrl.replace(/\/$/, '');
    this._token = null;
    // 全量存档缓存（避免每次 get 都请求服务器）
    this._cache = null;
    this._playerId = null;
  }

  /** 由登录成功后调用，注入 JWT token 和 playerId */
  setAuth(token, playerId) {
    this._token = token;
    this._playerId = playerId;
    this._cache = null;
  }

  _headers() {
    return {
      'Content-Type': 'application/json',
      ...(this._token ? { Authorization: `Bearer ${this._token}` } : {}),
    };
  }

  async _fetch(method, path, body) {
    const res = await fetch(`${this._baseUrl}${path}`, {
      method,
      headers: this._headers(),
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    });
    if (!res.ok) {
      const text = await res.text();
      Logger.error(MODULE, `${method} ${path} → ${res.status}`, text);
      throw new Error(`HTTP ${res.status}`);
    }
    return res.status === 204 ? null : res.json();
  }

  /** 懒加载全量存档到本地缓存 */
  async _ensureCache() {
    if (this._cache) return;
    if (!this._playerId) throw new Error('RemoteStorageAdapter: not authenticated');
    const result = await this._fetch('GET', `/api/v1/save/${this._playerId}`);
    this._cache = result?.data ?? {};
  }

  async get(key) {
    await this._ensureCache();
    return this._cache[key] ?? null;
  }

  async set(key, value) {
    await this._ensureCache();
    this._cache[key] = value;
    // 单键 PATCH 到服务器
    await this._fetch('PATCH', `/api/v1/save/${this._playerId}/${encodeURIComponent(key)}`, { value });
  }

  async remove(key) {
    await this._ensureCache();
    delete this._cache[key];
    await this._fetch('PATCH', `/api/v1/save/${this._playerId}/${encodeURIComponent(key)}`, { value: null });
  }

  async getMany(keys) {
    await this._ensureCache();
    const result = new Map();
    for (const key of keys) {
      result.set(key, this._cache[key] ?? null);
    }
    return result;
  }

  async setMany(entries) {
    await this._ensureCache();
    for (const [key, value] of entries) {
      this._cache[key] = value;
    }
    // 批量变更用全量 PUT
    await this._fetch('PUT', `/api/v1/save/${this._playerId}`, { data: this._cache });
  }

  async listKeys(prefix) {
    await this._ensureCache();
    return Object.keys(this._cache).filter(k => k.startsWith(prefix));
  }

  async clearNamespace(namespace) {
    await this._fetch('DELETE', `/api/v1/save/${this._playerId}`);
    this._cache = {};
  }

  async healthCheck() {
    try {
      await this._fetch('GET', '/api/health');
      return { available: true };
    } catch (e) {
      return { available: false, reason: e.message };
    }
  }

  async exportAll() {
    await this._ensureCache();
    return JSON.stringify({ _exportedAt: Date.now(), entries: this._cache });
  }

  async importAll(jsonString) {
    const { entries } = JSON.parse(jsonString);
    await this._fetch('PUT', `/api/v1/save/${this._playerId}`, { data: entries });
    this._cache = entries;
    return { imported: Object.keys(entries).length, failed: 0 };
  }
}
