import { getIsSurveyed } from "@/services/auth";
import { useQuery } from "@tanstack/react-query";

export const useGetIsSurveyedQuery = () => {
    return useQuery<boolean, Error>({
        queryKey: ['user'],
        queryFn: getIsSurveyed,
    });
}