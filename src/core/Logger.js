// ============================================================
// Logger — 分级日志
// 生产环境将 Config.LOG_LEVEL 设为 'warn' 或 'none' 即可静默
// ============================================================

import Config from './Config.js';

const LEVELS = { debug: 0, info: 1, warn: 2, error: 3, none: 99 };

function shouldLog(level) {
  return (LEVELS[level] ?? 0) >= (LEVELS[Config.LOG_LEVEL] ?? 0);
}

function fmt(level, module, msg, ...args) {
  const prefix = `[${level.toUpperCase()}][${module}]`;
  return [prefix, msg, ...args];
}

const Logger = {
  debug: (module, msg, ...args) => { if (shouldLog('debug')) console.debug(...fmt('debug', module, msg, ...args)); },
  info:  (module, msg, ...args) => { if (shouldLog('info'))  console.info(...fmt('info',  module, msg, ...args)); },
  warn:  (module, msg, ...args) => { if (shouldLog('warn'))  console.warn(...fmt('warn',  module, msg, ...args)); },
  error: (module, msg, ...args) => { if (shouldLog('error')) console.error(...fmt('error', module, msg, ...args)); },
};

export default Logger;
