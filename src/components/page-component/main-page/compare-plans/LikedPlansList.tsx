"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { usePlanStore } from "@/stores/usePlanStore";
import PlanCard from "./PlanCard";
import { useAuthStore } from "@/stores/authStore";

export default function LikedPlansList() {
  const { isLoggedIn } = useAuthStore();
  const { likedPlans } = usePlanStore();

  const removeLikedPlan = usePlanStore((state) => state.removeLikedPlan);

  return (
    <section className="w-full mx-auto px-4 mb-9">
      <h2 className="text-2xl font-bold">찜한 요금제</h2>
      <div className="relative min-h-[400px] flex items-center justify-center">
        {!isLoggedIn ? (
          <div className="text-center">
            <p className="text-gray-500 mb-4 text-lg">로그인 후 사용 가능한 서비스입니다.</p>
          </div>
        ) : likedPlans.length === 0 ? (
          <div className="text-center">
            <p className="text-gray-500 mb-4 text-lg">찜한 요금제가 없습니다!</p>
            <button
              onClick={() => window.scrollTo({ top: 1, behavior: "smooth" })}
              className="bg-[#FF008C] hover:bg-[#E01F7C] text-white px-4 py-2 rounded-full"
            >
              요금제 둘러보기
            </button>
          </div>
        ) : (
          <Carousel className="w-full overflow-visible">
            <CarouselContent className="flex -mx-[1px]">
              {likedPlans.map((plan, index) => (
                <CarouselItem
                  key={index}
                  className="basis-full sm:basis-1/2 shrink-0 px-[1px] flex justify-center"
                >
                  <div className="w-full max-w-[320px]">
                    <PlanCard
                      key={plan.name}
                      {...plan}
                      source="like"
                      onRemove={() => removeLikedPlan(plan.name)}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute -left-6 top-1/2 -translate-y-1/2 z-10" />
            <CarouselNext className="absolute -right-6 top-1/2 -translate-y-1/2 z-10" />
          </Carousel>
        )}
      </div>
    </section>
  );
}
