# 통신사 전환 수요를 겨냥한 AI 요금제 추천 및 비교 서비스, YoPle

## 💡 개요
> 통신 서비스 장애로 인한 타 통신사 이동 수요 증가에 대응하여, **AI 기반 요금제 추천 및 비교 서비스** 제공
 </br>
> 간단한 테스트와 챗봇 UI를 통해 진입 장벽을 낮추고, 유플러스 요금제의 전환 유도율 극대화
 </br>
> 단발성 방문에도 효과적인 요금제 전환 유도를 목표로 설계
	
</div>

<br/>
<br/>

## 🔧 기능 소개 
**1. 회원 등록 및 관리 시스템** : **카카오 소셜 로그인**을 통한 간편 회원가입 및 인증

**2. 챗봇 기반 요금제 추천** : 사용자 프로필 기반으로 **AI 챗봇이 최적 요금제 추천**

**3. 기존 vs 추천 요금제 비교** : 음성통화, 데이터, 혜택 등 항목별로 **요금제 비교 시각화**

**4. 요금제 리스트 탐색 및 관심 요금제 설정** : **유플러스 요금제 리스트** 탐색 및 **관심 요금제 설정** 기능 지원

**5. 통BTI (통신 성향 테스트)** : **간단한 테스트**로 통신 성향 분석 → 챗봇 추천에 반영

**6. 요금제 나이 테스트** : 연령대 인기 요금제 기반으로 **요금제 나이 진단 및 추천**

**7. 마이페이지 (회원 정보 관리, 탈퇴)** : 사용자 정보 조회·수정, 회원 탈퇴 등 프로필 관리 기능
<br/>
<br/>

## ⚙️ 기술 스택
<kbd>
<img width="749" alt="스크린샷 2025-06-27 오전 4 01 29" src="https://github.com/user-attachments/assets/aef784f3-c3ae-48b3-ba98-cb390c4b0fcb" />
</kbd>



<br/>
<br/>
<br/>


## 🏛️ 디렉토리 구조
```
📦 src
├── app/                       # Next.js 라우트 엔트리
│   ├── (main-page)/           # 메인 페이지
│   ├── api/                   # API 라우트
│   ├── chat/                  # 챗봇 페이지
│   ├── explore-plans/         # 요금제 탐색
│   ├── login/                 # 로그인
│   ├── mypage/                # 마이페이지
│   ├── signup/                # 회원가입
│   ├── test-plan-age/         # 요금제 나이 테스트
│   ├── tongbti/               # 통BTI
│   ├── globals.css            # 전역 스타일
│   └── layout.tsx            # 앱 레이아웃 설정
│
├── components/                # UI 및 공통 컴포넌트 모음
│   ├── common/               # Header, Footer 등 범용 컴포넌트
│   ├── page-component/       # 페이지별 컴포넌트
│   └── ui/                   # 버튼, 모달 등 UI 단위 요소
│
├── fonts/                    # 프로젝트 전용 폰트
├── hooks/                    # 커스텀 훅 모음
├── lib/                      # 유틸성 라이브러리
├── prompt/                   # AI 프롬프트 텍스트 관리
├── services/                 # Axios 기반 API 서비스 함수
├── stores/                   # Zustand 상태 관리 스토어
├── styles/                   # Tailwind 및 전역 스타일 설정
├── types/                    # 전역 TypeScript 타입 정의
└── utils/                    # 공통 유틸 함수

```


<br/>
<br/>

## 📌 ERD
<kbd>
<img width="874" alt="스크린샷 2025-06-27 오전 4 04 24" src="https://github.com/user-attachments/assets/e8e95bcb-5bd3-41e3-bcb1-8c36818ace80" />
</kbd>
<p>
  🔗 <a href="https://www.erdcloud.com/d/BqysLiiqRsmuCCXbD" rel="nofollow">ERDCloud</a>  
</p>

<br/>
<br/>

</div>
</details>

<br>


## 👥 팀원

<table>
  <tr align="center">
    <td>김도건</td>
    <td>노수진</td>
    <td>배지아</td>
    <td>이다예</td>
    <td>진영호</td>
    <td>최윤혁</td>
  </tr>
  <tr>
     <td align="center">
        <a href="https://github.com/dogeonkim1">
          <img src="https://avatars.githubusercontent.com/u/87489341?v=4" width="150px" alt="김도건"/><br />
        </a>
     </td>
     <td align="center">
        <a href="https://github.com/sujinRo">
          <img src="https://avatars.githubusercontent.com/u/88073842?v=4" width="150px" alt="노수진"/><br />
        </a>
     </td>
     <td align="center">
        <a href="https://github.com/qowldk">
          <img src="https://avatars.githubusercontent.com/u/124412137?v=4" width="150px" alt="배지아"/><br />
        </a>
     </td>
     <td align="center">
        <a href="https://github.com/leedaye0412">
          <img src="https://avatars.githubusercontent.com/u/138192341?v=4" width="150px" alt="이다예"/><br />
        </a>
     </td>
    <td align="center">
        <a href="https://github.com/kuru2141">
          <img src="https://avatars.githubusercontent.com/u/149752689?v=4" width="150px" alt="진영호"/><br />
        </a>
     </td>
     <td align="center">
        <a href="https://github.com/yunhyuk-choi">
          <img src="https://avatars.githubusercontent.com/u/194174257?v=4" width="150px" alt="최윤혁"/><br />
        </a>
     </td>
  </tr>
</table>
