import { usePlanStore } from "@/stores/usePlanStore";
import type { Plan } from "@/types/plan";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import TextsmsIcon from "@mui/icons-material/Textsms";
import FiveGIcon from "@mui/icons-material/FiveG";
import LteMobiledataIcon from "@mui/icons-material/LteMobiledata";
import { deleteRecommendedPlan } from "@/services/recommenendPlanService";
import { dipPlan } from "@/services/dipPlanService";

export default function PlanCard(props: Plan) {
  const {
    planId,
    name,
    baseDataGb,
    monthlyFee,
    voiceCallPrice,
    sms,
    description,
    mobileType,
    onRemove,
    source,
  } = props;

  const selectedPlans = usePlanStore((state) => state.selectedPlans);
  const togglePlanSelection = usePlanStore((state) => state.togglePlanSelection);

  const isSelected = selectedPlans.some((p) => p.name === name && p.source === source);

  const handleSelect = () => {
    togglePlanSelection({
      planId,
      name,
      baseDataGb,
      monthlyFee,
      voiceCallPrice,
      sms,
      description,
      mobileType,
      onRemove,
      source,
    });
  };

  return (
    <div
      onClick={handleSelect}
      className={`relative w-full max-w-[320px] h-[340px] rounded-2xl border-2 p-6 border-gray-200 bg-white flex flex-col gap-3 cursor-pointer transition-colors duration-200 ease-in-out ${
        isSelected ? "border-pink-500" : " shadow-md hover:shadow-lg"
      }`}
    >
      {onRemove && (
        <button
          onClick={async (e) => {
            e.stopPropagation();

            try {
              if (props.source === "recommend") {
                await deleteRecommendedPlan(planId);
              } else if (props.source === "like") {
                await dipPlan(planId);
              } else {
                console.warn("삭제 타입 미지정");
              }

              onRemove();
            } catch (err) {
              console.error("삭제 실패:", err);
            }
          }}
          className="absolute top-2 right-2 text-gray-400 hover:text-red-500 z-10"
        >
          ✕
        </button>
      )}

      <span className="inline-block text-xs font-semibold px-3 py-1 bg-[#FAD0E1] text-[#E2217E] rounded w-fit">
        {mobileType}
      </span>

      <h3 className="text-2xl font-bold">{name}</h3>

      <div className="flex gap-2 text-sm font-medium mt-1 mb-1">
        <span className="flex items-center gap-1 px-2 py-2 bg-pink-50 text-gray-700 rounded-md font-bold">
          {mobileType === "5G" ? (
            <>
              <FiveGIcon fontSize="small" style={{ color: "black" }} />
              {baseDataGb?.includes("무제한") ? "무제한" : `${baseDataGb}GB`}
            </>
          ) : (
            <>
              <LteMobiledataIcon fontSize="small" style={{ color: "black" }} />
              {baseDataGb?.includes("무제한") ? "무제한" : `${baseDataGb}GB`}
            </>
          )}
        </span>
        <span className="flex items-center gap-1 px-2 py-2 bg-pink-50 text-gray-700 rounded-md font-bold">
          <TextsmsIcon fontSize="small" style={{ color: "black" }} />
          {sms}
        </span>
        <span className="flex items-center gap-1 px-2 py-2 bg-pink-50 text-gray-700 rounded-md font-bold">
          <LocalPhoneIcon fontSize="small" style={{ color: "black" }} />
          {voiceCallPrice}
        </span>
      </div>

      <p className="text-sm tracking-tighter text-gray-800">{description}</p>

      <div className="flex justify-between items-end mt-3">
        <p className="text-xl font-bold">월 {monthlyFee.toLocaleString()}원</p>
        {monthlyFee && (
          <p className="text-xs text-gray-400 whitespace-nowrap">
            약정 할인 시 월 {monthlyFee.toLocaleString()}원
          </p>
        )}
      </div>

      <button
        className="mt-auto text-white font-semibold rounded-lg py-3 text-sm transition-colors"
        style={{ backgroundColor: "#FF008C" }}
      >
        신청하기
      </button>
    </div>
  );
}
