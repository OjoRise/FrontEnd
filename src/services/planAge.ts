import api from "@/lib/axios";

/**
 * 요금제 나이 테스트 결과를 조회합니다.
 *
 * @returns 서버로부터 받은 요금제 나이 결과 데이터 (예: age)
 * @throws 조회 중 에러가 발생하면 예외를 throw합니다.
 */
export const planAge = async () => {
  try {
    const response = await api.get("/age/result");
    return response.data;
  } catch (error) {
    console.error("요금제 나이 테스트 결과 조회 Api 실패:", error);
    throw error;
  }
};