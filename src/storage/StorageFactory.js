// ============================================================
// StorageFactory — 按 Config.STORAGE_BACKEND 导出适配器单例
// 切换后端只需改 Config.STORAGE_BACKEND，业务代码无需改动
// ============================================================

import Config from '../core/Config.js';
import { LocalStorageAdapter } from './LocalStorageAdapter.js';
import { RemoteStorageAdapter } from './RemoteStorageAdapter.js';

const adapter = Config.STORAGE_BACKEND === 'remote'
  ? new RemoteStorageAdapter(Config.API_BASE_URL)
  : new LocalStorageAdapter();

export default adapter;
