// ============================================================
// StorageAdapter — 抽象接口定义
// 所有实现必须继承此类并实现全部方法
// Key 命名规范："peg:{type}:{id}"
//   peg:pet:uuid / peg:diary:petId / peg:inventory:playerId
// ============================================================

export class StorageAdapter {
  /**
   * 读取单个实体
   * @param {string} key
   * @returns {Promise<object|null>}
   */
  async get(key) { throw new Error('Not implemented'); }

  /**
   * 写入单个实体（全量覆盖）
   * @param {string} key
   * @param {object} value
   * @returns {Promise<void>}
   */
  async set(key, value) { throw new Error('Not implemented'); }

  /**
   * 删除单个实体
   * @param {string} key
   * @returns {Promise<void>}
   */
  async remove(key) { throw new Error('Not implemented'); }

  /**
   * 批量读取
   * @param {string[]} keys
   * @returns {Promise<Map<string, object|null>>}
   */
  async getMany(keys) { throw new Error('Not implemented'); }

  /**
   * 批量写入
   * @param {Map<string, object>} entries
   * @returns {Promise<void>}
   */
  async setMany(entries) { throw new Error('Not implemented'); }

  /**
   * 按前缀列出所有键
   * @param {string} prefix
   * @returns {Promise<string[]>}
   */
  async listKeys(prefix) { throw new Error('Not implemented'); }

  /**
   * 清空指定命名空间
   * @param {string} namespace  例："peg"
   * @returns {Promise<void>}
   */
  async clearNamespace(namespace) { throw new Error('Not implemented'); }

  /**
   * 可用性检测
   * @returns {Promise<{ available: boolean, reason?: string }>}
   */
  async healthCheck() { throw new Error('Not implemented'); }

  /**
   * 导出全部数据（备份/跨设备迁移）
   * @returns {Promise<string>}  JSON 字符串
   */
  async exportAll() { throw new Error('Not implemented'); }

  /**
   * 从 JSON 字符串恢复数据（覆盖现有）
   * @param {string} jsonString
   * @returns {Promise<{ imported: number, failed: number }>}
   */
  async importAll(jsonString) { throw new Error('Not implemented'); }
}
