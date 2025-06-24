import { useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";

interface SurveyResponse {
  birthdate: string;
  telecomProvider: string;
  planName: string;
  planPrice: number;
  familyBundle: string;
  familyNum: string;
}

export const useSurvey = () => {
  return useQuery<SurveyResponse>({
    queryKey: ["survey"],
    queryFn: async () => {
      const { data } = await axios.get("/survey/result", {});
      return data;
    },
  });
};
