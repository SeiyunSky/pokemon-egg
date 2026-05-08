// ============================================================
// EventBus — 全局发布/订阅事件总线
// 命名规范："{namespace}:{event}"
//   action:feed / state:petUpdated / pet:evolution / time:tick
// ============================================================

class EventBus {
  constructor() {
    this._listeners = new Map(); // eventName → Set<handler>
  }

  /**
   * 订阅事件
   * @param {string} event
   * @param {Function} handler
   * @returns {Function} unsubscribe 函数
   */
  on(event, handler) {
    if (!this._listeners.has(event)) {
      this._listeners.set(event, new Set());
    }
    this._listeners.get(event).add(handler);
    return () => this.off(event, handler);
  }

  /**
   * 订阅一次（触发后自动取消）
   */
  once(event, handler) {
    const wrapper = (payload) => {
      handler(payload);
      this.off(event, wrapper);
    };
    return this.on(event, wrapper);
  }

  /**
   * 取消订阅
   */
  off(event, handler) {
    this._listeners.get(event)?.delete(handler);
  }

  /**
   * 发布事件
   * @param {string} event
   * @param {*} payload
   */
  emit(event, payload) {
    this._listeners.get(event)?.forEach(handler => {
      try {
        handler(payload);
      } catch (e) {
        console.error(`[EventBus] handler error on "${event}":`, e);
      }
    });
  }

  /**
   * 清除某事件的全部监听（调试用）
   */
  clear(event) {
    this._listeners.delete(event);
  }
}

export default new EventBus();
