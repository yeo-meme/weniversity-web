import type { LocalProgressCache, LocalChapterCache } from '../types/progress.types';

// 🔥 키 통일
const LOCAL_CACHE_KEY = 'local_progress_cache';

export type SimpleProgressCache = LocalProgressCache;

export const loadCache = (): SimpleProgressCache => {
  console.log("📦 [DEBUG] loadCache 호출");
  
  try {
    const stored = localStorage.getItem(LOCAL_CACHE_KEY);
    console.log("📦 [DEBUG] localStorage에서 가져온 원본:", stored);
    console.log("📦 [DEBUG] 사용한 키:", LOCAL_CACHE_KEY);
    
    if (stored) {
      const parsed = JSON.parse(stored);
      console.log("📦 [DEBUG] 파싱된 데이터:", parsed);
      return parsed;
    } else {
      console.log("📦 [DEBUG] localStorage에 데이터 없음");
      return {};
    }
  } catch (error) {
    console.error("❌ [DEBUG] loadCache 에러:", error);
    return {};
  }
};

export function updateCache(cache: SimpleProgressCache): void {
  console.log("💾 [DEBUG] updateCache 호출");
  console.log("💾 [DEBUG] 저장할 데이터:", cache);
  console.log("💾 [DEBUG] 사용할 키:", LOCAL_CACHE_KEY);
  
  try {
    localStorage.setItem(LOCAL_CACHE_KEY, JSON.stringify(cache));
    console.log("💾 [DEBUG] localStorage 저장 완료");
  } catch (e) {
    console.error('❌ [DEBUG] 로컬 캐시 저장 실패', e);
  }
}