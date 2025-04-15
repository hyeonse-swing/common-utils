/**
 * 이름 마스킹 함수
 * 규칙:
 * - 1자리: 그대로 출력
 * - 2자리: 첫 글자 + '*'
 * - 3자리: 첫 글자 + '*' + 마지막 글자
 * - 4자리 이상: 뒷 2자리를 '**'로 대체
 */
export const maskName = (name?: string): string => {
  if (!name) return '-';
  const len = name.length;
  if (len === 1) return name;
  if (len === 2) return `${name[0]}*`;
  if (len === 3) return `${name[0]}*${name[2]}`;
  return `${name.slice(0, -2)}**`;
};

/**
 * 생년월일 마스킹 함수
 * 규칙:
 * - "YYYYMMDD" 형식: YYYY + '**' + DD
 * - "YYYY-MM-DD" 형식: YYYY-**-DD
 */
export const maskBirthDate = (birth?: string): string => {
  if (!birth) return '-';
  if (birth.length === 8 && /^\d{8}$/.test(birth)) {
    return `${birth.slice(0, 4)}**${birth.slice(6)}`;
  }
  if (birth.length === 10 && birth.includes('-')) {
    const parts = birth.split('-');
    if (parts.length === 3) {
      return `${parts[0]}-**-${parts[2]}`;
    }
  }
  return birth;
};

/**
 * 전화번호 마스킹 함수
 * @param phone 전화번호(문자열 또는 숫자)
 * @param hasHyphen 하이픈 추가 여부 (기본값: true)
 * @param showErrorPattern 잘못된 전화번호 패턴 반환 여부 (기본값: true)
 * @returns 마스킹된 전화번호 또는 오류 패턴
 */
export const maskPhone = (
  phone?: string | number,
  hasHyphen: boolean = false,
  showErrorPattern: boolean = true
): string => {
  if (!phone) return '-';

  let number = String(phone).replace(/\D/g, '');

  // 번호가 8자리 이하 또는 12자리 이상이면 오류 패턴으로 반환
  if (number.length <= 8 || number.length > 12) {
    return showErrorPattern ? number : '-';
  }

  // 국번 길이 결정 (자릿수 기준)
  let areaLen = 3;
  if (number.startsWith('0')) {
    if (number.length === 12) areaLen = 4;
    else if (number.length === 11) areaLen = 3;
    else if (number.length <= 10) areaLen = 2;
  } else {
    if (number.length === 12) areaLen = 4;
  }

  const area = number.slice(0, areaLen);
  const remain = number.slice(areaLen);
  const last = remain.slice(-4);
  let midLen = remain.length - 4;
  if (midLen < 3) midLen = 3;
  const mid = '*'.repeat(midLen);

  const masked = hasHyphen
    ? `${area}-${mid}-${last}`
    : `${area}${mid}${last}`;

  return masked;
};

/**
 * 이메일 마스킹 함수
 * 규칙: 로컬 파트('@' 앞)에서 앞 2자리는 그대로, 나머지를 '*'로 대체 (도메인은 그대로)
 * 예: "example@gmail.com" → "ex*****@gmail.com"
 */
export const maskEmail = (email?: string): string => {
  if (!email) return '-';
  const [local, domain] = email.split('@');
  if (!domain) return email;
  if (local.length <= 2) return `${local}@${domain}`;
  return `${local.slice(0, 2)}${'*'.repeat(local.length - 2)}@${domain}`;
};

/**
 * 주소 마스킹 함수
 * 규칙: 시/군/구까지만 표기하고, 그 이하(동, 도로명, 번지 등)는 길이에 맞춰 '*'로 마스킹 처리
 * 예: 
 *  - "서울특별시 구로구 구로로111길 111" → "서울특별시 구로구 ****** ***"
 *  - "경기도 용인시 용인구 용용용동 123" → "경기도 용인시 용인구 **** ***"
 */
export const maskToSigungu = (address?: string): string => {
  if (!address) return '-';

  const tokens = address.trim().split(/\s+/);
  if (tokens.length < 2) return address;

  const resultParts: string[] = [tokens[0]];

  let i = 1;
  for (; i < tokens.length; i++) {
    if (/(시|군|구)$/.test(tokens[i])) {
      resultParts.push(tokens[i]);
    } else {
      break;
    }
  }

  const maskedParts = tokens.slice(i).map(part => '*'.repeat(part.length));
  return resultParts.concat(maskedParts).join(' ');
};

/**
 * 주민등록번호 마스킹 함수
 * 규칙: 13자리 주민등록번호에서, 생년월일인 6자리와 성별 구분코드인 1자리가 그대로, 나머지 7자리는 '*'로 마스킹
 * -가 빠진 경우: "1234561234567" → "123456-1******"
 * 예: "123456-1234567" → "123456-1******"
 */
export const maskRRN = (rrn?: string): string => {
  if (!rrn) return '-';
  const cleaned = rrn.replace(/\D/g, '');
  if (cleaned.length !== 13) return '-';
  return `${cleaned.slice(0, 6)}-${cleaned.slice(6, 7)}******`;
};

/**
 * 계좌번호 마스킹 함수
 * 규칙: 첫 4자리 끝 4자리가 그대로, 나머지 가운데 자리는는 '*'로 마스킹
 */
export const maskAccount = (account?: string): string => {
  if (!account) return '-';
  const cleaned = account.replace(/\D/g, '');
  if (cleaned.length < 8) return '-';
  return `${cleaned.slice(0, 4)}${'*'.repeat(cleaned.length - 8)}${cleaned.slice(-4)}`;
};
