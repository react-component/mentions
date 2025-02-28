// Mock empty ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

window.HTMLElement.prototype.scrollIntoView = jest.fn();
