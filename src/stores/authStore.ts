import { create } from 'zustand';
import type { MyPlan } from "@/types/plan";

type AuthState = {
    isSurveyed: boolean | null;
    isGuest: boolean | null;
    username: string;
    selectedPlan: MyPlan | null;
    
    login: () => void;
    logout: () => void;
    setIsSurveyed: (state: boolean) => void;
    setIsGuest: (state: boolean) => void;
    setUsername: (name: string | null) => void;
    setSelectedPlan: (plan: MyPlan | null) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
    isSurveyed: null,
    isGuest: null,
    username: "",
    selectedPlan: null,

    login: () => set({ isGuest: false, isSurveyed: true}),
    logout: () => set({ isGuest: null, isSurveyed: null}),
    setIsSurveyed: (state: boolean) => set({ isSurveyed: state }),
    setIsGuest:(state: boolean) => set({ isGuest: state }),
    setUsername: (name) => set({ username: name ?? "" }),
    setSelectedPlan: (plan) => set({ selectedPlan: plan }),
}));