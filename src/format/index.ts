/**
 * 포맷 관련 유틸리티 함수
 */

/**
 * 금액을 한국어 통화 형식으로 포맷팅합니다.
 * @param amount 포맷팅할 금액
 * @returns 포맷팅된 금액 문자열 (예: "₩10,000")
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
    currencyDisplay: 'symbol' as const,
  } as Intl.NumberFormatOptions).format(amount);
}

/**
 * 날짜를 한국어 형식으로 포맷팅합니다.
 * @param date 포맷팅할 날짜
 * @param options 포맷 옵션
 * @returns 포맷팅된 날짜 문자열 (예: "2025. 4. 8.")
 */
export function formatDate(
  date: Date, 
  options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'numeric', day: 'numeric' }
): string {
  return new Intl.DateTimeFormat('ko-KR', options).format(date);
}

/**
 * 숫자에 천 단위 구분 기호를 추가합니다.
 * @param num 포맷팅할 숫자
 * @returns 천 단위 구분 기호가 포함된 문자열 (예: "1,234,567")
 */
export function formatNumber(num: number): string {
  return num.toLocaleString('ko-KR');
}
