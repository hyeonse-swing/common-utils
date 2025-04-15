/**
 * 배열 관련 유틸리티 함수
 */

/**
 * 배열에서 중복 요소를 제거합니다.
 */
export function removeDuplicates<T>(array: T[]): T[] {
  return [...new Set(array)];
}

/**
 * 배열을 지정된 크기의 청크로 분할합니다.
 */
export function chunk<T>(array: T[], size: number): T[][] {
  return Array.from(
    { length: Math.ceil(array.length / size) },
    (_, i) => array.slice(i * size, i * size + size)
  );
}

/**
 * 배열을 지정된 프로퍼티를 기준으로 정렬합니다.
 */
export function sortByProperty<T>(array: T[], property: keyof T): T[] {
  return [...array].sort((a, b) => 
    a[property] > b[property] ? 1 : -1
  );
}