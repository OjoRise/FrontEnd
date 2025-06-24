import api from "@/lib/axios";
import { usePlanStore } from "@/stores/usePlanStore";
import { Plan } from "@/types/plan";

export async function fetchLikedPlans() {
  const res = await api.get<Plan[]>("/api/dips");

  const refinedPlans = res.data;

  usePlanStore.getState().setLikedPlans(refinedPlans);
}

export async function dipPlan(planId: number): Promise<boolean> {
  await api.post(`/api/dips/${planId}`);
  return true;
}
