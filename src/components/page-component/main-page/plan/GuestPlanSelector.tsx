"use client";

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { MyPlan } from "@/types/plan";

const mockPlans: MyPlan[] = [
    {
        id: "plan_1",
        name: "유쓰 5G 데이터 플러스",
        price: "75,000원",
        call: "무제한",
        sms: "무제한",
        tech: "5G",
        data: "월 11GB + 매일 2GB",
        speed: "3mbps 속도로 무제한",
        extraCall: "300분",
        numberChangeFee: "800원",
    },
    {
        id: "plan_2",
        name: "갈라파고스",
        price: "15,000원",
        call: "무제한",
        sms: "무제한",
        tech: "5G",
        data: "월 11GB + 매일 2GB",
        speed: "3mbps 속도로 무제한",
        extraCall: "300분",
        numberChangeFee: "800원",
    },
    {
        id: "plan_3",
        name: "아기코끼리",
        price: "25,000원",
        call: "유제한",
        sms: "유제한",
        tech: "5G",
        data: "월 11GB + 매일 2GB",
        speed: "3mbps 속도로 무제한",
        extraCall: "300분",
        numberChangeFee: "800원",
    },
];

export default function GuestPlanSelector() {
    const [open, setOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<MyPlan | null>(null);

    return (
        <div className="w-full md:w-[758px] bg-[#FAFAFA] rounded-xl shadow px-4 py-6 flex flex-col gap-6">
            {/* 문장 + 요금제 선택 */}
            <div className="text-[18px] md:text-[20px] leading-[28px] font-semibold">
                고객님께서 사용 중인 요금제는<br />
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            className={cn(
                                "mt-1 text-[18px] md:text-[20px] font-bold text-[#EF3E7D] bg-white px-2 py-1 h-auto border border-[#F7ADC3] hover:bg-[#FFF1F6] rounded-md inline-flex items-center gap-1"
                            )}
                        >
                            {selectedPlan?.name ?? "요금제 선택"}
                            <ChevronDown className="w-4 h-4" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[300px] p-0">
                        <Command>
                            <CommandInput placeholder="요금제 검색..." />
                            <CommandEmpty>해당 요금제가 없습니다.</CommandEmpty>
                            <CommandGroup>
                                {mockPlans.map((plan) => (
                                    <CommandItem
                                        key={plan.id}
                                        value={plan.name}
                                        onSelect={() => {
                                            setSelectedPlan(plan);
                                            setOpen(false);
                                        }}
                                    >
                                        {plan.name}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </Command>
                    </PopoverContent>
                </Popover>
                {selectedPlan && " 입니다"}
            </div>

            {/* 가격 */}
            <div className="text-[24px] md:text-[32px] font-bold text-black self-end">
                {selectedPlan ? (
                    `월 ${selectedPlan.price}`
                ) : (
                    <Skeleton className="w-32 h-8" />
                )}
            </div>

            {/* 통화/문자/통신 */}
            <div className="bg-white rounded-md p-4 w-full md:w-[355px]">
                {selectedPlan ? (
                    <div className="flex justify-between text-sm font-medium">
                        <div>
                            <p className="text-gray-500">통화</p>
                            <p>{selectedPlan.call}</p>
                        </div>
                        <div>
                            <p className="text-gray-500">문자</p>
                            <p>{selectedPlan.sms}</p>
                        </div>
                        <div>
                            <p className="text-gray-500">통신 기술</p>
                            <p>{selectedPlan.tech}</p>
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

            {/* 하단 정보 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-y-2 text-[14px] leading-5 font-medium">
                <div className="text-gray-500">데이터 제공량</div>
                <div className="text-[#EF3E7D]">
                    {selectedPlan ? selectedPlan.data : <Skeleton className="w-20 h-4" />}
                </div>

                <div className="text-gray-500">부가 통화</div>
                <div className="text-[#EF3E7D]">
                    {selectedPlan ? selectedPlan.extraCall : <Skeleton className="w-20 h-4" />}
                </div>

                <div className="text-gray-500">데이터 소진시</div>
                <div className="text-[#EF3E7D]">
                    {selectedPlan ? selectedPlan.speed : <Skeleton className="w-20 h-4" />}
                </div>

                <div className="text-gray-500">번호이동 수수료</div>
                <div className="text-[#EF3E7D]">
                    {selectedPlan ? selectedPlan.numberChangeFee : <Skeleton className="w-20 h-4" />}
                </div>
            </div>
        </div>
    );
}
