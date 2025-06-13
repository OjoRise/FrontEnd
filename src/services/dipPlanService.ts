import api from "@/lib/axios";
import { usePlanStore } from "@/stores/usePlanStore";
import { Plan } from "@/types/plan";

export async function fetchLikedPlans() {
  const res = await api.get("/api/dips");

  const refinedPlans: Plan[] = res.data.map((p: any) => ({
    planId: p.planId,
    name: p.name,
    baseDataGb: p.baseDataGb,
    monthlyFee: p.monthlyFee,
    voiceCallPrice: p.voiceCallPrice,
    sms: p.sms,
    description: p.description,
    mobileType: p.mobileType,
    onRemove: undefined,
  }));

  usePlanStore.getState().setLikedPlans(refinedPlans);
}

export async function deleteLikedPlan(planId: number): Promise<boolean> {
  await api.delete(`/api/dips/${planId}`);
  return true;
}
