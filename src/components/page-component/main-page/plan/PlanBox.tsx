import PlanInfoLoggedIn from "@/components/page-component/main-page/plan/PlanInfoLoggedIn";
import GuestPrompt from "@/components/page-component/main-page/plan/GuestPrompt";
import GuestPlanSelector from "@/components/page-component/main-page/plan/GuestPlanSelector";
import { useAuthStore } from "@/stores/authStore";

export default function PlanBox() {
  const { isGuest, isSurveyed } = useAuthStore();

  if (isSurveyed) {
    return (
        <PlanInfoLoggedIn/>
    );
  }

  return isGuest ? <GuestPlanSelector /> : <GuestPrompt />;
}