import { LRUCache } from 'lru-cache';


// 初始化 LRU 缓存
const options = {
  max: 500, // 缓存项的最大数量
  ttl: 1000 * 60 * 5, // 缓存项的生存时间（5分钟）
};

export const cache = new LRUCache<string, any>(options);

/**
 * 
 * @param key cache key
 * @param fn function to refresh cache value
 * @returns 
 */
export function withCache<T>(key: string, fn: () => Promise<T>): Promise<T>
export function withCache<T>(key: string, fn: () => T): T {
  const cachedValue = cache.get(key);
  if (cachedValue) {
    console.log(`cache hit: ${key}`);
    return cachedValue;
  } else {
    const value = fn();
    if (value instanceof Promise) {
      value.then((v) => cache.set(key, v));
      return value;
    }
    cache.set(key, value);
    return value;
  }
}
