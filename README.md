# swingmobility-utils

## 간략한 소개

업무에 필요한 다양한 유틸리티 함수를 제공하는 TypeScript 패키지입니다. 개인정보 마스킹, 포맷팅, 유효성 검증, 배열 처리 등 자주 사용되는 기능들을 모듈화하여 제공합니다.

## 설치

다음과 같이 설치할 수 있습니다:

```bash
npm install swingmobility-utils
# 또는
yarn add swingmobility-utils
# 또는
pnpm add swingmobility-utils
```

## 사용법

패키지에서 필요한 함수를 import하여 사용합니다:

```typescript
import { maskName, formatCurrency, isValidEmail, removeDuplicates } from 'swingmobility-utils';
```

### 1. 마스킹 유틸리티

개인정보를 적절히 가리는 마스킹 함수들을 제공합니다.

```typescript
import { maskName, maskBirthDate, maskPhone, maskEmail } from 'swingmobility-utils';

// 이름 마스킹
maskName('홍길동'); // '홍*동'
maskName('김철수'); // '김*수'

// 생년월일 마스킹
maskBirthDate('19900101'); // '1990**01'
maskBirthDate('1990-01-01'); // '1990-**-01'

// 전화번호 마스킹
maskPhone('01012345678'); // '010****5678'

// 이메일 마스킹
maskEmail('example@gmail.com'); // 'ex*****@gmail.com'

// 주소 마스킹
maskToSigungu('서울특별시 구로구 구로로111길 111'); // '서울특별시 구로구 ****** ***'
```

### 2. 포맷 유틸리티

날짜, 금액 등을 한국어 형식으로 포맷팅합니다.

```typescript
import { formatCurrency, formatDate, formatNumber } from 'swingmobility-utils';

// 금액 포맷팅
formatCurrency(10000); // '₩10,000'

// 날짜 포맷팅
formatDate(new Date('2025-04-08')); // '2025. 4. 8.'

// 숫자 포맷팅 (천 단위 구분)
formatNumber(1234567); // '1,234,567'
```

### 3. 유효성 검사 유틸리티

다양한 입력값의 유효성을 검사합니다.

```typescript
import { isValidEmail, isValidPhoneNumber, isValidRRN } from 'swingmobility-utils';

// 이메일 검증
isValidEmail('user@example.com'); // true
isValidEmail('invalid-email'); // false

// 전화번호 검증
isValidPhoneNumber('01012345678'); // true
isValidPhoneNumber('010-1234-5678'); // true

// 주민등록번호 검증
isValidRRN('9001011234567'); // 유효성에 따라 true/false 반환
```

### 4. 배열 유틸리티

배열 처리에 유용한 함수들을 제공합니다.

```typescript
import { removeDuplicates, chunk, sortByProperty } from 'swingmobility-utils';

// 중복 제거
removeDuplicates([1, 2, 2, 3, 3, 4]); // [1, 2, 3, 4]

// 배열 청크로 분할
chunk([1, 2, 3, 4, 5, 6], 2); // [[1, 2], [3, 4], [5, 6]]

// 객체 배열 정렬
const users = [
  { name: '김철수', age: 30 },
  { name: '이영희', age: 25 }
];
sortByProperty(users, 'age'); // age 기준 오름차순 정렬
```

## 패키지 빌드 방법

패키지를 수정한 후에는 재빌드가 필요합니다:

```bash
# 패키지 디렉토리에서 실행
npm run build

# 또는 yarn/pnpm 사용 시
yarn build
pnpm build
```

## 실제 사용 예시

### React 컴포넌트에서 활용

```tsx
import React from 'react';
import { maskName, maskPhone, formatCurrency } from 'swingmobility-utils';

function UserTable({ users }) {
  return (
    <table>
      <thead>
        <tr>
          <th>이름</th>
          <th>연락처</th>
          <th>잔액</th>
        </tr>
      </thead>
      <tbody>
        {users.map(user => (
          <tr key={user.id}>
            <td>{maskName(user.name)}</td>
            <td>{maskPhone(user.phone)}</td>
            <td>{formatCurrency(user.balance)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

## 구조

```
/
├── dist/                # 빌드된 파일 (자동 생성)
├── src/                 # 소스 코드
│   ├── index.ts         # 모든 함수를 export
│   ├── mask/            # 마스킹 유틸리티
│   │   ├── index.ts     # 마스킹 함수 구현
│   │   └── mask.test.ts # 테스트 코드
│   ├── format/          # 포맷팅 유틸리티
│   │   └── index.ts     # 포맷팅 함수 구현
│   ├── validation/      # 유효성 검사 유틸리티
│   │   └── index.ts     # 검증 함수 구현
│   └── array/           # 배열 유틸리티
│       └── index.ts     # 배열 관련 함수 구현
├── package.json         # 패키지 설정
├── tsconfig.json        # TypeScript 설정
└── README.md            # 문서
```

## 유틸 추가 방법

### 1. 기존 카테고리에 함수 추가

이미 존재하는 카테고리에 새 함수를 추가하려면:

```typescript
// src/array/index.ts에 새 함수 추가
export function filterByProperty<T>(array: T[], property: keyof T, value: any): T[] {
  return array.filter(item => item[property] === value);
}
```

### 2. 새 카테고리 추가

새로운 종류의 유틸리티가 필요하면:

1. 새 디렉토리 생성
```bash
mkdir -p src/새카테고리명
```

2. index.ts 파일 생성
```typescript
// src/새카테고리명/index.ts
/**
 * 새 카테고리 관련 유틸리티 함수
 */

export function 새함수명(...) {
  // 구현
}
```

3. 메인 index.ts에 내보내기 추가
```typescript
// src/index.ts
export * from './새카테고리명';
```

4. 빌드 및 테스트
```bash
npm run build
npm test
```

5. 패키지 배포
```bash
npm version patch # 또는 minor/major
npm publish
```
