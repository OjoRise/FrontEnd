import { ApiPlan } from "@/types/plan";
import api from "@/lib/axios";
import { SurveyRequest, SurveyResponse } from "@/types/survey";

/**
 * 사용자의 통신사에 따라 요금제 목록을 조회합니다.
 *
 * @param telecomProvider - 통신사 이름 (예: 'SKT', 'KT', 'LG')
 * @returns 해당 통신사의 요금제 리스트 (ApiPlan 배열)
 * @throws 요금제 조회 실패 시 에러를 throw합니다.
 */
export const Plans = async (telecomProvider: string): Promise<ApiPlan[]> => {
  try {
    const response = await api.get("/survey/plan", {
      params: { telecom_provider: telecomProvider },
    });
    return response.data;
  } catch (error) {
    console.error("통신사별 요금제 조회 Api 실패:", error);
    throw error;
  }
};

/**
 * 사용자의 설문 완료 상태를 서버에 true로 설정합니다.
 * 
 * PATCH /auth/survey/complete 요청을 통해 isSurvey 값을 false → true로 변경합니다.
 *
 * @returns 설문 완료 처리 결과 응답 데이터
 * @throws API 호출 실패 시 에러를 throw합니다.
 */
export async function IsSurvey() {
  try {
    const response = await api.patch("/auth/survey/complete");
    return response.data;
  } catch (error) {
    console.error("설문 완료 Api 실패:", error);
    throw error;
  }
}

/**
 * 설문 데이터를 서버에 전송합니다.
 *
 * @param data 사용자가 입력한 설문 정보 (SurveyRequest 타입)
 *  - birthdate(LocalDate): 생년월일 (예: 2025-06-12)
 *  - telecomProvider(ENUM): 통신사 이름 (예: "SKT", "KT", "LG")
 *  - planName(String): 사용 중인 요금제 이름 (예: 5G 스탠다드)
 *  - planPrice(Integer): 요금제 가격
 *  - familyBundle(ENUM): 가족 결합 의향 (예: "할 예정이에요", "안 할 예정이에요")
 *  - familyNum(ENUM): 가족 결합 인원 수 (예: '1대', '2대', '3대', '4대 이상')
 *
 * @returns 서버로부터 받은 응답 데이터
 * @throws 설문 전송 중 에러가 발생하면 예외를 throw합니다.
 */
export async function postSurvey(data: SurveyRequest) {
  try {
    const response = await api.post("/survey", data);
    return response.data;
  } catch (error) {
    console.error("설문 결과 전송 Api 실패:", error);
    throw error;
  }
}

/**
 * 설문 결과를 조회합니다.
 *
 * @returns 사용자의 설문 응답 결과 (SurveyResponse 타입)
 * @throws 설문 결과 조회 실패 시 예외를 throw합니다.
 */
export const getSurveyResult = async (): Promise<SurveyResponse> => {
  try {
    const response = await api.get("/survey/result");
    return response.data;
  } catch (error) {
    console.error("설문 결과 조회 실패:", error);
    throw error;
  }
};