"use client";
import { useSearchParams } from "next/navigation";

export default function Head() {
  const typeKey = useSearchParams();
  const resultAge = typeKey.get("resultAge") || "10대";
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const url = `${baseUrl}/test-plan-age/result/${typeKey}`;
  const imageUrl = `${baseUrl}/planAge/${typeKey}.svg`;

  return (
    <>
      <title>통신 연령 - {resultAge}</title>
      <meta property="og:title" content={`나의 통신 연령은 ${resultAge}`} />
      <meta
        property="og:description"
        content="LG U+ 통신 연령 테스트로 내 통신 연령도 보고 요금제까지 추천받아보세요!"
      />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={imageUrl} />
      <meta name="twitter:card" content="summary_large_image" />
    </>
  );
}
