"use client";

import { numberParsing } from "@/utils/numberParsing";
import { useMyPlanStore } from "@/stores/myPlanStore";
import { useGetMyPlan } from "@/hooks/useGetMyPlan";
import { useEffect } from "react";
import { useGetName } from "@/hooks/useGetUserInfo";
import { useSurveyResult } from "@/hooks/useSurveyResult";

function PlanInfoLoggedIn() {
    const {data: name} = useGetName();
    const {data: survey} = useSurveyResult();
    const {data} = useGetMyPlan();
    const {setMyPlan} = useMyPlanStore();

    const parsingMonthlyFee = numberParsing(String(survey?.planPrice), 'monthlyFee');
    const parsingVoiceCallPrice =  numberParsing(String(data?.voiceCallPrice), 'voiceCallPrice');
    const parsingSms = numberParsing(String(data?.sms), 'sms');
    const parsingThrottleSpeedKbps = numberParsing(String(data?.throttleSpeedKbps), 'throttleSpeedKbps');
    const parsingbaseDataGb = numberParsing(String(data?.baseDataGb), 'baseDataGb');
    const parsingSharingDataGb = numberParsing(String(data?.sharingDataGb), 'sharingDataGb');
    const parsingBenefit = numberParsing(String(data?.benefit), 'benefit');

    useEffect(() => {
        setMyPlan({
            name: data?.name ?? "",
            baseDataGb: data?.baseDataGb ?? "",
            monthlyFee: survey?.planPrice ?? 0,
            voiceCallPrice: data?.voiceCallPrice ?? "",
            sharingDataGb: data?.sharingDataGb ?? "",
            sms: data?.sms ?? "",
            benefit: data?.benefit ? parsingBenefit : "",
        });
    }, [data, parsingBenefit, setMyPlan, survey?.planPrice]);

    const username = name ?? "";
    const planName = data?.name ?? "알 수 없음";
    const monthlyFee = survey?.planPrice ? parsingMonthlyFee : "0원";
    const voiceCallPrice = data?.voiceCallPrice ? parsingVoiceCallPrice : "-";
    const sms = data?.sms ? parsingSms : "-";
    const telecomProvider = data?.telecomProvider ?? "-";
    const throttleSpeedKbps = data?.throttleSpeedKbps ? parsingThrottleSpeedKbps : "-";
    const eligibility = data?.eligibility ?? "ALL";
    const mobileType = data?.mobileType ?? "-";
    const baseDataGb = data?.baseDataGb ? parsingbaseDataGb : "-";
    const sharingDataGb = data?.sharingDataGb ? parsingSharingDataGb : "-";

    const infoList = [
        { label: "데이터 제공량", value: baseDataGb },
        { label: "쉐어링 데이터", value: sharingDataGb },
        { label: "데이터 소진시", value: throttleSpeedKbps },
        { label: "자격 요건", value: eligibility },
    ];

    return (
        <div className="w-full max-w-[758px] bg-[#FAFAFA] rounded-xl shadow px-6 py-6 flex flex-col gap-6">
            {/* 상단 문장 */}
            <div className="text-base md:text-lg font-semibold leading-6 md:leading-7">
                {username}님께서 사용 중인 요금제는 <span className="text-[#EF3E7D] font-bold text-lg md:text-xl">{telecomProvider}</span> 의<br />
                <span className="text-[#EF3E7D] font-bold text-lg md:text-xl">{planName}</span> 입니다
            </div>

            {/* 가격 */}
            <div className="text-2xl font-bold text-black self-end">
                월 {monthlyFee}
            </div>

            {/* 통화/문자/통신기술 */}
            <div className="bg-white rounded-md p-4 w-full max-w-[400px]">
                <div className="flex justify-between text-sm font-medium">
                    <div>
                        <p className="text-gray-500">통화</p>
                        <p>{voiceCallPrice}</p>
                    </div>
                    <div>
                        <p className="text-gray-500">문자</p>
                        <p>{sms}</p>
                    </div>
                    <div>
                        <p className="text-gray-500">통신 기술</p>
                        <p>{mobileType}</p>
                    </div>
                </div>
            </div>

            {/* 하단 정보 */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-2 text-sm font-medium">
                {infoList.map(({ label, value }) => (
                    <>
                        <div className="text-gray-500" key={label}>{label}</div>
                        <div className="text-[#EF3E7D]" key={label + '-value'}>{value}</div>
                    </>
                ))}
            </div>
        </div>
    );
}

export default PlanInfoLoggedIn;
