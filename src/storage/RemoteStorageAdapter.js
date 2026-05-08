// ============================================================
// RemoteStorageAdapter — REST API 实现骨架（占位）
// 对应 Python FastAPI 后端接口：
//   GET    /api/save/{playerId}
//   PUT    /api/save/{playerId}
//   PATCH  /api/save/{playerId}/{key}
//   DELETE /api/save/{playerId}
//   GET    /api/health
// ============================================================

import { StorageAdapter } from './StorageAdapter.js';
import Logger from '../core/Logger.js';

const MODULE = 'RemoteStorageAdapter';

export class RemoteStorageAdapter extends StorageAdapter {
  /**
   * @param {string} baseUrl  例："https://api.yourdomain.com"
   */
  constructor(baseUrl) {
    super();
    this._baseUrl = baseUrl.replace(/\/$/, '');
    this._token = null;   // 登录后由 AuthService 注入
  }

  /** 由 AuthService 调用，注入 JWT token */
  setToken(token) {
    this._token = token;
  }

  _headers() {
    return {
      'Content-Type': 'application/json',
      ...(this._token ? { Authorization: `Bearer ${this._token}` } : {}),
    };
  }

  async _request(method, path, body) {
    const res = await fetch(`${this._baseUrl}${path}`, {
      method,
      headers: this._headers(),
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    });
    if (!res.ok) {
      const text = await res.text();
      Logger.error(MODULE, `${method} ${path} → ${res.status}`, text);
      throw new Error(`HTTP ${res.status}: ${text}`);
    }
    return res.status === 204 ? null : res.json();
  }

  // TODO: 以下方法在接入后端时实现，目前抛出明确错误提示

  async get(key) {
    throw new Error('[RemoteStorageAdapter] Not yet implemented. Use LocalStorageAdapter.');
  }

  async set(key, value) {
    throw new Error('[RemoteStorageAdapter] Not yet implemented.');
  }

  async remove(key) {
    throw new Error('[RemoteStorageAdapter] Not yet implemented.');
  }

  async getMany(keys) {
    throw new Error('[RemoteStorageAdapter] Not yet implemented.');
  }

  async setMany(entries) {
    throw new Error('[RemoteStorageAdapter] Not yet implemented.');
  }

  async listKeys(prefix) {
    throw new Error('[RemoteStorageAdapter] Not yet implemented.');
  }

  async clearNamespace(namespace) {
    throw new Error('[RemoteStorageAdapter] Not yet implemented.');
  }

  async healthCheck() {
    try {
      await this._request('GET', '/api/health');
      return { available: true };
    } catch (e) {
      return { available: false, reason: e.message };
    }
  }

  async exportAll() {
    throw new Error('[RemoteStorageAdapter] Not yet implemented.');
  }

  async importAll(jsonString) {
    throw new Error('[RemoteStorageAdapter] Not yet implemented.');
  }
}
