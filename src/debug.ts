// src/debug.ts - 임시 테스트 파일
// 이 파일을 만들어서 import가 제대로 되는지 테스트

// 1. 전체 import 테스트
import * as AllTypes from "./types/videoTypes";
console.log("전체 import:", AllTypes);

// 2. 개별 import 테스트
try {
  import("./types/videoTypes").then((module) => {
    console.log("Dynamic import 성공:", Object.keys(module));
    console.log(
      "CreateWatchProgressParams 존재?",
      "CreateWatchProgressParams" in module
    );
  });
} catch (error) {
  console.error("Dynamic import 실패:", error);
}

// 3. 직접 타입 확인
import type {
  Chapter,
  WatchProgress,
  CreateWatchProgressParams,
  UpdateWatchProgressParams,
  UserProgressSummary,
} from "./types/videoTypes";

console.log("타입 import 성공!");
