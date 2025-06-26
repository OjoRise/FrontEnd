"use client";
import KakaoInitializer from "@/components/common/kakao/KakaoInitializer";
import { ageTestResult } from "@/services/ageTest";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import ShareButton from "@/components/common/button/ShareButton";
import { useCallback, useEffect } from "react";
import { PlanDipCard } from "../../explore-plans/PlanDipCard";
import { saveRecommendedPlan } from "@/lib/recommendationStorage";
import Image from "next/image";
import { formatDescription } from "../../tongbti/result/ResultPage";
import { useAuthStore } from "@/stores/authStore";

interface ResultType {
  age: string;
  description: string;
  recommend: number;
}

export interface RecommendPlanType {
  planId: number;
  name: string;
  baseDataGb: string;
  dailyDataGb: string;
  sharingDataGb: string;
  monthlyFee: number;
  voiceCallPrice: string;
  sms: string;
  mobileType: string;
  planUrl: string;
  online: boolean;
}

interface AgeTestResultProps {
  result: ResultType;
  recommendPlan: RecommendPlanType;
}

export default function AgeTestResult() {
  const params = useSearchParams();
  const userAge = params.get("userAge") || "10대";
  const resultAge = params.get("resultAge") || "10대";
  const { isSurveyed } = useAuthStore();
  const { data } = useQuery<AgeTestResultProps>({
    queryKey: ["age", userAge, resultAge],
    queryFn: () => ageTestResult(userAge, resultAge),
  });
  const router = useRouter();

  useEffect(() => {
    if (!isSurveyed && data?.recommendPlan?.name) {
      saveRecommendedPlan(data.recommendPlan.name);
    }
  }, [data?.recommendPlan.name, isSurveyed]);

  const handleClickRetry = useCallback(() => {
    router.push("/test-plan-age");
  }, [router]);

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const shareUrl = `${baseUrl}/test-plan-age/result?userAge=${userAge}&resultAge=${resultAge}`;
  const imageUrl = `${baseUrl}/${data?.result.age || "default.png"}`;

  return (
    <>
      <KakaoInitializer />
      <div className="min-h-screen bg-[#F8F8F8] flex items-center justify-center px-4 py-12 font-pretend">
        <div className="relative w-[350px] md:w-[758px] mt-60">
          {/* 이미지가 카드 위에 걸쳐지도록 absolute로 이동 */}
          <Image
            src={`/planAge/${data?.result.age}.svg`}
            width={289}
            height={289}
            alt={data?.result.age ?? "age"}
            className="absolute -top-47 left-1/2 transform -translate-x-1/2 w-60 h-auto"
          />

          <div className="bg-white rounded-[20px] shadow-xl px-10 pt-25 pb-30 text-center">
            <div className="flex flex-col items-center px-4">
              <h2 className="text-sm text-gray-500 font-semibold mb-1">나의 통신 연령은</h2>
              <h1 className="text-3xl font-bold text-[#FF008C] mb-6">{data?.result.age}</h1>

              <p className="text-center text-black text-sm md:text-base leading-relaxed max-w-lg mb-4">
                {formatDescription(data?.result.description ?? "")}
              </p>

              <div className="flex justify-center">
                <div className="w-full max-w-md min-w-[280px]">
                  {data?.recommendPlan && (
                    <PlanDipCard isRecommended={true} plan={data.recommendPlan} />
                  )}
                </div>
              </div>

              <button
                className="text-sm text-gray-500 underline mt-10 cursor-pointer"
                onClick={handleClickRetry}
              >
                테스트 다시하기
              </button>

              <div className="flex gap-4 mt-10">
                <ShareButton
                  title={`나의 통신 연령은 ${data?.result.age}`}
                  description="LG U+ 요금제 나이 테스트로 내 요금제 나이도 보고 요금제까지 추천받아보세요!"
                  url={shareUrl}
                  imageUrl={imageUrl}
                />
                <button
                  onClick={() => {
                    const url = window.location.href;
                    navigator.clipboard.writeText(url).then(() => {
                      alert("링크가 클립보드에 복사되었습니다!");
                    });
                  }}
                  className="p-0 border-none bg-transparent hover:opacity-80 transition cursor-pointer"
                  aria-label="링크 복사"
                >
                  <Image
                    src="/linkButton.png"
                    alt="링크 복사"
                    className="w-12 h-12 object-contain"
                    width={80}
                    height={80}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
