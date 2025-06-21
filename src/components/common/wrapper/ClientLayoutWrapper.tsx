"use client";

import { Fragment, useEffect, useState } from "react";
import AppHeader from "@/components/common/AppHeader";
import Footer from "@/components/common/Footer";
import { ToastContainer } from "react-toastify";
import LinearProgress from "@/components/common/progress/LinearProgress";
import ChatBotModal from "@/components/common/chatbot/ChatBotModal";
import { useAuthStore } from "@/stores/authStore";
import { useGetIsSurveyedQuery } from "@/hooks/useGetIsSurveyed";
import { isAccessTokenExpired } from "@/lib/auth";
import { useRefreshToken } from "@/hooks/useRefreshToken";

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const { isSurveyed, setIsSurveyed } = useAuthStore();
  const { data: survey } = useGetIsSurveyedQuery();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const { refetch } = useRefreshToken();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = sessionStorage.getItem("accessToken");
      setAccessToken(token);
    }
  }, []);

  useEffect(() => {
    if(!accessToken) return;

    if(isAccessTokenExpired(accessToken)){
      refetch().then((res) => {
        if (res.data?.accessToken) {
          sessionStorage.setItem('accessToken',res.data.accessToken);
          console.log("토큰 재발급");
        } else {
          console.error("토큰 재발급 실패");
        }
      });
    }
  },[accessToken, refetch]);

  useEffect(() => {
    const token = sessionStorage.getItem("accessToken");

    if (token && isSurveyed === null && survey !== undefined) setIsSurveyed(survey);
  }, [survey, isSurveyed, setIsSurveyed]);

  return (
    <Fragment>
      <AppHeader />
      <ToastContainer position="top-right" autoClose={2000} newestOnTop />
      {children}
      <Footer />
      <LinearProgress colorClassName="bg-[black]" />
      <ChatBotModal />
    </Fragment>
  );
}
