import * as React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSurveyStore } from "@/stores/surveyStore";
import { useGetPlan } from "@/hooks/useGetPlan";

export function SelectCarrier() {
  const { data, setField, setPlanList } = useSurveyStore();
  const { data: plans } = useGetPlan(data.telecomProvider);

  const handleCarrierChange = (telecomProvider: string) => {
    setField("telecomProvider", telecomProvider);
  };

  React.useEffect(() => {
    if (!plans) return;

    const formattedPlans = plans.map((plan) => ({
      value: plan.name,
      label: plan.name,
    }));
    setPlanList(formattedPlans);
  }, [plans, setPlanList]);
  
  return (
    <div>
      <p className="font-bold text-[18px] mb-3">통신사 선택</p>
      <Select value={data.telecomProvider} onValueChange={handleCarrierChange}>
        <SelectTrigger className="w-[260px] text-[16px] px-3 py-6">
          <SelectValue placeholder="통신사를 선택해 주세요" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>통신사</SelectLabel>
            <SelectItem value="LG" className="text-[16px]">
              LG U+
            </SelectItem>
            <SelectItem value="SKT" className="text-[16px]">
              SKT
            </SelectItem>
            <SelectItem value="KT" className="text-[16px]">
              KT
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
