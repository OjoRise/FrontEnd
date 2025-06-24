import api from "@/lib/axios";
import { DipCardPlan } from "@/types/plan";

export const fetchBrowsePlans = async ({ isOnline, page }: { isOnline: boolean; page: number }) => {
  const response = await api.get("/browse", {
    params: { isOnline, page },
  });
  return response.data as DipCardPlan[];
};

export const fetchBrowseDip = async ({ isOnline, page }: { isOnline: boolean; page: number }) => {
  const response = await api.get("/browseDip", {
    params: { isOnline, page },
  });
  return response.data as number[];
};