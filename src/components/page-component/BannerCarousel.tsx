"use client";
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, Transition } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface BannerItem {
  id: number;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  backgroundColor: string;
  imageSrc: string;
  imageAlt: string;
  textColor: string;
  buttonBgColor: string;
  buttonTextColor: string;
  imagePosition: "left" | "right";
}
const bannerData: BannerItem[] = [
  {
    id: 1,
    title: "요금제 나이 테스트",
    description: "실제 나이 vs 요금제 나이, 당신은?",
    buttonText: "테스트 하러가기",
    buttonLink: "/test-plan-age",
    backgroundColor: "bg-blue-50",
    imageSrc: "/BannerIMG.png",
    imageAlt: "요금제 나이 테스트 캐릭터",
    textColor: "text-neutral-800",
    buttonBgColor: "bg-yellow-300",
    buttonTextColor: "text-neutral-800",
    imagePosition: "right",
  },
  {
    id: 2,
    title: "통BTI 테스트",
    description: "나는 어떤 요금제 캐릭터일까?",
    buttonText: "테스트 하러가기",
    buttonLink: "/test-bti",
    backgroundColor: "bg-yellow-50",
    imageSrc: "/TongBTI.png",
    imageAlt: "통BTI 테스트 캐릭터",
    textColor: "text-neutral-800",
    buttonBgColor: "bg-pink-200",
    buttonTextColor: "text-neutral-800",
    imagePosition: "left",
  },
];
const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 758 : -758,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 758 : -758,
    opacity: 0,
  }),
};
const spring: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 30,
};

export default function BannerCarousel() {
  const [[page, direction], setPage] = useState([0, 0]);
  const bannerIndex = wrap(0, bannerData.length, page);
  const currentBanner = bannerData[bannerIndex];
  const paginate = useCallback((newDirection: number) => {
    setPage(([currentPage]) => {
      const nextPage = currentPage + newDirection;
      return [nextPage, newDirection];
    });
  }, []);
  useEffect(() => {
    const interval = setInterval(() => {
      paginate(1);
    }, 5000);
    return () => clearInterval(interval);
  }, [paginate]);

  return (
    <div
      className="relative w-full max-w-[758px] h-[180px] sm:h-[220px] md:w-[758px] md:h-[310px] overflow-hidden rounded-xl"
    >
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={page}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={spring}
          className={`absolute inset-0 ${currentBanner.backgroundColor}`}
        >
          {/* 텍스트/버튼 영역 */}
          <div
            className={`
              absolute flex flex-col ${currentBanner.textColor}
              px-4 sm:px-8 md:px-0
              ${currentBanner.imagePosition === "right"
                ? "top-[30%] left-[15%] max-w-[80vw] md:top-[85px] md:left-[114px] md:max-w-none"
                : "top-[30%] right-[15%] max-w-[80vw] md:top-[85px] md:left-[348px] md:right-auto md:max-w-none"
              }
            `}
            style={{ alignItems: "flex-start" }}
          >
            <h2 className="font-bold text-base sm:text-xl md:text-[32px] mb-1 md:mb-0" style={{ lineHeight: "1.2" }}>
              {currentBanner.title}
            </h2>
            <p className="font-bold text-gray-600 text-xs sm:text-base md:text-[18px] mt-0 md:mt-[5px]" style={{ lineHeight: "1.3" }}>
              {currentBanner.description}
            </p>
            <Link href={currentBanner.buttonLink}>
              <Button
                variant="banner"
                className={`
                  w-full sm:w-[180px] md:w-[242px]
                  h-[36px] sm:h-[44px] md:h-[55px]
                  rounded-lg
                  text-xs sm:text-base md:text-2xl
                  font-extrabold
                  ${currentBanner.buttonBgColor} ${currentBanner.buttonTextColor}
                  mt-1 md:mt-[30px]
                `}
                style={{ fontFamily: "Suit-ExtraBold, sans-serif" }}
              >
                {currentBanner.buttonText}
              </Button>
            </Link>
          </div>

          {/* 이미지 영역 */}
          <div
            className={`
              absolute
              w-[45vw] h-[32vw] max-w-[180px] max-h-[130px]
              md:w-[300px] md:h-[250px] md:max-w-none md:max-h-none
              ${currentBanner.imagePosition === "right"
                ? "right-[15%] bottom-[0px] md:right-[110px] md:bottom-0"
                : "left-[15%] top-[calc(15%)] md:left-[40px] md:top-[calc(50%-125px)]"
              }
            `}
          >
            <Image
              src={currentBanner.imageSrc}
              alt={currentBanner.imageAlt}
              fill
              className="object-contain"
            />
          </div>
        </motion.div>
      </AnimatePresence>

      {/* 페이지 번호 */}
      <span
        className="absolute bottom-2 sm:bottom-4 md:bottom-4 left-2 sm:left-8 md:left-8 flex items-center justify-center
          w-[22px] sm:w-[30px] md:w-[35px] h-[15px] sm:h-[18px] md:h-[21px] rounded-xl bg-[#A7A6A7] opacity-80 text-white z-10 text-xs sm:text-sm md:text-base"
      >
        {bannerIndex + 1}/{bannerData.length}
      </span>

      {/* 버튼 컨테이너 */}
      <div
        className="absolute bottom-2 sm:bottom-4 md:bottom-4 right-2 sm:right-8 md:right-8 flex gap-1 sm:gap-2 md:gap-2 z-10"
      >
        <Button
          size="icon"
          onClick={() => paginate(-1)}
          className="w-[28px] sm:w-[36px] md:w-[40px] h-[28px] sm:h-[36px] md:h-[40px] rounded-ml bg-[#A7A6A7] opacity-80 hover:bg-[#A7A6A7] hover:bg-opacity-90 font-normal text-xs"
        >
          <ChevronLeft className="text-white size-[16px] sm:size-[20px] md:size-[24px]" />
        </Button>
        <Button
          size="icon"
          onClick={() => paginate(1)}
          className="w-[28px] sm:w-[36px] md:w-[40px] h-[28px] sm:h-[36px] md:h-[40px] rounded-ml bg-[#A7A6A7] opacity-80 hover:bg-[#A7A6A7] hover:bg-opacity-90"
        >
          <ChevronRight className="text-white size-[16px] sm:size-[20px] md:size-[24px]" />
        </Button>
      </div>
    </div>
  );
}
// 숫자를 감싸는 헬퍼 함수 (캐러셀 루프를 위함)
const wrap = (min: number, max: number, value: number) => {
  const range = max - min;
  return ((((value - min) % range) + range) % range) + min;
};