import ScrollChart from "./compare-chart/ScrollChart";
import CompareModeToggle from "./compare-plans/CompareModeToggle";
import LikedPlansList from "./liked-list/LikedPlansList";
import RecommendedPlanList from "./compare-plans/RecommendedPlanList";
import SelectedPlanViewer from "./compare-plans/SelectedPlanViewer";

export default function MainPage() {
  return (
    <main className="flex flex-col items-center bg-white px-4 pb-20">
      <section className="w-full max-w-[768px] mt-10">
        <h2 className="text-3xl font-bold mb-4 mt-10">요금제 비교하기</h2>
        <CompareModeToggle />
        <RecommendedPlanList />
        <LikedPlansList />
        <SelectedPlanViewer />
        <ScrollChart />
      </section>
    </main>
  );
}
