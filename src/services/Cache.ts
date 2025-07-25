import { head, put } from '@vercel/blob';
import { LRUCache } from 'lru-cache';

// 初始化 LRU 缓存
const options = {
  max: 500, // 缓存项的最大数量
  ttl: 1000 * 60 * 5, // 缓存项的生存时间（5分钟）
};

export const cache = new LRUCache<string, any>(options);

export async function withBlobCache<T extends Buffer>(
  key: string,
  fn: () => Promise<T>,
): Promise<T> {
  try {
    // Check if blob exists first
    const blobUrl = (await head(key).catch(() => null))?.downloadUrl;

    if (blobUrl) {
      const startTime = performance.now();
      const response = await fetch(blobUrl);

      if (response.ok) {
        const data = await response.arrayBuffer();
        const endTime = performance.now();
        console.log(
          `Blob cache hit: ${key}. Downloaded from blob in ${
            endTime - startTime
          }ms.`,
        );
        return Buffer.from(data) as T;
      }
    }
  } catch (error) {
    // Ignore fetch errors and proceed to generate the value
    console.warn(`Blob cache fetch failed for key ${key}:`, error);
  }

  // If blob does not exist or fetch failed, fetch from original source
  const startTime = performance.now();
  const value = await fn();
  const endTime = performance.now();
  console.log(
    `Fetched from original source for key ${key} in ${endTime - startTime}ms.`,
  );

  try {
    await put(key, value, {
      access: 'public',
      addRandomSuffix: false,
      allowOverwrite: false, // Explicitly prevent overwriting
    });
  } catch (error) {
    // This error is now expected if another request created the blob in the meantime.
    // It can be safely ignored in a race condition scenario.
    if (
      error instanceof Error &&
      error.message.includes('This blob already exists')
    ) {
      console.log(
        `Blob already stored for key ${key}, likely by a concurrent request.`,
      );
    } else {
      console.error(`Failed to store blob cache for key ${key}:`, error);
    }
  }

  return value;
}

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
    console.log(`cache size: ${cache.size}, cache hit: ${key}`);
    return cachedValue;
  } else {
    console.log(`cache size: ${cache.size}, cache miss: ${key}`)
    const value = fn();
    if (value instanceof Promise) {
      value.then((v) => cache.set(key, v));
      return value;
    }
    cache.set(key, value);
    return value;
  }
}
