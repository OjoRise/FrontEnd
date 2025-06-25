import { create } from 'zustand';
import type { MyPlan } from "@/types/plan";

type AuthState = {
    isSurveyed: boolean | null;
    isGuest: boolean | null;
    selectedPlan: MyPlan | null;
    
    login: () => void;
    logout: () => void;
    setIsSurveyed: (state: boolean) => void;
    setIsGuest: (state: boolean) => void;
    setSelectedPlan: (plan: MyPlan | null) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
    isSurveyed: null,
    isGuest: typeof window !== "undefined" ? JSON.parse(localStorage.getItem("isGuest") ?? "null") : null,
    selectedPlan: null,

    login: () => set({ isGuest: false, isSurveyed: true}),
    logout: () => set({ isGuest: null, isSurveyed: null}),
    setIsSurveyed: (state: boolean) => set({ isSurveyed: state }),
    setIsGuest:(state: boolean) => {
        localStorage.setItem("isGuest", JSON.stringify(state));
        set({ isGuest: state });
    },
    setSelectedPlan: (plan) => set({ selectedPlan: plan }),
}));