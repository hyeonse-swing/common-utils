/**
 * 통화 관련 포맷팅 유틸리티 함수
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
