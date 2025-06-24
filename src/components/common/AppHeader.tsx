"use client";

import Image from "next/image";
import Link from "next/link";
import { Fragment, memo, useEffect, useMemo, useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import HamburgerIcon from "./HamburgerIcon";
import OffCanvas from "./OffCanvas";
import { useLogout } from "@/hooks/useLogout";

function AppHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const isSurveyed = useAuthStore((state) => state.isSurveyed);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const logoutMutation = useLogout();

  useEffect(() => {
    const handler = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handler);
    handler();
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const handleKakaoLogin = () => {
    const kakaoAuthUrl = process.env.NEXT_PUBLIC_KAKAO_LOGIN_URL;
    if (!kakaoAuthUrl) {
      console.error("KAKAO 로그인 URL이 설정되지 않았습니다.");
      return;
    }
    window.location.href = kakaoAuthUrl;
  };

  const currentMenu = useMemo(() => {
    if (isSurveyed) {
      return [
        { label: "마이페이지", href: "/mypage" },
        { label: "요금제 둘러보기", href: "/" },
        {
          label: "로그아웃",
          href: "/",
          onClick: () => logoutMutation.mutate(),
        },
      ];
    }

    return [
      {
        label: "카카오 로그인",
        href: "#",
        onClick: handleKakaoLogin,
      },
      { label: "요금제 둘러보기", href: "/" },
    ];
  }, [isSurveyed, logoutMutation]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  return (
    <header
      className={`fixed w-full z-50 bg-white transition-all duration-0 ease-in-out ${
        isScrolled ? "border-b border-solid border-[#EAEAEA]" : ""
      }`}
    >
      <div className="max-w-[1480px] flex items-center justify-between h-[56px] xl:h-[80px] mx-auto px-4 xl:px-[74px]">
        <Link href="/" className="text-lg font-bold">
          <Image src="/logo.svg" alt="Logo" width={110} height={42} />
        </Link>

        <div className="hidden md:flex items-center space-x-[50px]">
          <Link
            href="/"
            className="text-sm text-neutral-800 hover:text-gray-600 transition-colors duration-300"
          >
            요금제 둘러보기
          </Link>

          {!isSurveyed && (
            <button
              onClick={handleKakaoLogin}
              className="text-sm bg-yellow-400 hover:bg-yellow-300 px-4 py-2 rounded transition-colors duration-300"
            >
              카카오 로그인
            </button>
          )}

          {isSurveyed && (
            <Fragment>
              <Link
                href="/mypage"
                className="text-sm text-neutral-800 hover:text-gray-600 transition-colors duration-300"
              >
                마이페이지
              </Link>
              <button
                onClick={() => logoutMutation.mutate()}
                className="text-sm text-neutral-800 hover:text-gray-600 transition-colors duration-300"
              >
                로그아웃
              </button>
            </Fragment>
          )}
        </div>

        <div className="md:hidden flex items-center">
          <HamburgerIcon isOpen={isMobileMenuOpen} toggleMenuAction={toggleMobileMenu} />
          <OffCanvas
            isOpen={isMobileMenuOpen}
            onCloseAction={toggleMobileMenu}
            menuItems={currentMenu}
          />
        </div>
      </div>
    </header>
  );
}

export default memo(AppHeader);
