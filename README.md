<h1 align="center">DJDN-Frontend에 오신 것을 환영합니다!👋</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000" />
  <a href=" " target="_blank">
    <img alt="Documentation" src="https://img.shields.io/badge/documentation-yes-brightgreen.svg" />
  </a>
</p>




<img src = "https://user-images.githubusercontent.com/65855364/120516866-cc39f700-c40a-11eb-8f12-849773e1ffb1.png" width="30%">

## 개요
> 1인 가구의 비율이 늘어남에 따라 일상생활 중 크고 작은 도움을 필요로 하는 경우가 생기며 전문 업체에 맡기기에는 금액이 부담스럽거나 해결하기 간단한 일들이 빈번히 발생한다. 
이에 따라 같은 동네에서 문제를 해결해 줄 사람을 찾는 일이 필요해졌다.
'다재다능'은 위치 기반 재능 거래 플랫폼이다.
따라서 '다재다능'을 통해 도움을 필요한 사용자와 문제를 해결해 줄 능력을 가진 다른 사용자와 매칭해주는 서비스를 제공받을 수 있다.



## 주요 기술 
```sh
* Frontend
    - React-native
* Backend
    - Node.js(Express)
* DB
    - MongoDB
    - Amazon S3
* 외부 서비스
    - KaKao Map API
    - IamPort API
    - Firebase Cloud Messaging
    - Socket.IO
    - Naver Cloud Platform SENS
```


## Enviroment
```sh
* npm >= 6.14.11
* react-native-cli = 2.0.1
* react-native = 0.64.2

```

## Before start
./src/smskey.js 파일 생성 후 다음과 같이 설정이 필요합니다.

```sh
const smsKey = {
	accessKey: ,
	secretKey: ,
	phoneNumber: ,
	serviceId: 
}
export default smsKey
```
./src/Key.js 파일 생성 후 다음과 같이 설정이 필요합니다.

```sh
const S3Key = {
    accessKey: ,
    secretKey: 
}
export default S3Key
```


## Install

```sh
npm install
```

## Usage

```sh
npm run android 
```

---------------------------------
## 기능

### * 재능구매자
```sh
- 로그인 및 회원가입
- 동네 인증 및 동네 선택
- 재능 거래 게시물 생성
- 1:1 채팅 및 채팅알림
- 거래 설정 (거래 위치 및 시간 설정)
- 사용자 평가
- 자동 신고
```

### * 재능판매자
```sh
- 로그인 및 회원가입
- 동네 인증 및 동네 선택
- 게시글 검색 반경 설정 (+ 필터 및 카테고리 설정)
- 게시글 검색
- 1:1 채팅 및 채팅알림
- 거래 설정 (거래 위치 및 시간 설정)
- 사용자 평가
- 자동 신고
```
#### * 소상공인
```sh
- 광고비 결제 (광고 포인트 충전)
- 광고 신청
- 광고 규칙설정 및 활성/비활성화
```

#### * 관리자
```sh
- 게시글 및 사용자 신고 관리
- 신청 광고 관리
```

#### * 사용자 공통
```sh
- 프로필 수정
- 재능구매/판매 내역 확인
- 게시물/사용자 신고
- 자격증 등록
```

## Author

👤 **김영웅**, **나준엽**, **윤태섭**, **이병훈**, **정수범**

* Github: [@Kim234](https://github.com/Kim234), [@junyeoop](https://github.com/junyeoop), [@styy1124](https://github.com/styy1124), [@LeeByeongHoon](https://github.com/LeeByeongHoon), [@teller2016](https://github.com/teller2016)


## Show your support

프로젝트가 도움이 되었다면 ⭐️ 을 눌러주세요!

***
_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_





