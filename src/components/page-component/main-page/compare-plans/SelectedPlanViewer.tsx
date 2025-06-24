"use client";

import { usePlanStore } from "@/stores/usePlanStore";

export default function SelectedPlanViewer() {
  const selectedPlans = usePlanStore((state) => state.selectedPlans);

  if (selectedPlans.length === 0)
    return <p className="text-gray-500 mt-4">아직 선택된 요금제가 없습니다.</p>;

  return (
    <section className="mt-10">
      <h2 className="text-2xl font-bold mb-4">선택한 요금제</h2>
      <div className="flex flex-col gap-2">
        {selectedPlans.map((plan) => (
          <div
            key={plan.name}
            className="px-10 py-6 rounded-xl bg-white shadow-md text-xl font-semibold text-center w-fit"
          >
            {plan.name}
          </div>
        ))}
      </div>
    </section>
  );
}
