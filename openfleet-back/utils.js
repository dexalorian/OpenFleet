export function randomString(length = 12) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_!$&%?';
    return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  }