"use client";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { SelectCarrier } from "@/components/common/survey/SelectCarrier";
import { PlanCombo } from "@/components/common/survey/PlanCombo";
import { useGetGuestPlan } from "@/hooks/useGetMyPlan";
import { useSurveyStore } from "@/stores/surveyStore";
import { numberParsing } from "@/utils/numberParsing";

export default function GuestPlanSelector() {
  const [open, setOpen] = useState(false);
  const { telecomProvider, planName } = useSurveyStore().data;
  const setField = useSurveyStore((state) => state.setField);
  const { data } = useGetGuestPlan({ telecomProvider, planName });

  // 최초 마운트 시 sessionStorage에서 값 불러오기
  useEffect(() => {
    const savedTelecom = sessionStorage.getItem("guest_telecomProvider");
    const savedPlan = sessionStorage.getItem("guest_planName");
    if (savedTelecom) setField("telecomProvider", savedTelecom);
    if (savedPlan) setField("planName", savedPlan);
  }, [setField]);

  // 값이 바뀔 때마다 sessionStorage에 저장
  useEffect(() => {
    if (telecomProvider) sessionStorage.setItem("guest_telecomProvider", telecomProvider);
    if (planName) sessionStorage.setItem("guest_planName", planName);
  }, [telecomProvider, planName]);

  const parsingMonthlyFee = numberParsing(String(data?.monthlyFee), "monthlyFee");
  const parsingVoiceCallPrice = numberParsing(String(data?.voiceCallPrice), "voiceCallPrice");
  const parsingSms = numberParsing(String(data?.sms), "sms");
  const parsingThrottleSpeedKbps = numberParsing(String(data?.throttleSpeedKbps), "throttleSpeedKbps");
  const parsingbaseDataGb = numberParsing(String(data?.baseDataGb), "baseDataGb");
  const parsingSharingDataGb = numberParsing(String(data?.sharingDataGb), "sharingDataGb");

  return (
    <div className="w-full max-w-[758px] bg-[#FAFAFA] rounded-xl shadow px-8 py-8 flex flex-col gap-8">
      
      {/* ✅ 상단: 설명 문구 + 요금 */}
      <div className="flex justify-between items-start md:items-center gap-4">
        <div className="flex flex-wrap items-center gap-2 text-[20px] md:text-[22px] font-semibold leading-[32px]">
          고객님께서 사용 중인 요금제는
          <span className="inline-block"><SelectCarrier type="myPlan" /></span>의
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <span
                className={cn(
                  "text-[#EF3E7D] font-bold bg-[#FCE8F3] px-2 py-1 rounded-md border border-[#F7ADC3] inline-flex items-center gap-1 cursor-pointer"
                )}
              >
                {planName ?? "요금제 선택"}
                <ChevronDown className="w-4 h-4" />
              </span>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0">
              <PlanCombo type="myPlan" />
            </PopoverContent>
          </Popover>
          {data && <span>입니다</span>}
        </div>

        <div className="text-[24px] font-bold text-gray-900 whitespace-nowrap">
          {data ? `월 ${parsingMonthlyFee}` : <Skeleton className="w-32 h-10" />}
        </div>
      </div>

      {/* ✅ 중간: 통화 / 문자 / 통신기술 */}
      <div className="bg-white rounded-md p-4 w-full max-w-[360px]">
        {data ? (
          <div className="flex justify-between text-sm font-medium">
            <div>
              <p className="text-gray-500">통화</p>
              <p>{parsingVoiceCallPrice}</p>
            </div>
            <div>
              <p className="text-gray-500">문자</p>
              <p>{parsingSms}</p>
            </div>
            <div>
              <p className="text-gray-500">통신 기술</p>
              <p>{data.mobileType}</p>
            </div>
          </div>
        ) : (
          <div className="flex justify-between">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="w-20 h-10" />
            ))}
          </div>
        )}
      </div>

      {/* ✅ 하단: 데이터 정보 등 4쌍 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-4 text-sm font-medium">
        <div className="text-gray-500">데이터 제공량</div>
        <div className="text-[#EF3E7D]">
          {data ? parsingbaseDataGb : <Skeleton className="w-20 h-4" />}
        </div>

        <div className="text-gray-500">쉐어링 데이터</div>
        <div className="text-[#EF3E7D]">
          {data ? parsingSharingDataGb : <Skeleton className="w-20 h-4" />}
        </div>

        <div className="text-gray-500">데이터 소진시</div>
        <div className="text-[#EF3E7D]">
          {data ? parsingThrottleSpeedKbps : <Skeleton className="w-20 h-4" />}
        </div>

        <div className="text-gray-500">자격 요건</div>
        <div className="text-[#EF3E7D]">
          {data ? data.eligibility : <Skeleton className="w-20 h-4" />}
        </div>
      </div>
    </div>
  );
}
