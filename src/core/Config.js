// ============================================================
// Config — 全局配置常量
// 修改这里的值即可调整游戏参数，无需改业务代码
// ============================================================

const Config = {

  // ── 存储后端 ──
  // 'local'  → LocalStorageAdapter（开发/离线）
  // 'remote' → RemoteStorageAdapter（生产，需配置 API_BASE_URL）
  STORAGE_BACKEND: 'local',
  API_BASE_URL: 'http://localhost:8000',  // Python FastAPI 地址

  // ── 状态衰减速率（每小时降低多少点，0-100 量纲）──
  DECAY_RATES: {
    hunger:   -2.0,
    mood:     -1.5,
    energy:   -1.0,
    intimacy: -0.1,   // 极缓，长期不互动才体现
  },

  // ── 互动效果值 ──
  INTERACTION_EFFECTS: {
    feed:  { hunger: +20, energy: +2,  mood: +5,  intimacy: +1, exp: +5  },
    play:  { hunger: -5,  energy: -10, mood: +20, intimacy: +3, exp: +10 },
    pat:   { hunger: 0,   energy: 0,   mood: +8,  intimacy: +2, exp: +3  },
    rest:  { hunger: -3,  energy: +25, mood: +5,  intimacy: +1, exp: +2  },
  },

  // ── 进化默认阈值（pokemonOutcomes.js 中可覆盖）──
  DEFAULT_EVOLUTION_THRESHOLDS: [100, 400],

  // ── 时间 ──
  TICK_INTERVAL_MS: 60_000,       // 运行时 tick 间隔（1分钟）
  OFFLINE_CAP_HOURS: 72,          // 最大离线补算时间（防止超长离线把状态归零）

  // ── 状态临界值（触发事件/UI 警告）──
  STAT_CRITICAL: {
    hunger: 20,
    mood:   20,
    energy: 15,
  },

  // ── LLM ──
  LLM_TIMEOUT_MS: 15_000,
  LLM_DEFAULT_MODEL: 'gpt-4o-mini',
  LLM_DEFAULT_ENDPOINT: 'https://api.openai.com/v1',

  // ── 日记 ──
  DIARY_GENERATE_HOUR: 21,        // 每天几点生成日记（本地时间）

  // ── 伙伴来访 ──
  FRIEND_VISIT_WINDOW_HOURS: 2,   // 来访时间随机窗口（±N小时）

  // ── 调试 ──
  LOG_LEVEL: 'debug',             // 'debug' | 'info' | 'warn' | 'error' | 'none'
};

export default Config;
