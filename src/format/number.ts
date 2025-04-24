/**
 * 숫자 포맷팅 관련 유틸리티 함수
 */

/**
 * 숫자에 천 단위 구분 기호를 추가합니다.
 * @param num 포맷팅할 숫자
 * @returns 천 단위 구분 기호가 포함된 문자열 (예: "1,234,567")
 */
export function formatNumber(num: number): string {
  return num.toLocaleString('ko-KR');
}
