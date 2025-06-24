"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useGetIsSurveyedQuery } from "@/hooks/useGetIsSurveyed";
import { useQueryClient } from "@tanstack/react-query";
import { handleLoginSuccess } from "@/services/initialSetting";

export default function SuccessPageRoute() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const accessToken = searchParams.get("accessToken");
  const { data: isSurveyed, isLoading } = useGetIsSurveyedQuery();

  useEffect(() => {
    if (accessToken) {
      sessionStorage.setItem("accessToken", accessToken);
      handleLoginSuccess();
      queryClient.invalidateQueries({ queryKey: ["user"] });
    }
  }, [accessToken, queryClient]);

  useEffect(() => {
    if (!isLoading && isSurveyed !== undefined) {
      if (isSurveyed) router.push("/");
      else router.push("/signup");
    }
  }, [isSurveyed, isLoading, router]);

  return null;
}
