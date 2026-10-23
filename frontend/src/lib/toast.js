// Minimal toast utility (no external dep)
export function toast(message, type = 'info') {
  const el = document.createElement('div');
  const colors = {
    success: '#10b981',
    error: '#ef4444',
    info: '#0d9488',
    warning: '#f59e0b',
  };
  el.style.cssText = `
    position: fixed; bottom: 24px; right: 24px; z-index: 9999;
    padding: 12px 20px; border-radius: 12px;
    background: ${colors[type] || colors.info}; color: white;
    font-size: 14px; font-weight: 500; font-family: system-ui, sans-serif;
    box-shadow: 0 8px 24px rgba(0,0,0,0.2);
    animation: slideIn 0.3s ease forwards;
    max-width: 320px;
  `;
  el.textContent = message;
  document.body.appendChild(el);
  setTimeout(() => {
    el.style.opacity = '0';
    el.style.transition = 'opacity 0.3s ease';
    setTimeout(() => el.remove(), 300);
  }, 3000);
}
