// ============================================================
// Inventory 数据模型
// ============================================================

export function createInventory(ownerId) {
  return {
    ownerId,
    updatedAt: Date.now(),
    // key = itemId, value = 数量
    slots: {
      berry_normal: 3,   // 新手初始道具
    },
    usageLog: [],
  };
}

/**
 * 增加道具（数量可为负数，用于消耗）
 * @returns {{ ok: boolean, reason?: string }}
 */
export function adjustItem(inventory, itemId, delta) {
  const current = inventory.slots[itemId] ?? 0;
  const next = current + delta;
  if (next < 0) return { ok: false, reason: 'insufficient' };
  inventory.slots[itemId] = next;
  inventory.updatedAt = Date.now();
  return { ok: true };
}

export function validateInventory(inv) {
  if (!inv?.ownerId) throw new Error('Invalid inventory: missing ownerId');
  inv.slots ??= {};
  inv.usageLog ??= [];
  return inv;
}
