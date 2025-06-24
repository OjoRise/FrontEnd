"use client";

import PlanInfoLoggedIn from "@/components/page-component/main-page/plan/PlanInfoLoggedIn";
import GuestPrompt from "@/components/page-component/main-page/plan/GuestPrompt";
import GuestPlanSelector from "@/components/page-component/main-page/plan/GuestPlanSelector";
import { useAuthStore } from "@/stores/authStore";

export default function PlanBox() {
  const { username, isGuest, isSurveyed, selectedPlan } = useAuthStore();

  if (isSurveyed) {
    return (
        <PlanInfoLoggedIn
            username={username}
            planName={selectedPlan?.name ?? "알 수 없음"}
            price={selectedPlan?.price ?? "0원"}
            voice={selectedPlan?.call ?? "-"}
            sms={selectedPlan?.sms ?? "-"}
            network={selectedPlan?.tech ?? "-"}
            dataAmount={selectedPlan?.data ?? "-"}
            dataAfterLimit={selectedPlan?.speed ?? "-"}
            extraVoice={selectedPlan?.extraCall ?? "-"}
            portingFee={selectedPlan?.numberChangeFee ?? "-"}
        />
    );
  }

  return isGuest ? <GuestPlanSelector /> : <GuestPrompt />;
}