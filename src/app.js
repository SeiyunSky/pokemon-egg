// ============================================================
// app.js — 应用启动入口
// 初始化顺序：Config → Logger → EventBus → StorageFactory → UIManager
// ============================================================

import Config from './core/Config.js';
import Logger from './core/Logger.js';
import EventBus from './core/EventBus.js';
import storage from './storage/StorageFactory.js';

const MODULE = 'app';

async function bootstrap() {
  Logger.info(MODULE, 'Bootstrapping Pokemon Egg Game...');

  // 1. 存储可用性检测
  const health = await storage.healthCheck();
  if (!health.available) {
    Logger.error(MODULE, 'Storage unavailable:', health.reason);
    // TODO: 显示友好的错误提示 UI
    return;
  }

  // 2. 暴露到 window（开发调试用，Phase 1 验收入口）
  if (Config.LOG_LEVEL === 'debug') {
    window.__peg = { storage, EventBus, Config };
    Logger.debug(MODULE, 'Debug mode: window.__peg exposed');
  }

  // 3. 后续 Phase 在此处依次初始化各 Service 和 UIManager
  // import GameStateService from './services/GameStateService.js';
  // import UIManager from './ui/UIManager.js';
  // await GameStateService.init();
  // UIManager.init();

  Logger.info(MODULE, 'Phase 1 ready. Open DevTools and try window.__peg.storage');
}

document.addEventListener('DOMContentLoaded', bootstrap);
