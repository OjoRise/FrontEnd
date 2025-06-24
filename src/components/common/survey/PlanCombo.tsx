"use client";

import * as React from "react";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useSurveyStore } from "@/stores/surveyStore";

export function PlanCombo() {
  const { data, planList, setField, input, setInput } = useSurveyStore();
  const [showList, setShowList] = React.useState(true);

  const handlePlanSelect = (currentValue: string) => {
    const newValue = currentValue === data.planName ? "" : currentValue;
    setField("planName", newValue);
  };

  React.useEffect(() => {
    if (data.planName) {
      setInput(data.planName);
    }
  }, [data.planName, setInput]);

  React.useEffect(() => {
    if (input === data.planName && input !== '') setShowList(false);
    else setShowList(true);
  }, [input, data.planName]);

  return (
    <div>
      <p className="font-bold text-[18px] mb-3 mt-4">요금제 선택</p>
      <Command className="w-[260px]">
        <CommandInput
          placeholder="요금제를 선택해 주세요."
          value={input}
          onInput={(e) => setInput(e.currentTarget.value)}
          className="h-[50px] justify-between text-[16px] "
        />

        {showList && (
          <CommandList>
            <CommandEmpty>해당 요금제가 없습니다.</CommandEmpty>
            <CommandGroup>
              {planList.map((plan) => (
                <CommandItem
                  key={plan.value}
                  value={plan.value}
                  onSelect={() => handlePlanSelect(plan.value)}
                  className="text-[15px] py-2"
                >
                  {plan.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      data.planName === plan.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        )}
      </Command>
    </div>
  );
}
