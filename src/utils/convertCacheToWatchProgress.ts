import type {
  LocalChapterCache,
  WatchProgress,
  LocalProgressCache,
  LocalCourseCache,
  CourseProgressResponse
} from "../types/progress.types";

export function localChapterToWatchProgress(
  userId: string,
  courseId: number,
  chapterId: number,
  chapterIndex: number,
  localChapter: LocalChapterCache
): WatchProgress {
  const now = Date.now();

  return {
    id: `${userId}_${chapterId}`,
    userId,
    chapterId,
    courseId,
    videoId: chapterId,                    // chapterId와 동일
    chapterOrder: chapterIndex + 1,       // chapterIndex 기반
    videoOrder: chapterIndex + 1,         
    chapterIndex: chapterIndex,
    videoIndex: chapterIndex,
    currentTime: localChapter.currentTime,
    totalDuration: localChapter.totalDuration,
    watchedPercentage: localChapter.watchedPercentage || 0,
    isCompleted: localChapter.isCompleted || false,
    totalWatchTime: localChapter.currentTime,
    sessionCount: 1,
    watchSpeed: 1,
    firstWatchedAt: now,
    lastWatchedAt: now,
    completedAt: localChapter.isCompleted ? now : null,
    missionId: undefined,
    missionScore: undefined,
    missionPassed: undefined,
  };
}

// 🔧 WatchProgress를 로컬 챕터 캐시로 변환하는 함수
export function convertWatchProgressToCache(
  watchProgress: WatchProgress
): LocalChapterCache {
  return {
    currentTime: watchProgress.currentTime,
    totalDuration: watchProgress.totalDuration,
    watchedPercentage: watchProgress.watchedPercentage,
    isCompleted: watchProgress.isCompleted,
    lastUpdated: Date.now(),
    isDirty: false,
  };
}

// 서버에서받은 데이터 exit에서 변환 
export function convertServerDataToLocalCourseCache(serverData: CourseProgressResponse, courseId: number): LocalCourseCache {
  const localCourseCache: LocalCourseCache = {
    userId: serverData.userId,
    courseId,
    chapterOrder: serverData.chapters.map(ch => ch.chapterId),
    chapters: {},
  };

  serverData.chapters.forEach(chapter => {
    localCourseCache.chapters[chapter.chapterId] = convertWatchProgressToCache(chapter);
  });

  return localCourseCache;
}

// 🔧 로컬 캐시 전체를 WatchProgress 배열로 변환
export function convertCacheToWatchProgress(
  localCache: LocalProgressCache,
  videoMetadata: {
    [chapterId: number]: {
      videoId: number;
      chapterOrder: number;
      videoOrder: number;
      chapterIndex: number;
      videoIndex: number;
    };
  }
): WatchProgress[] {
  const result: WatchProgress[] = [];

  for (const userCourseKey in localCache) {
    const courseCache = localCache[userCourseKey];
    const { userId, courseId, chapters } = courseCache;

    for (const chapterIdStr in chapters) {
      const chapterId = Number(chapterIdStr);
      const localChapter = chapters[chapterId];
      const metadata = videoMetadata[chapterId];

      if (!metadata) {
        console.warn(`메타데이터를 찾을 수 없음: chapterId ${chapterId}`);
        continue;
      }

      const wp = localChapterToWatchProgress(
        userId,
        courseId,
        chapterId,
        metadata.videoId,
        metadata.chapterOrder,
        metadata.videoOrder,
        metadata.chapterIndex,
        metadata.videoIndex,
        localChapter
      );

      result.push(wp);
    }
  }

  return result;
}

// 🔧 서버 데이터와 로컬 캐시 병합
export function mergeServerDataWithLocalCache(
  serverData: WatchProgress[],
  localCache: LocalProgressCache,
  videoMetadata: {
    [chapterId: number]: {
      videoId: number;
      chapterOrder: number;
      videoOrder: number;
      chapterIndex: number;
      videoIndex: number;
    };
  }
): WatchProgress[] {
  const result: WatchProgress[] = [];

  for (const userCourseKey in localCache) {
    const courseCache = localCache[userCourseKey];
    const { userId, courseId, chapters } = courseCache;

    for (const chapterIdStr in chapters) {
      const chapterId = Number(chapterIdStr);
      const localChapter = chapters[chapterId];
      const metadata = videoMetadata[chapterId];

      if (!metadata) {
        console.warn(`메타데이터를 찾을 수 없음: chapterId ${chapterId}`);
        continue;
      }

      // 서버에서 해당 챕터 데이터 찾기
      const serverChapter = serverData.find(
        (item) =>
          item.userId === userId &&
          item.courseId === courseId &&
          item.chapterId === chapterId
      );

      if (serverChapter) {
        // 서버 데이터가 있으면 로컬 데이터로 업데이트
        const wp: WatchProgress = {
          ...serverChapter,
          // 로컬에서 변경된 내용으로 덮어쓰기
          currentTime: localChapter.currentTime,
          totalDuration: localChapter.totalDuration,
          watchedPercentage: localChapter.watchedPercentage || 0,
          isCompleted: localChapter.isCompleted || false,
          totalWatchTime: localChapter.currentTime,
          lastWatchedAt: Date.now(),
          completedAt: localChapter.isCompleted
            ? Date.now()
            : serverChapter.completedAt,
        };
        result.push(wp);
      } else {
        // 서버에 없으면 로컬 데이터로 생성 (새 항목)
        const wp = localChapterToWatchProgress(
          userId,
          courseId,
          chapterId,
          metadata.videoId,
          metadata.chapterOrder,
          metadata.videoOrder,
          metadata.chapterIndex,
          metadata.videoIndex,
          localChapter
        );
        result.push(wp);
      }
    }
  }

  return result;
}
