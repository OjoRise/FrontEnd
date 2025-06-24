import api from "@/lib/axios";
import { usePlanStore } from "@/stores/usePlanStore";
import { Plan } from "@/types/plan";

export async function fetchRecommendedPlans() {
  const res = await api.get<Plan[]>("/api/recommendations");

  const refinedPlans = res.data;

  usePlanStore.getState().setRecommendedPlans(refinedPlans);
}

export async function deleteRecommendedPlan(planId: number): Promise<boolean> {
  await api.delete(`/api/recommendations/${planId}`);
  return true;
}
