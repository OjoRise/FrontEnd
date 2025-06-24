"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { StepItem } from "./StepItem";
import { DateInput } from "./DateInput";
import { SelectCarrier } from "./SelectCarrier";
import { PlanCombo } from "./PlanCombo";
import { FamilyBundleGroup } from "./FamilyBundleGroup";
import { FamilyNumRadioGroup } from "./FamilyNumRadioGroup";
import { useSurveyStore } from "@/stores/surveyStore";
import { PlanPrice } from "./PlanPrice";
import { isValidDate } from "@/utils/date";
import ScreenshotOCR from "../../page-component/signup/ScreenshotOCR";
import { ResultItem } from "@/types/ocr";
import { ocrTelecomProvider } from "@/utils/ocrTelecomProvider";
import { useGetPlan } from "@/hooks/useGetPlan";
import { usePathname } from "next/navigation";

export default function VerticalLinearStepper() {
  const { data, setField, setPlanList, setInput } = useSurveyStore();
  const planName = useSurveyStore(state => state.data.planName);
  const telecomProvider = useSurveyStore(state => state.data.telecomProvider);
  const familyBundle = useSurveyStore(state => state.data.familyBundle);
  const [step, setStep] = useState(0);
  const [ocrResult, setOcrResult] = useState<ResultItem>();
  const [parsedTelecomProvider, setParsedTelecomProvider] = useState('');
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const pathname = usePathname();
  const isEdit = pathname === "/mypage/edit-survey";

  useEffect(() => {
    const el = stepRefs.current[step];
    if (el) {
      requestAnimationFrame(() => {
        el.scrollIntoView({ behavior: 'smooth' });
      });
    }
  }, [step]);

  const onComplete = (result: ResultItem) => {
    setOcrResult(result);
  }

  useEffect(() => {
    if (ocrResult?.통신사) {
      const parsed = ocrTelecomProvider(ocrResult.통신사);
      setParsedTelecomProvider(parsed);
    }
  },[ocrResult])

  const {data: plans} = useGetPlan(parsedTelecomProvider); 

  useEffect(() => {
    if (!plans) return;

    const formattedPlans = plans.map((plan) => ({
      value: plan.name,
      label: plan.name,
    }));
    setPlanList(formattedPlans);

    setField('telecomProvider', parsedTelecomProvider);
    setInput(ocrResult?.["요금제 이름"] || '');
    setField('planPrice', Number(ocrResult?.["실 납부금액"] || 0));
  }, [plans, ocrResult, parsedTelecomProvider, setField, setInput, setPlanList]);

  const validationSteps = [
    () => isValidDate(data.birthdate),
    () => !!(data.telecomProvider && data.planName && data.planPrice),
    () => !!(data.familyBundle && data.familyNum),
  ];

  const isNextDisabled = () => {
    const validator = validationSteps[step];
    return validator ? !validator() : true;
  };

  const next = () => {
    if (step < steps.length - 1) setStep(step + 1);
  };

  const back = () => {
    if (step > 0) setStep(step - 1);
  };

  const steps = useMemo(
    () => [
      {
        label: "생년월일을 작성해주세요.",
        component: <DateInput />,
      },
      {
        label: "현재 사용 중인 요금제를 알려주세요.",
        component: (
          <div>
            <ScreenshotOCR onComplete={onComplete} />
            <SelectCarrier />
            {telecomProvider && <PlanCombo />}
            {planName.trim() !== '' && <PlanPrice/>}
          </div>
        ),
      },
      {
        label: "새로운 요금제 가입 시 가족 결합을 할 예정인가요?",
        component: (
          <div>
            <FamilyBundleGroup />
            {familyBundle === 'yes' && <FamilyNumRadioGroup />}
          </div>
        )
      }
    ],
    [telecomProvider, planName, familyBundle]
  );

  return (
    <div>
      {steps.map((s, i) => (
        <StepItem
          key={i}
          stepRef={(el) => (stepRefs.current[i] = el)}
          index={i}
          active={isEdit ? true : step === i}
          completed={isEdit ? true : step > i}
          label={s.label}
          isLast={i === steps.length - 1}
          onNext={next}
          onBack={back}
          showContent={isEdit ? true : step === i}
          isNextDisabled={isEdit ? false : isNextDisabled()}
        >
          {s.component}
        </StepItem>
      ))}
    </div>
  );
}
