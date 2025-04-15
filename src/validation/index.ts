/**
 * 유효성 검사 관련 유틸리티 함수
 */

/**
 * 한국 주민등록번호 형식이 유효한지 검사합니다.
 * @param rrn 검사할 주민등록번호 (하이픈 포함 또는 미포함)
 * @returns 유효 여부
 */
export function isValidRRN(rrn: string): boolean {
  // 하이픈 제거 및 형식 확인
  const cleanRRN = rrn.replace(/-/g, '');
  if (!/^\d{13}$/.test(cleanRRN)) {
    return false;
  }

  // 생년월일 부분 검증
  const year = parseInt(cleanRRN.substring(0, 2));
  const month = parseInt(cleanRRN.substring(2, 4));
  const day = parseInt(cleanRRN.substring(4, 6));
  
  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 31) return false;

  // 체크섬 검증
  const digits = cleanRRN.split('').map(d => parseInt(d));
  const multipliers = [2, 3, 4, 5, 6, 7, 8, 9, 2, 3, 4, 5];
  
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += digits[i] * multipliers[i];
  }
  
  const checksum = (11 - (sum % 11)) % 10;
  return checksum === digits[12];
}

/**
 * 한국 휴대폰 번호 형식이 유효한지 검사합니다.
 * @param phone 검사할 휴대폰 번호 (하이픈 포함 또는 미포함)
 * @returns 유효 여부
 */
export function isValidPhoneNumber(phone: string): boolean {
  const cleanPhone = phone.replace(/-/g, '');
  return /^01[016789]\d{7,8}$/.test(cleanPhone);
}

/**
 * 이메일 주소 형식이 유효한지 검사합니다.
 * @param email 검사할 이메일 주소
 * @returns 유효 여부
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}
