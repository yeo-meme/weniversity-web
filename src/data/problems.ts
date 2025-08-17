import { type Problem } from "../types/mission/problem";

export const problems: Problem[] = [
  {
    id: 1,
    title: "몫 구하기",
    description: "두 정수 `num1`, `num2`를 받아 나눈 몫을 반환하는 함수를 작성하세요.",
    testCases: [
      {
        input: [10, 3],
        output: 3,
      },
      {
        input: [7, 2],
        output: 3,
      },
    ],
    defaultCode: "function solution(num1, num2) { \n  return \n}",
  },
  {
    id: 2,
    title: "두 수의 합",
    description: "두 정수 `num1`, `num2`를 받아 두 수의 합을 반환하는 함수를 작성하세요.",
    testCases: [
      {
        input: [5, 6],
        output: 11,
      },
      {
        input: [1, 2],
        output: 3,
      },
    ],
    defaultCode: "function solution(num1, num2) { \n  return \n}",
  },
  {
    id: 3,
    title: "두 수의 차",
    description: "두 정수 `num1`, `num2`를 받아 두 수의 차를 반환하는 함수를 작성하세요.",
    testCases: [
      {
        input: [10, 5],
        output: 5,
      },
      {
        input: [3, 2],
        output: 1,
      },
    ],
    defaultCode: "function solution(num1, num2) { \n  return \n}",
  },
  {
    id: 4,
    title: "두 수의 곱",
    description: "두 정수 `num1`, `num2`를 받아 두 수의 곱을 반환하는 함수를 작성하세요.",
    testCases: [
      {
        input: [2, 3],
        output: 6,
      },
      {
        input: [5, 4],
        output: 20,
      },
    ],
    defaultCode: "function solution(num1, num2) { \n  return \n}",
  },
  {
    id: 5,
    title: "나머지 구하기",
    description: "두 정수 `num1`, `num2`를 받아 `num1`을 `num2`로 나눈 나머지를 반환하는 함수를 작성하세요.",
    testCases: [
      {
        input: [10, 3],
        output: 1,
      },
      {
        input: [7, 2],
        output: 1,
      },
    ],
    defaultCode: "function solution(num1, num2) { \n  return \n}",
  },
  {
    id: 6,
    title: "두 수 비교하기",
    description: "두 정수 `num1`, `num2`를 받아 `num1`이 `num2`보다 크면 1, 같으면 0, 작으면 -1을 반환하는 함수를 작성하세요.",
    testCases: [
      {
        input: [10, 5],
        output: 1,
      },
      {
        input: [5, 5],
        output: 0,
      },
      {
        input: [3, 8],
        output: -1,
      },
    ],
    defaultCode: "function solution(num1, num2) { \n  return \n}",
  },
  {
    id: 7,
    title: "절대값 구하기",
    description: "정수 `num`을 받아 절대값을 반환하는 함수를 작성하세요.",
    testCases: [
      {
        input: [5],
        output: 5,
      },
      {
        input: [-10],
        output: 10,
      },
    ],
    defaultCode: "function solution(num) { \n  return \n}",
  },
  {
    id: 8,
    title: "제곱 구하기",
    description: "두 정수 `num1`, `num2`를 받아 `num1`의 `num2` 제곱을 반환하는 함수를 작성하세요.",
    testCases: [
      {
        input: [2, 3],
        output: 8,
      },
      {
        input: [5, 2],
        output: 25,
      },
    ],
    defaultCode: "function solution(num1, num2) { \n  return \n}",
  },
  {
    id: 9,
    title: "짝수 홀수 판별",
    description: '정수 `num`을 받아 짝수이면 "짝수", 홀수이면 "홀수"를 반환하는 함수를 작성하세요.',
    testCases: [
      {
        input: [4],
        output: "짝수",
      },
      {
        input: [7],
        output: "홀수",
      },
    ],
    defaultCode: "function solution(num) { \n  return \n}",
  },
  {
    id: 10,
    title: "두 수의 평균",
    description: "두 정수 `num1`, `num2`를 받아 두 수의 평균을 반환하는 함수를 작성하세요.",
    testCases: [
      {
        input: [10, 2],
        output: 6,
      },
      {
        input: [5, 5],
        output: 5,
      },
    ],
    defaultCode: "function solution(num1, num2) { \n  return \n}",
  },
  {
    id: 11,
    title: "세 수의 합",
    description: "세 정수 `num1`, `num2`, `num3`를 받아 세 수의 합을 반환하는 함수를 작성하세요.",
    testCases: [
      {
        input: [1, 2, 3],
        output: 6,
      },
      {
        input: [10, 20, 30],
        output: 60,
      },
    ],
    defaultCode: "function solution(num1, num2, num3) { \n  return \n}",
  },
  {
    id: 12,
    title: "세 수의 평균",
    description: "세 정수 `num1`, `num2`, `num3`를 받아 세 수의 평균을 반환하는 함수를 작성하세요.",
    testCases: [
      {
        input: [1, 2, 3],
        output: 2,
      },
      {
        input: [10, 20, 30],
        output: 20,
      },
    ],
    defaultCode: "function solution(num1, num2, num3) { \n  return \n}",
  },
  {
    id: 13,
    title: "최댓값 구하기",
    description: "세 정수 `num1`, `num2`, `num3`를 받아 세 수 중 최댓값을 반환하는 함수를 작성하세요.",
    testCases: [
      {
        input: [1, 5, 3],
        output: 5,
      },
      {
        input: [10, 2, 8],
        output: 10,
      },
    ],
    defaultCode: "function solution(num1, num2, num3) { \n  return \n}",
  },
  {
    id: 14,
    title: "최솟값 구하기",
    description: "세 정수 `num1`, `num2`, `num3`를 받아 세 수 중 최솟값을 반환하는 함수를 작성하세요.",
    testCases: [
      {
        input: [1, 5, 3],
        output: 1,
      },
      {
        input: [10, 2, 8],
        output: 2,
      },
    ],
    defaultCode: "function solution(num1, num2, num3) { \n  return \n}",
  },
  {
    id: 15,
    title: "부호 판별",
    description: '정수 `num`을 받아 양수이면 "양수", 음수이면 "음수", 0이면 "0"을 반환하는 함수를 작성하세요.',
    testCases: [
      {
        input: [5],
        output: "양수",
      },
      {
        input: [-3],
        output: "음수",
      },
      {
        input: [0],
        output: "0",
      },
    ],
    defaultCode: "function solution(num) { \n  return \n}",
  },
  {
    id: 16,
    title: "두 수의 곱이 짝수인지 판별",
    description: "두 정수 `num1`, `num2`를 받아 두 수의 곱이 짝수이면 true, 아니면 false를 반환하는 함수를 작성하세요.",
    testCases: [
      {
        input: [2, 3],
        output: true,
      },
      {
        input: [5, 7],
        output: false,
      },
    ],
    defaultCode: "function solution(num1, num2) { \n  return \n}",
  },
  {
    id: 17,
    title: "문자열 길이 구하기",
    description: "문자열 `str`을 받아 길이를 반환하는 함수를 작성하세요.",
    testCases: [
      {
        input: ["hello"],
        output: 5,
      },
      {
        input: ["world"],
        output: 5,
      },
    ],
    defaultCode: "function solution(str) { \n  return \n}",
  },
  {
    id: 18,
    title: "두 수의 차의 절대값",
    description: "두 정수 `num1`, `num2`를 받아 두 수의 차의 절대값을 반환하는 함수를 작성하세요.",
    testCases: [
      {
        input: [10, 5],
        output: 5,
      },
      {
        input: [5, 10],
        output: 5,
      },
    ],
    defaultCode: "function solution(num1, num2) { \n  return \n}",
  },
  {
    id: 19,
    title: "문자열 뒤집기",
    description: "문자열 `str`을 받아 뒤집힌 문자열을 반환하는 함수를 작성하세요.",
    testCases: [
      {
        input: ["hello"],
        output: "olleh",
      },
      {
        input: ["world"],
        output: "dlrow",
      },
    ],
    defaultCode: "function solution(str) { \n  return \n}",
  },
  {
    id: 20,
    title: "문자열에 특정 문자 포함 여부",
    description: "문자열 `str`과 문자 `char`를 받아 `str`에 `char`가 포함되어 있으면 true, 아니면 false를 반환하는 함수를 작성하세요.",
    testCases: [
      {
        input: ["hello", "o"],
        output: true,
      },
      {
        input: ["world", "a"],
        output: false,
      },
    ],
    defaultCode: "function solution(str, char) { \n  return \n}",
  },
  {
    id: 21,
    title: "배열의 합",
    description: "정수 배열 `arr`을 받아 모든 요소의 합을 반환하는 함수를 작성하세요.",
    testCases: [
      {
        input: [[1, 2, 3]],
        output: 6,
      },
      {
        input: [[10, 20]],
        output: 30,
      },
    ],
    defaultCode: "function solution(arr) { \n  return \n}",
  },
  {
    id: 22,
    title: "배열의 평균",
    description: "정수 배열 `arr`을 받아 모든 요소의 평균을 반환하는 함수를 작성하세요.",
    testCases: [
      {
        input: [[1, 2, 3]],
        output: 2,
      },
      {
        input: [[10, 20]],
        output: 15,
      },
    ],
    defaultCode: "function solution(arr) { \n  return \n}",
  },
  {
    id: 23,
    title: "배열의 최댓값",
    description: "정수 배열 `arr`을 받아 최댓값을 반환하는 함수를 작성하세요.",
    testCases: [
      {
        input: [[1, 5, 3]],
        output: 5,
      },
      {
        input: [[10, 2, 8]],
        output: 10,
      },
    ],
    defaultCode: "function solution(arr) { \n  return \n}",
  },
  {
    id: 24,
    title: "배열의 최솟값",
    description: "정수 배열 `arr`을 받아 최솟값을 반환하는 함수를 작성하세요.",
    testCases: [
      {
        input: [[1, 5, 3]],
        output: 1,
      },
      {
        input: [[10, 2, 8]],
        output: 2,
      },
    ],
    defaultCode: "function solution(arr) { \n  return \n}",
  },
  {
    id: 25,
    title: "배열의 짝수 개수",
    description: "정수 배열 `arr`을 받아 짝수의 개수를 반환하는 함수를 작성하세요.",
    testCases: [
      {
        input: [[1, 2, 3, 4]],
        output: 2,
      },
      {
        input: [[1, 3, 5, 7]],
        output: 0,
      },
    ],
    defaultCode: "function solution(arr) { \n  return \n}",
  },
  {
    id: 26,
    title: "배열의 홀수 개수",
    description: "정수 배열 `arr`을 받아 홀수의 개수를 반환하는 함수를 작성하세요.",
    testCases: [
      {
        input: [[1, 2, 3, 4]],
        output: 2,
      },
      {
        input: [[2, 4, 6, 8]],
        output: 0,
      },
    ],
    defaultCode: "function solution(arr) { \n  return \n}",
  },
  {
    id: 27,
    title: "배열에서 특정 숫자 찾기",
    description: "정수 배열 `arr`과 정수 `target`을 받아 `arr`에 `target`이 있으면 true, 아니면 false를 반환하는 함수를 작성하세요.",
    testCases: [
      {
        input: [[1, 2, 3], 2],
        output: true,
      },
      {
        input: [[1, 2, 3], 4],
        output: false,
      },
    ],
    defaultCode: "function solution(arr, target) { \n  return \n}",
  },
  {
    id: 28,
    title: "배열에서 특정 숫자 제거",
    description: "정수 배열 `arr`과 정수 `target`을 받아 `arr`에서 `target`을 제거한 새로운 배열을 반환하는 함수를 작성하세요.",
    testCases: [
      {
        input: [[1, 2, 3], 2],
        output: [1, 3],
      },
      {
        input: [[1, 2, 3], 4],
        output: [1, 2, 3],
      },
    ],
    defaultCode: "function solution(arr, target) { \n  return \n}",
  },
  {
    id: 29,
    title: "배열 정렬하기",
    description: "정수 배열 `arr`을 받아 오름차순으로 정렬한 새로운 배열을 반환하는 함수를 작성하세요.",
    testCases: [
      {
        input: [[3, 1, 2]],
        output: [1, 2, 3],
      },
      {
        input: [[10, 2, 8]],
        output: [2, 8, 10],
      },
    ],
    defaultCode: "function solution(arr) { \n  return \n}",
  },
  {
    id: 30,
    title: "배열 뒤집기",
    description: "정수 배열 `arr`을 받아 뒤집은 새로운 배열을 반환하는 함수를 작성하세요.",
    testCases: [
      {
        input: [[1, 2, 3]],
        output: [3, 2, 1],
      },
      {
        input: [[10, 20]],
        output: [20, 10],
      },
    ],
    defaultCode: "function solution(arr) { \n  return \n}",
  },
  {
    id: 31,
    title: "두 문자열 합치기",
    description: "두 문자열 `str1`, `str2`를 받아 합친 문자열을 반환하는 함수를 작성하세요.",
    testCases: [
      {
        input: ["hello", "world"],
        output: "helloworld",
      },
      {
        input: ["hi", "there"],
        output: "hithere",
      },
    ],
    defaultCode: "function solution(str1, str2) { \n  return \n}",
  },
  {
    id: 32,
    title: "문자열 자르기",
    description: "문자열 `str`과 시작 인덱스 `start`, 끝 인덱스 `end`를 받아 `start`부터 `end`까지 자른 문자열을 반환하는 함수를 작성하세요.",
    testCases: [
      {
        input: ["hello", 1, 3],
        output: "ell",
      },
      {
        input: ["world", 0, 2],
        output: "wor",
      },
    ],
    defaultCode: "function solution(str, start, end) { \n  return \n}",
  },
  {
    id: 33,
    title: "문자열 대문자로 변환",
    description: "문자열 `str`을 받아 모든 문자를 대문자로 변환한 문자열을 반환하는 함수를 작성하세요.",
    testCases: [
      {
        input: ["hello"],
        output: "HELLO",
      },
      {
        input: ["world"],
        output: "WORLD",
      },
    ],
    defaultCode: "function solution(str) { \n  return \n}",
  },
  {
    id: 34,
    title: "문자열 소문자로 변환",
    description: "문자열 `str`을 받아 모든 문자를 소문자로 변환한 문자열을 반환하는 함수를 작성하세요.",
    testCases: [
      {
        input: ["HELLO"],
        output: "hello",
      },
      {
        input: ["WORLD"],
        output: "world",
      },
    ],
    defaultCode: "function solution(str) { \n  return \n}",
  },
  {
    id: 35,
    title: "문자열 공백 제거",
    description: "문자열 `str`의 양 끝에 있는 공백을 제거한 문자열을 반환하는 함수를 작성하세요.",
    testCases: [
      {
        input: ["  hello  "],
        output: "hello",
      },
      {
        input: [" world "],
        output: "world",
      },
    ],
    defaultCode: "function solution(str) { \n  return \n}",
  },
  {
    id: 36,
    title: "문자열 특정 문자 대체",
    description: "문자열 `str`에서 특정 문자 `oldChar`를 `newChar`로 모두 바꾼 새로운 문자열을 반환하는 함수를 작성하세요.",
    testCases: [
      {
        input: ["hello", "l", "a"],
        output: "heaao",
      },
      {
        input: ["world", "o", "e"],
        output: "werld",
      },
    ],
    defaultCode: "function solution(str, oldChar, newChar) { \n  return \n}",
  },
  {
    id: 37,
    title: "문자열 반복하기",
    description: "문자열 `str`을 정수 `n`번 반복하여 새로운 문자열을 반환하는 함수를 작성하세요.",
    testCases: [
      {
        input: ["abc", 2],
        output: "abcabc",
      },
      {
        input: ["a", 5],
        output: "aaaaa",
      },
    ],
    defaultCode: "function solution(str, n) { \n  return \n}",
  },
  {
    id: 38,
    title: "문자열의 특정 위치 문자",
    description: "문자열 `str`과 인덱스 `index`를 받아 `index`에 해당하는 문자를 반환하는 함수를 작성하세요.",
    testCases: [
      {
        input: ["hello", 1],
        output: "e",
      },
      {
        input: ["world", 4],
        output: "d",
      },
    ],
    defaultCode: "function solution(str, index) { \n  return \n}",
  },
  {
    id: 39,
    title: "배열의 합이 100인지 판별",
    description: "정수 배열 `arr`을 받아 모든 요소의 합이 100이면 true, 아니면 false를 반환하는 함수를 작성하세요.",
    testCases: [
      {
        input: [[10, 20, 70]],
        output: true,
      },
      {
        input: [[10, 20, 30]],
        output: false,
      },
    ],
    defaultCode: "function solution(arr) { \n  return \n}",
  },
  {
    id: 40,
    title: "배열에서 짝수만 필터링",
    description: "정수 배열 `arr`을 받아 짝수만 포함하는 새로운 배열을 반환하는 함수를 작성하세요.",
    testCases: [
      {
        input: [[1, 2, 3, 4]],
        output: [2, 4],
      },
      {
        input: [[1, 3, 5, 7]],
        output: [],
      },
    ],
    defaultCode: "function solution(arr) { \n  return \n}",
  },
  {
    id: 41,
    title: "배열에서 홀수만 필터링",
    description: "정수 배열 `arr`을 받아 홀수만 포함하는 새로운 배열을 반환하는 함수를 작성하세요.",
    testCases: [
      {
        input: [[1, 2, 3, 4]],
        output: [1, 3],
      },
      {
        input: [[2, 4, 6, 8]],
        output: [],
      },
    ],
    defaultCode: "function solution(arr) { \n  return \n}",
  },
  {
    id: 42,
    title: "배열의 모든 요소에 2 곱하기",
    description: "정수 배열 `arr`을 받아 모든 요소에 2를 곱한 새로운 배열을 반환하는 함수를 작성하세요.",
    testCases: [
      {
        input: [[1, 2, 3]],
        output: [2, 4, 6],
      },
      {
        input: [[10, 20]],
        output: [20, 40],
      },
    ],
    defaultCode: "function solution(arr) { \n  return \n}",
  },
  {
    id: 43,
    title: "배열에 특정 요소 추가",
    description: "정수 배열 `arr`과 정수 `num`을 받아 `num`을 `arr`의 마지막에 추가한 새로운 배열을 반환하는 함수를 작성하세요.",
    testCases: [
      {
        input: [[1, 2], 3],
        output: [1, 2, 3],
      },
      {
        input: [[10, 20], 30],
        output: [10, 20, 30],
      },
    ],
    defaultCode: "function solution(arr, num) { \n  return \n}",
  },
  {
    id: 44,
    title: "두 배열 합치기",
    description: "두 정수 배열 `arr1`, `arr2`를 받아 합친 새로운 배열을 반환하는 함수를 작성하세요.",
    testCases: [
      {
        input: [
          [1, 2],
          [3, 4],
        ],
        output: [1, 2, 3, 4],
      },
      {
        input: [[10], [20, 30]],
        output: [10, 20, 30],
      },
    ],
    defaultCode: "function solution(arr1, arr2) { \n  return \n}",
  },
  {
    id: 45,
    title: "두 수의 합이 0인지 판별",
    description: "두 정수 `num1`, `num2`를 받아 합이 0이면 true, 아니면 false를 반환하는 함수를 작성하세요.",
    testCases: [
      {
        input: [5, -5],
        output: true,
      },
      {
        input: [1, 2],
        output: false,
      },
    ],
    defaultCode: "function solution(num1, num2) { \n  return \n}",
  },
  {
    id: 46,
    title: "문자열에 특정 문자열 포함 여부",
    description: "문자열 `str`과 `sub`를 받아 `str`에 `sub`가 포함되어 있으면 true, 아니면 false를 반환하는 함수를 작성하세요.",
    testCases: [
      {
        input: ["hello world", "world"],
        output: true,
      },
      {
        input: ["hello world", "good"],
        output: false,
      },
    ],
    defaultCode: "function solution(str, sub) { \n  return \n}",
  },
  {
    id: 47,
    title: "숫자를 문자열로 변환",
    description: "정수 `num`을 받아 문자열로 변환한 값을 반환하는 함수를 작성하세요.",
    testCases: [
      {
        input: [123],
        output: "123",
      },
      {
        input: [456],
        output: "456",
      },
    ],
    defaultCode: "function solution(num) { \n  return \n}",
  },
  {
    id: 48,
    title: "문자열을 숫자로 변환",
    description: "문자열 `str`을 받아 정수로 변환한 값을 반환하는 함수를 작성하세요.",
    testCases: [
      {
        input: ["123"],
        output: 123,
      },
      {
        input: ["456"],
        output: 456,
      },
    ],
    defaultCode: "function solution(str) { \n  return \n}",
  },
  {
    id: 49,
    title: "원의 넓이",
    description: "반지름 `r`을 받아 원의 넓이를 반환하는 함수를 작성하세요. (단, 파이 값은 3.14로 가정)",
    testCases: [
      {
        input: [5],
        output: 78.5,
      },
      {
        input: [10],
        output: 314,
      },
    ],
    defaultCode: "function solution(r) { \n  return \n}",
  },
  {
    id: 50,
    title: "직사각형의 넓이",
    description: "가로 `width`, 세로 `height`를 받아 직사각형의 넓이를 반환하는 함수를 작성하세요.",
    testCases: [
      {
        input: [10, 5],
        output: 50,
      },
      {
        input: [3, 4],
        output: 12,
      },
    ],
    defaultCode: "function solution(width, height) { \n  return \n}",
  },
  {
    id: 51,
    title: "삼각형의 넓이",
    description: "밑변 `base`, 높이 `height`를 받아 삼각형의 넓이를 반환하는 함수를 작성하세요.",
    testCases: [
      {
        input: [10, 5],
        output: 25,
      },
      {
        input: [3, 4],
        output: 6,
      },
    ],
    defaultCode: "function solution(base, height) { \n  return \n}",
  },
  {
    id: 52,
    title: "문자열의 첫 글자 반환",
    description: "문자열 `str`을 받아 첫 글자를 반환하는 함수를 작성하세요.",
    testCases: [
      {
        input: ["hello"],
        output: "h",
      },
      {
        input: ["world"],
        output: "w",
      },
    ],
    defaultCode: "function solution(str) { \n  return \n}",
  },
  {
    id: 53,
    title: "문자열의 마지막 글자 반환",
    description: "문자열 `str`을 받아 마지막 글자를 반환하는 함수를 작성하세요.",
    testCases: [
      {
        input: ["hello"],
        output: "o",
      },
      {
        input: ["world"],
        output: "d",
      },
    ],
    defaultCode: "function solution(str) { \n  return \n}",
  },
  {
    id: 54,
    title: "두 수 사이의 합",
    description: "두 정수 `a`, `b`를 받아 `a`와 `b` 사이의 모든 정수의 합을 반환하는 함수를 작성하세요.",
    testCases: [
      {
        input: [3, 5],
        output: 12,
      },
      {
        input: [5, 3],
        output: 12,
      },
    ],
    defaultCode: "function solution(a, b) { \n  return \n}",
  },
  {
    id: 55,
    title: "두 수 사이의 짝수 합",
    description: "두 정수 `a`, `b`를 받아 `a`와 `b` 사이의 모든 짝수의 합을 반환하는 함수를 작성하세요.",
    testCases: [
      {
        input: [3, 8],
        output: 18,
      },
      {
        input: [8, 3],
        output: 18,
      },
    ],
    defaultCode: "function solution(a, b) { \n  return \n}",
  },
  {
    id: 56,
    title: "두 수 사이의 홀수 합",
    description: "두 정수 `a`, `b`를 받아 `a`와 `b` 사이의 모든 홀수의 합을 반환하는 함수를 작성하세요.",
    testCases: [
      {
        input: [3, 8],
        output: 12,
      },
      {
        input: [8, 3],
        output: 12,
      },
    ],
    defaultCode: "function solution(a, b) { \n  return \n}",
  },
  {
    id: 57,
    title: "배열의 요소 중 짝수만 합하기",
    description: "정수 배열 `arr`을 받아 짝수 요소들만 합하여 반환하는 함수를 작성하세요.",
    testCases: [
      {
        input: [[1, 2, 3, 4]],
        output: 6,
      },
      {
        input: [[2, 4, 6]],
        output: 12,
      },
    ],
    defaultCode: "function solution(arr) { \n  return \n}",
  },
  {
    id: 58,
    title: "배열의 요소 중 홀수만 합하기",
    description: "정수 배열 `arr`을 받아 홀수 요소들만 합하여 반환하는 함수를 작성하세요.",
    testCases: [
      {
        input: [[1, 2, 3, 4]],
        output: 4,
      },
      {
        input: [[1, 3, 5]],
        output: 9,
      },
    ],
    defaultCode: "function solution(arr) { \n  return \n}",
  },
  {
    id: 59,
    title: '문자열에 "a"가 몇 번 나오는지',
    description: '문자열 `str`을 받아 "a" 문자가 몇 번 나오는지 개수를 반환하는 함수를 작성하세요.',
    testCases: [
      {
        input: ["banana"],
        output: 3,
      },
      {
        input: ["apple"],
        output: 1,
      },
    ],
    defaultCode: "function solution(str) { \n  return \n}",
  },
  {
    id: 60,
    title: "문자열의 모음 개수",
    description: '문자열 `str`을 받아 모음("a", "e", "i", "o", "u")의 총 개수를 반환하는 함수를 작성하세요.',
    testCases: [
      {
        input: ["hello"],
        output: 2,
      },
      {
        input: ["beautiful"],
        output: 5,
      },
    ],
    defaultCode: "function solution(str) { \n  return \n}",
  },
  {
    id: 61,
    title: "배열의 중복 제거",
    description: "정수 배열 `arr`을 받아 중복된 요소를 제거한 새로운 배열을 반환하는 함수를 작성하세요.",
    testCases: [
      {
        input: [[1, 2, 2, 3]],
        output: [1, 2, 3],
      },
      {
        input: [[5, 5, 5]],
        output: [5],
      },
    ],
    defaultCode: "function solution(arr) { \n  return \n}",
  },
  {
    id: 62,
    title: "배열의 짝수 요소들만 제곱",
    description: "정수 배열 `arr`을 받아 짝수 요소들만 제곱하여 새로운 배열을 반환하는 함수를 작성하세요.",
    testCases: [
      {
        input: [[1, 2, 3, 4]],
        output: [4, 16],
      },
      {
        input: [[1, 3, 5]],
        output: [],
      },
    ],
    defaultCode: "function solution(arr) { \n  return \n}",
  },
  {
    id: 63,
    title: "가장 큰 수와 가장 작은 수의 합",
    description: "정수 배열 `arr`을 받아 가장 큰 수와 가장 작은 수의 합을 반환하는 함수를 작성하세요.",
    testCases: [
      {
        input: [[1, 2, 3, 4, 5]],
        output: 6,
      },
      {
        input: [[10, 20, 30]],
        output: 40,
      },
    ],
    defaultCode: "function solution(arr) { \n  return \n}",
  },
  {
    id: 64,
    title: "두 수의 약수 공통 개수",
    description: "두 정수 `num1`, `num2`를 받아 두 수의 공통된 약수의 개수를 반환하는 함수를 작성하세요.",
    testCases: [
      {
        input: [6, 8],
        output: 2,
      },
      {
        input: [10, 15],
        output: 2,
      },
    ],
    defaultCode: "function solution(num1, num2) { \n  return \n}",
  },
  {
    id: 65,
    title: "피보나치 수열",
    description: "정수 `n`을 받아 `n`번째 피보나치 수를 반환하는 함수를 작성하세요.",
    testCases: [
      {
        input: [5],
        output: 5,
      },
      {
        input: [10],
        output: 55,
      },
    ],
    defaultCode: "function solution(n) { \n  return \n}",
  },
  {
    id: 66,
    title: "팩토리얼 계산",
    description: "정수 `n`을 받아 `n!` (n 팩토리얼) 값을 반환하는 함수를 작성하세요.",
    testCases: [
      {
        input: [4],
        output: 24,
      },
      {
        input: [5],
        output: 120,
      },
    ],
    defaultCode: "function solution(n) { \n  return \n}",
  },
  {
    id: 67,
    title: "소수 판별",
    description: "정수 `num`을 받아 소수이면 true, 아니면 false를 반환하는 함수를 작성하세요.",
    testCases: [
      {
        input: [7],
        output: true,
      },
      {
        input: [10],
        output: false,
      },
    ],
    defaultCode: "function solution(num) { \n  return \n}",
  },
  {
    id: 68,
    title: "1부터 n까지의 소수 개수",
    description: "정수 `n`을 받아 1부터 `n`까지의 소수의 개수를 반환하는 함수를 작성하세요.",
    testCases: [
      {
        input: [10],
        output: 4,
      },
      {
        input: [20],
        output: 8,
      },
    ],
    defaultCode: "function solution(n) { \n  return \n}",
  },
  {
    id: 69,
    title: "문자열이 회문인지 판별",
    description: "문자열 `str`을 받아 회문(앞뒤가 같은 문자열)이면 true, 아니면 false를 반환하는 함수를 작성하세요.",
    testCases: [
      {
        input: ["racecar"],
        output: true,
      },
      {
        input: ["hello"],
        output: false,
      },
    ],
    defaultCode: "function solution(str) { \n  return \n}",
  },
  {
    id: 70,
    title: "숫자 문자열의 합",
    description: "숫자로 이루어진 문자열 `str`을 받아 각 자릿수의 합을 반환하는 함수를 작성하세요.",
    testCases: [
      {
        input: ["123"],
        output: 6,
      },
      {
        input: ["987"],
        output: 24,
      },
    ],
    defaultCode: "function solution(str) { \n  return \n}",
  },
  {
    id: 71,
    title: "배열의 요소들을 문자열로 합치기",
    description: "문자열 배열 `arr`을 받아 모든 요소를 하나의 문자열로 합쳐 반환하는 함수를 작성하세요.",
    testCases: [
      {
        input: [["a", "b", "c"]],
        output: "abc",
      },
      {
        input: [["hello", " ", "world"]],
        output: "hello world",
      },
    ],
    defaultCode: "function solution(arr) { \n  return \n}",
  },
  {
    id: 72,
    title: "요일 구하기",
    description: "연도 `year`, 월 `month`, 일 `day`를 받아 해당 날짜의 요일을 반환하는 함수를 작성하세요. (단, 0: 일, 1: 월, ...)",
    testCases: [
      {
        input: [2024, 7, 11],
        output: 4,
      },
      {
        input: [2025, 1, 1],
        output: 3,
      },
    ],
    defaultCode: "function solution(year, month, day) { \n  return \n}",
  },
  {
    id: 73,
    title: "윤년 판별",
    description: "연도 `year`를 받아 윤년이면 true, 아니면 false를 반환하는 함수를 작성하세요.",
    testCases: [
      {
        input: [2020],
        output: true,
      },
      {
        input: [2021],
        output: false,
      },
    ],
    defaultCode: "function solution(year) { \n  return \n}",
  },
  {
    id: 74,
    title: "최대공약수 구하기",
    description: "두 정수 `a`, `b`를 받아 최대공약수를 반환하는 함수를 작성하세요.",
    testCases: [
      {
        input: [12, 18],
        output: 6,
      },
      {
        input: [20, 30],
        output: 10,
      },
    ],
    defaultCode: "function solution(a, b) { \n  return \n}",
  },
  {
    id: 75,
    title: "최소공배수 구하기",
    description: "두 정수 `a`, `b`를 받아 최소공배수를 반환하는 함수를 작성하세요.",
    testCases: [
      {
        input: [12, 18],
        output: 36,
      },
      {
        input: [20, 30],
        output: 60,
      },
    ],
    defaultCode: "function solution(a, b) { \n  return \n}",
  },
  {
    id: 76,
    title: "배열의 요소들을 합친 후 제곱",
    description: "정수 배열 `arr`을 받아 모든 요소의 합을 구한 후, 그 결과를 제곱하여 반환하는 함수를 작성하세요.",
    testCases: [
      {
        input: [[1, 2, 3]],
        output: 36,
      },
      {
        input: [[1, 1]],
        output: 4,
      },
    ],
    defaultCode: "function solution(arr) { \n  return \n}",
  },
  {
    id: 77,
    title: "배열의 모든 요소가 짝수인지 판별",
    description: "정수 배열 `arr`을 받아 모든 요소가 짝수이면 true, 아니면 false를 반환하는 함수를 작성하세요.",
    testCases: [
      {
        input: [[2, 4, 6]],
        output: true,
      },
      {
        input: [[2, 3, 4]],
        output: false,
      },
    ],
    defaultCode: "function solution(arr) { \n  return \n}",
  },
  {
    id: 78,
    title: "문자열에서 가장 긴 단어 찾기",
    description: "문자열 `str`을 받아 가장 긴 단어를 반환하는 함수를 작성하세요.",
    testCases: [
      {
        input: ["hello world from me"],
        output: "hello",
      },
      {
        input: ["one two three four five"],
        output: "three",
      },
    ],
    defaultCode: "function solution(str) { \n  return \n}",
  },
  {
    id: 79,
    title: "배열의 특정 요소의 개수",
    description: "정수 배열 `arr`과 정수 `target`을 받아 `arr`에 `target`이 몇 번 나오는지 반환하는 함수를 작성하세요.",
    testCases: [
      {
        input: [[1, 2, 2, 3], 2],
        output: 2,
      },
      {
        input: [[1, 3, 5], 4],
        output: 0,
      },
    ],
    defaultCode: "function solution(arr, target) { \n  return \n}",
  },
  {
    id: 80,
    title: "숫자 뒤집기",
    description: "정수 `num`을 받아 숫자를 뒤집은 값을 반환하는 함수를 작성하세요.",
    testCases: [
      {
        input: [123],
        output: 321,
      },
      {
        input: [9876],
        output: 6789,
      },
    ],
    defaultCode: "function solution(num) { \n  return \n}",
  },
  {
    id: 81,
    title: "배열의 홀수 요소만 합한 뒤 제곱",
    description: "정수 배열 `arr`을 받아 홀수 요소들만 합한 뒤, 그 결과를 제곱하여 반환하는 함수를 작성하세요.",
    testCases: [
      {
        input: [[1, 2, 3, 4]],
        output: 16,
      },
      {
        input: [[1, 3, 5]],
        output: 81,
      },
    ],
    defaultCode: "function solution(arr) { \n  return \n}",
  },
  {
    id: 82,
    title: "배열의 짝수 요소만 합한 뒤 제곱",
    description: "정수 배열 `arr`을 받아 짝수 요소들만 합한 뒤, 그 결과를 제곱하여 반환하는 함수를 작성하세요.",
    testCases: [
      {
        input: [[1, 2, 3, 4]],
        output: 36,
      },
      {
        input: [[2, 4, 6]],
        output: 144,
      },
    ],
    defaultCode: "function solution(arr) { \n  return \n}",
  },
  {
    id: 83,
    title: "문자열에 특정 문자열이 포함된 횟수",
    description: "문자열 `str`과 `sub`를 받아 `str`에 `sub`가 몇 번 포함되어 있는지 반환하는 함수를 작성하세요.",
    testCases: [
      {
        input: ["banana", "na"],
        output: 2,
      },
      {
        input: ["ababab", "ab"],
        output: 3,
      },
    ],
    defaultCode: "function solution(str, sub) { \n  return \n}",
  },
  {
    id: 84,
    title: "문자열의 공백 제거",
    description: "문자열 `str`의 모든 공백을 제거한 문자열을 반환하는 함수를 작성하세요.",
    testCases: [
      {
        input: ["hello world"],
        output: "helloworld",
      },
      {
        input: ["  a  b  c  "],
        output: "abc",
      },
    ],
    defaultCode: "function solution(str) { \n  return \n}",
  },
  {
    id: 85,
    title: '문자열에 "!" 추가',
    description: '문자열 `str`을 받아 뒤에 "!"를 추가한 문자열을 반환하는 함수를 작성하세요.',
    testCases: [
      {
        input: ["hello"],
        output: "hello!",
      },
      {
        input: ["world"],
        output: "world!",
      },
    ],
    defaultCode: "function solution(str) { \n  return \n}",
  },
  {
    id: 86,
    title: "문자열의 첫 글자 대문자",
    description: "문자열 `str`을 받아 첫 글자만 대문자로 변환하고 나머지는 소문자로 유지한 문자열을 반환하는 함수를 작성하세요.",
    testCases: [
      {
        input: ["hello"],
        output: "Hello",
      },
      {
        input: ["world"],
        output: "World",
      },
    ],
    defaultCode: "function solution(str) { \n  return \n}",
  },
  {
    id: 87,
    title: "배열의 요소들을 쉼표로 연결",
    description: "문자열 배열 `arr`을 받아 쉼표로 연결된 문자열을 반환하는 함수를 작성하세요.",
    testCases: [
      {
        input: [["a", "b", "c"]],
        output: "a,b,c",
      },
      {
        input: [["hello", "world"]],
        output: "hello,world",
      },
    ],
    defaultCode: "function solution(arr) { \n  return \n}",
  },
  {
    id: 88,
    title: "배열의 최댓값 인덱스",
    description: "정수 배열 `arr`을 받아 최댓값의 인덱스를 반환하는 함수를 작성하세요.",
    testCases: [
      {
        input: [[1, 5, 3]],
        output: 1,
      },
      {
        input: [[10, 2, 8]],
        output: 0,
      },
    ],
    defaultCode: "function solution(arr) { \n  return \n}",
  },
  {
    id: 89,
    title: "배열의 최솟값 인덱스",
    description: "정수 배열 `arr`을 받아 최솟값의 인덱스를 반환하는 함수를 작성하세요.",
    testCases: [
      {
        input: [[1, 5, 3]],
        output: 0,
      },
      {
        input: [[10, 2, 8]],
        output: 1,
      },
    ],
    defaultCode: "function solution(arr) { \n  return \n}",
  },
  {
    id: 90,
    title: "문자열의 자릿수 합",
    description: "문자열 `num_str`을 받아 각 자릿수의 합을 반환하는 함수를 작성하세요.",
    testCases: [
      {
        input: ["123"],
        output: 6,
      },
      {
        input: ["987"],
        output: 24,
      },
    ],
    defaultCode: "function solution(num_str) { \n  return \n}",
  },
  {
    id: 91,
    title: "두 수의 합이 짝수인지 홀수인지 판별",
    description: '두 정수 `num1`, `num2`를 받아 두 수의 합이 짝수이면 "짝수", 홀수이면 "홀수"를 반환하는 함수를 작성하세요.',
    testCases: [
      {
        input: [1, 2],
        output: "홀수",
      },
      {
        input: [2, 4],
        output: "짝수",
      },
    ],
    defaultCode: "function solution(num1, num2) { \n  return \n}",
  },
  {
    id: 92,
    title: "문자열의 길이가 짝수인지 홀수인지",
    description: '문자열 `str`의 길이가 짝수이면 "짝수", 홀수이면 "홀수"를 반환하는 함수를 작성하세요.',
    testCases: [
      {
        input: ["hello"],
        output: "홀수",
      },
      {
        input: ["world!"],
        output: "짝수",
      },
    ],
    defaultCode: "function solution(str) { \n  return \n}",
  },
  {
    id: 93,
    title: "배열의 첫 번째 요소 반환",
    description: "정수 배열 `arr`을 받아 첫 번째 요소를 반환하는 함수를 작성하세요.",
    testCases: [
      {
        input: [[1, 2, 3]],
        output: 1,
      },
      {
        input: [[10, 20]],
        output: 10,
      },
    ],
    defaultCode: "function solution(arr) { \n  return \n}",
  },
  {
    id: 94,
    title: "배열의 마지막 요소 반환",
    description: "정수 배열 `arr`을 받아 마지막 요소를 반환하는 함수를 작성하세요.",
    testCases: [
      {
        input: [[1, 2, 3]],
        output: 3,
      },
      {
        input: [[10, 20]],
        output: 20,
      },
    ],
    defaultCode: "function solution(arr) { \n  return \n}",
  },
  {
    id: 95,
    title: "배열의 중복된 요소만 반환",
    description: "정수 배열 `arr`을 받아 중복된 요소만 포함하는 새로운 배열을 반환하는 함수를 작성하세요.",
    testCases: [
      {
        input: [[1, 2, 2, 3, 3, 3]],
        output: [2, 3],
      },
      {
        input: [[1, 2, 3]],
        output: [],
      },
    ],
    defaultCode: "function solution(arr) { \n  return \n}",
  },
  {
    id: 96,
    title: "두 문자열이 같은지 판별",
    description: "두 문자열 `str1`, `str2`를 받아 두 문자열이 같으면 true, 아니면 false를 반환하는 함수를 작성하세요.",
    testCases: [
      {
        input: ["hello", "hello"],
        output: true,
      },
      {
        input: ["hello", "world"],
        output: false,
      },
    ],
    defaultCode: "function solution(str1, str2) { \n  return \n}",
  },
  {
    id: 97,
    title: "두 배열이 같은지 판별",
    description: "두 정수 배열 `arr1`, `arr2`를 받아 두 배열의 요소와 순서가 모두 같으면 true, 아니면 false를 반환하는 함수를 작성하세요.",
    testCases: [
      {
        input: [
          [1, 2],
          [1, 2],
        ],
        output: true,
      },
      {
        input: [
          [1, 2],
          [2, 1],
        ],
        output: false,
      },
    ],
    defaultCode: "function solution(arr1, arr2) { \n  return \n}",
  },
  {
    id: 98,
    title: "정수를 2진수로 변환",
    description: "정수 `num`을 받아 2진수 문자열로 변환하는 함수를 작성하세요.",
    testCases: [
      {
        input: [5],
        output: "101",
      },
      {
        input: [10],
        output: "1010",
      },
    ],
    defaultCode: "function solution(num) { \n  return \n}",
  },
  {
    id: 99,
    title: "2진수 문자열을 정수로 변환",
    description: "2진수 문자열 `bin_str`을 받아 정수로 변환하는 함수를 작성하세요.",
    testCases: [
      {
        input: ["101"],
        output: 5,
      },
      {
        input: ["1010"],
        output: 10,
      },
    ],
    defaultCode: "function solution(bin_str) { \n  return \n}",
  },
  {
    id: 100,
    title: "배열의 요소들을 뒤집은 후 합",
    description: "정수 배열 `arr`을 받아 뒤집은 후, 모든 요소의 합을 반환하는 함수를 작성하세요.",
    testCases: [
      {
        input: [[1, 2, 3]],
        output: 6,
      },
      {
        input: [[10, 20]],
        output: 30,
      },
    ],
    defaultCode: "function solution(arr) { \n  return \n}",
  },
];
