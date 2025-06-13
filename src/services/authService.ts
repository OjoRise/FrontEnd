import api from "@/lib/axios";
import { fetchRecommendedPlans } from "./recommenendPlanService";
import { useAuthStore } from "@/stores/authStore";
import { fetchLikedPlans } from "./dipPlanService";

export async function handleLoginSuccess(accessToken: string) {
  localStorage.setItem("accessToken", accessToken);

  const { login } = useAuthStore.getState();
  login();

  let localRecommendations: string[] = [];
  try {
    const stored = localStorage.getItem("planList");
    if (stored) {
      localRecommendations = JSON.parse(stored);
    }
  } catch (e) {
    console.error("planList 파싱 실패:", e);
  }
  console.log(localRecommendations);
  if (localRecommendations.length > 0) {
    try {
      await api.post("/api/recommendations", {
        planNames: localRecommendations,
      });
      localStorage.removeItem("planList");
    } catch (err) {
      console.error("추천 요금제 동기화 실패", err);
    }
  }

  try {
    await fetchRecommendedPlans();
  } catch (err) {
    console.error("추천 목록 가져오기 실패:", err);
  }

  try {
    await fetchLikedPlans();
  } catch (err) {
    console.error("찜한 요금제 가져오기 실패:", err);
  }
}
