// ============================================
// UTILITIES - Shared helpers across stages
// ============================================
(function initAppUtils(global) {
  function formatCurrency(value) {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(Number.isFinite(value) ? value : 0);
  }

  function formatPercent(value) {
    if (!Number.isFinite(value)) {
      return '0%';
    }
    return `${Math.round(value * 100)}%`;
  }

  function getInputValue(element) {
    const parsed = parseFloat(element?.value);
    if (Number.isNaN(parsed)) {
      return 0;
    }
    return Math.max(0, parsed);
  }

  function createDebouncedFunction(callback, delay = 200) {
    let timeoutId;
    return (...args) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        timeoutId = null;
        callback(...args);
      }, delay);
    };
  }

  function getNow() {
    if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
      return performance.now();
    }
    return Date.now();
  }

  const AppUtils = {
    formatCurrency,
    formatPercent,
    getInputValue,
    createDebouncedFunction,
    getNow
  };

  global.AppUtils = AppUtils;
  global.formatCurrency = formatCurrency;
  global.formatPercent = formatPercent;
  global.getInputValue = getInputValue;
  global.createDebouncedFunction = createDebouncedFunction;
  global.getNow = getNow;
})(window);
