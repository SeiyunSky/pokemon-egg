// ============================================================
// shop.js — 随机商店配置
//
// 玩法：商店每天/每周刷新一批商品，玩家用游戏内货币购买。
//       货币来源：日常互动、完成事件、连续登录奖励。
//       商品池随宠物成长解锁更多内容。
//
// 随机刷新机制：
//   每次刷新从各 pool 中按权重随机抽取 N 件商品上架。
//   同一件商品不会连续两次出现在商店里。
//
// 如何编辑：
//   修改 refreshSchedule 调整刷新频率。
//   修改各 pool 的 weight 调整出现概率。
//   enabled: false 可以临时下架某件商品。
// ============================================================

// ── 商店刷新配置 ──────────────────────────────────────────────────────────
export const SHOP_CONFIG = {
  refreshSchedule: 'daily',         // 'daily' | 'weekly' | 'bidaily'
  refreshHour: 6,                    // 每天几点刷新（本地时间）TODO: 调整
  slotsPerRefresh: 6,               // 每次上架几件商品 TODO: 调整
  currency: 'poke_coin',            // 货币 id（对应 items.js 中的货币定义）
  notifyOnRefresh: true,            // 刷新时是否通知玩家
};

// ── 常规商品池 ────────────────────────────────────────────────────────────
// 基础道具，随时可能出现
export const SHOP_POOL_REGULAR = [

  {
    id: 'shop_berry_normal',
    enabled: true,
    itemId: 'berry_normal',
    quantity: 3,
    price: 10,                        // TODO: 调整价格
    weight: 40,
    // TODO: 填入商品展示文案（一句俏皮的介绍）
    shopDescription: 'TODO',
  },

  {
    id: 'shop_berry_spicy',
    enabled: true,
    itemId: 'berry_spicy',
    quantity: 2,
    price: 18,
    weight: 25,
    shopDescription: 'TODO',
  },

  {
    id: 'shop_toy_ball',
    enabled: true,
    itemId: 'toy_ball',
    quantity: 1,
    price: 30,
    weight: 20,
    shopDescription: 'TODO',
  },

  // TODO: 随 items.js 内容补充，持续添加
];

// ── 稀有商品池 ────────────────────────────────────────────────────────────
// 出现概率低，价格高，效果特殊
export const SHOP_POOL_RARE = [

  {
    id: 'shop_mood_potion',
    enabled: true,
    itemId: 'potion_mood',
    quantity: 1,
    price: 80,                        // TODO: 调整
    weight: 10,
    shopDescription: 'TODO: 一瓶心情药水的俏皮介绍',
    unlockRequirement: {
      petIntimacy: 20,               // 亲密度达到后才有机会出现
    },
  },

  {
    id: 'shop_evolution_hint',
    enabled: true,
    itemId: 'evolution_hint_scroll',  // TODO: 确认 items.js 中有此道具
    quantity: 1,
    price: 150,
    weight: 5,
    shopDescription: 'TODO',
    unlockRequirement: {
      petEvolutionStage: 1,          // 进化到阶段1后才出现
    },
  },

  // TODO: 更多稀有商品
];

// ── 限定商品池 ────────────────────────────────────────────────────────────
// 节日或特殊条件下出现，限时销售
export const SHOP_POOL_LIMITED = [

  {
    id: 'shop_seasonal_spring_item',
    enabled: true,
    itemId: 'TODO: 填入春季限定道具 id',
    quantity: 1,
    price: 50,
    weight: 15,
    shopDescription: 'TODO',
    availableSeason: 'spring',        // 只在春季（3-5月）出现
    availableDays: null,              // null = 整个季节都可出现
  },

  // TODO: 夏季/秋季/冬季限定商品
  // TODO: 节日限定商品（春节、圣诞、万圣节）
];

// ── 信件订单商品（特殊机制）──────────────────────────────────────────────
// 好友偶尔通过信件发来"推荐商品"，点击信里的链接直接购买，不占商店槽位
export const FRIEND_RECOMMENDATION_ITEMS = [

  {
    id: 'wooper_recommends_mud',
    senderId: 'wooper',
    itemId: 'TODO: 乌波推荐的道具 id',
    price: 25,
    discountRate: 0.8,               // 好友推荐享8折
    promptHint: 'TODO: 乌波推荐这件东西时的说法',
  },

  // TODO: 其他好友的推荐商品
];
