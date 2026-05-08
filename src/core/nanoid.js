// ============================================================
// nanoid — 轻量 ID 生成（无依赖，纯浏览器环境）
// 生成 21 字符的 URL-safe 随机字符串
// ============================================================

const ALPHABET = 'useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict';

export function nanoid(size = 12) {
  const bytes = crypto.getRandomValues(new Uint8Array(size));
  return Array.from(bytes, b => ALPHABET[b & 63]).join('');
}
