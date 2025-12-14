class EventEmitter {
  constructor() {
    this.listeners = new Map();
  }

  on(event, listener) {
    const existing = this.listeners.get(event) || [];
    this.listeners.set(event, [...existing, listener]);
    return this;
  }

  off(event, listener) {
    const existing = this.listeners.get(event) || [];
    this.listeners.set(
      event,
      existing.filter((l) => l !== listener),
    );
    return this;
  }

  emit(event, ...args) {
    const existing = this.listeners.get(event) || [];
    existing.forEach((listener) => listener(...args));
    return existing.length > 0;
  }

  removeAllListeners(event) {
    if (event) {
      this.listeners.delete(event);
    } else {
      this.listeners.clear();
    }
    return this;
  }
}

module.exports = EventEmitter;
module.exports.EventEmitter = EventEmitter;
