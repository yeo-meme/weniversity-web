import type { ProgressCacheEntry } from '../types/progress.types';

const STORAGE_KEY = 'cachedProgress';

export type LocalProgressCache = Record<number, ProgressCacheEntry>;

export function loadCache(): LocalProgressCache {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('로컬 캐시 불러오기 실패', e);
  }
  return {};
}

export function updateCache(cache: LocalProgressCache) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
  } catch (e) {
    console.error('로컬 캐시 저장 실패', e);
  }
}