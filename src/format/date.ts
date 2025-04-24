/**
 * 날짜 및 요일 관련 유틸리티 함수
 */

/** 
 * 요일 타입 정의 (숫자로 0-6, 일요일부터 시작)
 */
export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/**
 * 요일 형식 타입
 */
export type DayFormat = 
  | 'ko-short'      // 한국어 축약 (월, 화, 수...)
  | 'ko-long'       // 한국어 전체 (월요일, 화요일...)
  | 'en-short'      // 영어 축약 소문자 (mon, tue...)
  | 'en-short-caps' // 영어 축약 대문자 (MON, TUE...)
  | 'en-long'       // 영어 전체 소문자 (monday, tuesday...)
  | 'en-long-caps'; // 영어 전체 대문자 (MONDAY, TUESDAY...)

// 요일 매핑 정보
const DAY_MAPPINGS: Record<DayFormat, readonly string[]> = {
  'ko-short': ['일', '월', '화', '수', '목', '금', '토'],
  'ko-long': ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
  'en-short': ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'],
  'en-short-caps': ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'],
  'en-long': ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
  'en-long-caps': ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY']
};

/**
 * Date 객체에서 요일을 추출하여 원하는 형식으로 반환합니다.
 * 
 * @param date 날짜 객체
 * @param format 요일 형식 ('ko-short', 'ko-long', 'en-short', 'en-short-caps', 'en-long', 'en-long-caps')
 * @returns 지정된 형식의 요일 문자열
 * 
 * @example
 * // 오늘이 월요일인 경우
 * getDayOfWeek(new Date(), 'ko-short') // '월'
 * getDayOfWeek(new Date(), 'ko-long') // '월요일'
 * getDayOfWeek(new Date(), 'en-short') // 'mon'
 */
export function getDayOfWeek(date: Date, format: DayFormat = 'ko-short'): string {
  const dayIndex = date.getDay() as DayOfWeek;
  return DAY_MAPPINGS[format][dayIndex];
}

/**
 * 특정 요일 문자열을 다른 형식으로 변환합니다.
 * 
 * @param day 변환할 요일 문자열 (예: '월', '월요일', 'mon', 'MON', 'monday' 등)
 * @param targetFormat 변환할 대상 형식
 * @returns 변환된 요일 문자열, 일치하는 요일이 없으면 null 반환
 * 
 * @example
 * convertDayFormat('월', 'en-short') // 'mon'
 * convertDayFormat('monday', 'ko-long') // '월요일'
 */
export function convertDayFormat(day: string, targetFormat: DayFormat): string | null {
  // 입력된 요일 문자열의 형식과 인덱스 찾기
  let foundFormat: [DayFormat, string[]] | null = null;
  let dayIndex = -1;
  
  // Object.entries() 대신 직접 DAY_MAPPINGS 객체를 순회
  const formats = Object.keys(DAY_MAPPINGS) as DayFormat[];
  
  for (const format of formats) {
    const days = DAY_MAPPINGS[format];
    const index = days.indexOf(day as string);
    if (index !== -1) {
      foundFormat = [format, days as unknown as string[]];
      dayIndex = index;
      break;
    }
  }
  
  if (!foundFormat || dayIndex === -1) return null;
  
  return DAY_MAPPINGS[targetFormat][dayIndex];
}

/**
 * 요일 문자열로부터 Date 객체의 요일 인덱스(0-6)를 반환합니다.
 * 
 * @param day 요일 문자열 (모든 형식 가능)
 * @returns 요일 인덱스 (0: 일요일, 1: 월요일, ...), 일치하는 요일이 없으면 null 반환
 * 
 * @example
 * getDayIndex('월') // 1
 * getDayIndex('Monday') // 1
 */
export function getDayIndex(day: string): DayOfWeek | null {
  // Object.entries() 대신 Object.keys()와 직접 접근 사용
  const formats = Object.keys(DAY_MAPPINGS) as DayFormat[];
  
  for (const format of formats) {
    const days = DAY_MAPPINGS[format];
    const index = days.indexOf(day as string);
    if (index !== -1) {
      return index as DayOfWeek;
    }
  }
  return null;
}

/**
 * 특정 날짜의 해당 주의 모든 요일 날짜를 배열로 반환합니다.
 * 
 * @param date 기준 날짜
 * @param startFromSunday 일요일부터 시작할지 여부 (기본값: true)
 * @returns 해당 주의 날짜 배열
 * 
 * @example
 * // 2025-04-24 (목요일)을 기준으로 하는 경우
 * getWeekDays(new Date('2025-04-24')) 
 * // [2025-04-20(일), 2025-04-21(월), ..., 2025-04-26(토)]
 */
export function getWeekDays(date: Date, startFromSunday = true): Date[] {
  const result: Date[] = [];
  const currentDate = new Date(date);
  const currentDay = currentDate.getDay();
  
  // 주의 시작일로 이동
  const startDay = startFromSunday ? 0 : 1;
  const diff = currentDay - startDay;
  const offsetDays = diff < 0 ? diff + 7 : diff;
  
  currentDate.setDate(currentDate.getDate() - offsetDays);
  
  // 주의 모든 날짜 추가
  for (let i = 0; i < 7; i++) {
    const weekDate = new Date(currentDate);
    weekDate.setDate(currentDate.getDate() + i);
    result.push(weekDate);
  }
  
  return result;
}

/**
 * 두 날짜가 같은 요일인지 확인합니다.
 * 
 * @param date1 첫번째 날짜
 * @param date2 두번째 날짜
 * @returns 같은 요일이면 true, 아니면 false
 * 
 * @example
 * isSameDay(new Date('2025-04-21'), new Date('2025-04-28')) // true (둘 다 월요일)
 */
export function isSameDayOfWeek(date1: Date, date2: Date): boolean {
  return date1.getDay() === date2.getDay();
}

/**
 * 특정 요일에 해당하는 가장 가까운 날짜를 찾습니다.
 * 
 * @param targetDay 찾을 요일 (요일 문자열 - 모든 형식 가능)
 * @param baseDate 기준 날짜 (기본값: 현재 날짜)
 * @param searchForward 앞으로 검색할지 여부 (true: 미래 방향, false: 과거 방향)
 * @returns 가장 가까운 해당 요일의 날짜
 * 
 * @example
 * // 오늘이 목요일인 경우
 * getNextDayOfWeek('월') // 다음 월요일
 * getNextDayOfWeek('월', undefined, false) // 지난 월요일
 */
export function getNextDayOfWeek(
  targetDay: string, 
  baseDate = new Date(), 
  searchForward = true
): Date | null {
  const targetDayIndex = getDayIndex(targetDay);
  
  if (targetDayIndex === null) {
    return null;
  }
  
  const result = new Date(baseDate);
  const currentDayIndex = result.getDay();
  
  let daysToAdd: number;
  
  if (searchForward) {
    // 미래 방향 검색
    daysToAdd = (targetDayIndex - currentDayIndex + 7) % 7;
    if (daysToAdd === 0) daysToAdd = 7; // 같은 요일인 경우 다음 주로
  } else {
    // 과거 방향 검색
    daysToAdd = (targetDayIndex - currentDayIndex - 7) % 7;
    if (daysToAdd === 0) daysToAdd = -7; // 같은 요일인 경우 지난 주로
  }
  
  result.setDate(result.getDate() + daysToAdd);
  return result;
}

/**
 * 특정 날짜가 주말인지 확인합니다.
 * 
 * @param date 확인할 날짜
 * @returns 주말(토요일 또는 일요일)이면 true, 아니면 false
 * 
 * @example
 * isWeekend(new Date('2025-04-26')) // true (토요일)
 */
export function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6; // 0: 일요일, 6: 토요일
}

/**
 * 특정 날짜가 평일인지 확인합니다.
 * 
 * @param date 확인할 날짜
 * @returns 평일(월~금)이면 true, 아니면 false
 * 
 * @example
 * isWeekday(new Date('2025-04-24')) // true (목요일)
 */
export function isWeekday(date: Date): boolean {
  return !isWeekend(date);
}

/**
 * Date 객체에 특정 시간(시)를 더하는 유틸리티 함수
 * 
 * @param date 기준 날짜
 * @param hours 더할 시간(시)
 * @returns 시간이 추가된 새로운 Date 객체
 */
function addHours(date: Date, hours: number): Date {
  const result = new Date(date);
  result.setHours(result.getHours() + hours);
  return result;
}

/**
 * Date 객체에서 특정 일수를 빼는 유틸리티 함수
 * 
 * @param date 기준 날짜
 * @param days 빼는 일수
 * @returns 일수가 감소된 새로운 Date 객체
 */
function subtractDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() - days);
  return result;
}

/**
 * 두 날짜가 같은 일자인지 확인하는 함수 (시간 제외)
 * 
 * @param date1 첫번째 날짜
 * @param date2 두번째 날짜
 * @returns 같은 일자면 true, 아니면 false
 */
function isSameDay(date1: Date, date2: Date): boolean {
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate();
}

/**
 * Unix 타임스킬프(초 단위)를 Date 객체로 변환
 * 
 * @param timestamp Unix 타임스킬프(초 단위)
 * @returns Date 객체
 */
function fromUnixTime(timestamp: number): Date {
  return new Date(timestamp * 1000);
}

/**
 * Date 객체가 유효한지 확인
 * 
 * @param date 확인할 날짜 객체
 * @returns 유효한 날짜면 true, 아니면 false
 */
function isValidDate(date: Date): boolean {
  return !isNaN(date.getTime());
}

/**
 * 날짜를 지정된 형식으로 포맷팅
 * 
 * @param date 포맷팅할 날짜
 * @param formatStr 포맷 문자열 (yyyy: 년, MM: 월(2자리), M: 월, dd: 일(2자리), d: 일)
 * @returns 포맷팅된 문자열
 */
function formatDate(date: Date, formatStr: string): string {
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // 월은 0부터 시작하므로 +1
  const day = date.getDate();
  
  // 2자리 형식 함수 (padStart 교체)
  const pad2 = (num: number): string => {
    return num < 10 ? `0${num}` : num.toString();
  };
  
  // 기본 포맷 패턴 처리
  return formatStr
    .replace(/yyyy/g, year.toString())
    .replace(/MM/g, pad2(month))
    .replace(/M/g, month.toString())
    .replace(/dd/g, pad2(day))
    .replace(/d/g, day.toString());
}

/**
 * 날짜의 월에서 몫 주차인지 계산 (1일이 있는 주가 1주차)
 * 
 * @param date 날짜 객체
 * @returns 주차 숫자
 */
function getWeekOfMonth(date: Date): number {
  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const dayOfMonth = date.getDate();
  
  // 월의 첫달의 요일 (0: 일요일, 6: 토요일)
  const firstDayOfWeek = firstDayOfMonth.getDay();
  
  // 첫 주에 몇 일이 있는지 계산 (7 - firstDayOfWeek)
  const daysInFirstWeek = 7 - firstDayOfWeek;
  
  // 첫주에 포함되지 않는 경우
  if (dayOfMonth > daysInFirstWeek) {
    return Math.ceil((dayOfMonth - daysInFirstWeek) / 7) + 1;
  }
  
  // 첫주에 포함되는 경우
  return 1;
}

/**
 * 한국 표준시(KST)를 기준으로 날짜 문자열을 반환합니다.
 * 사용자의 로컬 시간대와 관계없이 항상 KST 기준으로 계산합니다.
 * 
 * @returns "YYYY-MM-DD" 형태의 KST 기준 날짜 문자열
 * 
 * @example
 * getKstDateString() // "2025-04-24"
 */
export function getKstDateString(): string {
  // KST는 UTC+9 이므로, 현재 시각에 9시간을 더해서 KST 기준 시각으로 만듭니다.
  const now = new Date();
  const kstTime = addHours(now, 9);

  // "yyyy-MM-dd" 형태로 포맷팅
  return kstTime.toISOString().split('T')[0];
}

/**
 * 날짜가 선택 불가능한 날짜인지 반환합니다.
 * 
 * @param date 선택된 Date 객체
 * @param startDateStr 시작일 문자열 ("YYYY-MM-DD")
 * @param endDateStr 종료일 문자열 ("YYYY-MM-DD")
 * @param today 기준 날짜 (default: new Date())
 * @returns 불가능한 날짜면 true, 가능하면 false
 * 
 * @example
 * isDateDisabled(new Date('2025-04-30'), '2025-04-24', '2025-04-28') // true (범위 밖)
 */
export function isDateDisabled(
  date: Date,
  startDateStr: string,
  endDateStr: string,
  today: Date = new Date()
): boolean {
  // 빈 문자열이면 today를 사용합니다.
  const start = startDateStr ? new Date(startDateStr) : today;
  const end = endDateStr ? new Date(endDateStr) : today;

  const endIsToday = isSameDay(end, today);
  const isStartSameAsEnd = isSameDay(start, end);

  // 시작일과 종료일이 동일하면, 해당 날짜만 선택 가능
  if (isStartSameAsEnd) {
    return !isSameDay(date, start);
  }

  // 종료일이 오늘이면 오늘만 선택 가능
  if (endIsToday) {
    return !isSameDay(date, today);
  }

  // 그 외의 경우: 시작일 부터, 종료일 이후, 또는 오늘 전날보다 이전이면 선택 불가
  return date < start || date > end || date < subtractDays(today, 1);
}

/**
 * 기본으로 열릴 Date 객체를 반환합니다.
 * 
 * @param startDateStr 시작일 문자열 ("YYYY-MM-DD")
 * @param endDateStr 종료일 문자열 ("YYYY-MM-DD")
 * @param today 기준 날짜 (default: new Date())
 * @returns 기본으로 표시할 달(월)의 Date 객체
 * 
 * @example
 * getDefaultOpenMonth('2025-03-15', '2025-04-28') // 2025-03-15 또는 today 에 따라 적절한 날짜
 */
export function getDefaultOpenMonth(
  startDateStr: string,
  endDateStr: string,
  today: Date = new Date()
): Date {
  // 빈 문자열이면 today를 사용합니다.
  const start = startDateStr ? new Date(startDateStr) : today;
  const end = endDateStr ? new Date(endDateStr) : today;

  if (start < today) return start;
  if (end > today) return end;
  return today;
}

/**
 * 주차를 한글로 변환하여 반환합니다.
 * 
 * @param date Date 객체
 * @returns "YYYY년 MM월 N주차" 형태의 문자열
 * 
 * @example
 * getKoreanWeekOfMonth(new Date('2025-04-24')) // "2025년 4월 4주차"
 */
export function getKoreanWeekOfMonth(date: Date): string {
  const year = date.getFullYear().toString(); // 예: "2023"
  const month = (date.getMonth() + 1).toString(); // 예: "5" (1~12)
  const week = getWeekOfMonth(date); // 예: 2 (몫 주차인지 숫자로 반환)

  return `${year}년 ${month}월 ${week}주차`;
}

/**
 * 날짜 포맷팅을 안전하게 처리하는 함수
 * 유효하지 않은 날짜나 오류 발생 시 '-'를 반환합니다.
 * 
 * @param dateValue 날짜 값 (문자열, 타임스태프, undefined 등)
 * @param formatString 포맷 문자열 (yyyy: 년, MM: 월(2자리), dd: 일(2자리) 등)
 * @returns 포맷팅된 날짜 문자열 또는 '-'
 * 
 * @example
 * formatSafeDate('2025-04-24', 'yyyy년 MM월 dd일') // "2025년 04월 24일"
 * formatSafeDate(1714022400, 'yyyy/MM/dd') // "2024/04/25"
 * formatSafeDate(undefined, 'yyyy/MM/dd') // "-"
 */
export function formatSafeDate(
  dateValue: string | number | undefined,
  formatString: string
): string {
  // 값이 없으면 "-" 반환
  if (!dateValue) return '-';

  let date;

  try {
    // 타임스태프 숫자 또는 숫자 문자열인 경우
    if (typeof dateValue === 'number' || !isNaN(Number(dateValue))) {
      const timestamp = Number(dateValue);

      // 밀리초 단위(13자리)인지 초 단위(10자리)인지 확인
      date =
        timestamp > 1000000000000
          ? new Date(timestamp)
          : fromUnixTime(timestamp);
    } else {
      // 문자열이나 Date 객체인 경우
      date = new Date(dateValue);
    }

    // 유효한 날짜인지 확인
    if (!isValidDate(date)) return '-';

    return formatDate(date, formatString);
  } catch (error) {
    console.error('날짜 포맷팅 오류:', error);
    return '-';
  }
}

/**
 * Date 객체를 Unix Epoch 시간(초 단위)으로 변환합니다.
 * 
 * @param date 변환할 Date 객체
 * @returns 초 단위의 Unix 타임스킬프
 * 
 * @example
 * dateToUnixEpoch(new Date('2025-04-24T00:00:00Z')) // 1745222400
 */
export function dateToUnixEpoch(date: Date): number {
  return Math.floor(date.getTime() / 1000);
}

/**
 * Unix Epoch 시간(초 단위)을 밀리초 단위로 변환합니다.
 * 
 * @param epochSeconds 초 단위 Unix 타임스킬프
 * @returns 밀리초 단위 타임스킬프
 * 
 * @example
 * unixEpochToMilliseconds(1745222400) // 1745222400000
 */
export function unixEpochToMilliseconds(epochSeconds: number): number {
  return epochSeconds * 1000;
}

/**
 * Unix Epoch 시간(초 단위)을 Date 객체로 변환합니다.
 * 
 * @param epochSeconds 초 단위 Unix 타임스킬프
 * @returns 변환된 Date 객체
 * 
 * @example
 * unixEpochToDate(1745222400) // new Date('2025-04-24T00:00:00Z')
 */
export function unixEpochToDate(epochSeconds: number): Date {
  return new Date(epochSeconds * 1000);
}

/**
 * Epoch 밀리초를 Date 객체로 변환합니다.
 * 
 * @param epochMilliseconds 밀리초 단위 타임스킬프
 * @returns 변환된 Date 객체
 * 
 * @example
 * epochMillisecondsToDate(1745222400000) // new Date('2025-04-24T00:00:00Z')
 */
export function epochMillisecondsToDate(epochMilliseconds: number): Date {
  return new Date(epochMilliseconds);
}

/**
 * Epoch 밀리초를 지정된 형식의 문자열로 포맷팅합니다.
 * 
 * @param epochMilliseconds 밀리초 단위 타임스킬프
 * @param format 포맷 문자열 (기본값: 'yyyy-MM-dd')
 * @returns 포맷팅된 날짜 문자열
 * 
 * @example
 * formatEpochMilliseconds(1745222400000) // "2025-04-24"
 * formatEpochMilliseconds(1745222400000, 'yyyy년 MM월 dd일') // "2025년 04월 24일"
 */
export function formatEpochMilliseconds(
  epochMilliseconds: number,
  format: string = 'yyyy-MM-dd'
): string {
  const date = new Date(epochMilliseconds);

  // 2자리 형식 함수
  const pad2 = (num: number): string => {
    return num < 10 ? `0${num}` : String(num);
  };

  // 'yyyy-MM-dd' 형식으로 포맷팅
  const year = date.getFullYear();
  const month = pad2(date.getMonth() + 1);
  const day = pad2(date.getDate());

  return format
    .replace(/yyyy/g, String(year))
    .replace(/MM/g, month)
    .replace(/dd/g, day);
}
