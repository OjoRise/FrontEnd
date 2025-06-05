"use client";

import { useState, useRef } from "react";

interface PlanItem {
  name: string;
  link: string;
}

export default function ChatTestRoute() {
  const [input, setInput] = useState("");
  const [responseBlocks, setResponseBlocks] = useState<(string | PlanItem)[]>([]);

  const itemIndexRef = useRef(0);
  const itemsRef = useRef<PlanItem[]>([]);
  const jsonParsedRef = useRef(false);
  const textBufferRef = useRef("");
  const currentTextRef = useRef("");
  const isNewLineRef = useRef(true);

  const handleClick = async () => {
    setResponseBlocks([]);
    itemIndexRef.current = 0;
    itemsRef.current = [];
    textBufferRef.current = "";
    currentTextRef.current = "";
    jsonParsedRef.current = false;
    isNewLineRef.current = true;

    const res = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({ message: input }),
      headers: { "Content-Type": "application/json" },
    });

    if (!res.body) {
      setResponseBlocks(["❌ 응답이 없습니다."]);
      return;
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });

      // 1. 첫 줄에서 JSON 파싱 (item만)
      if (!jsonParsedRef.current) {
        textBufferRef.current += chunk;
        const newlineIndex = textBufferRef.current.indexOf("\n");
        if (newlineIndex !== -1) {
          const jsonLine = textBufferRef.current.slice(0, newlineIndex);
          textBufferRef.current = textBufferRef.current.slice(newlineIndex + 1);
          try {
            const parsed = JSON.parse(jsonLine);
            if (Array.isArray(parsed.item)) {
              itemsRef.current = parsed.item;
              jsonParsedRef.current = true;
            }
          } catch {
            continue;
          }
        }
        continue;
      }

      // 2. 이후는 본문 스트리밍
      for (const char of chunk) {
        if (char === "\n") {
          const fullLine = currentTextRef.current;
          const trimmedLine = fullLine.trim();
          currentTextRef.current = "";
          isNewLineRef.current = true;

          if (trimmedLine) {
            setResponseBlocks((prev) => {
              const last = prev[prev.length - 1];
              if (typeof last === "string" && last.trim() === trimmedLine) return prev;
              return [...prev, fullLine];
            });

            if (trimmedLine.startsWith("-") && itemIndexRef.current < itemsRef.current.length) {
              const plan = itemsRef.current[itemIndexRef.current];
              setResponseBlocks((prev) => {
                const last = prev[prev.length - 1];
                if (typeof last !== "string" && last?.name === plan.name) return prev;
                return [...prev, plan];
              });
              itemIndexRef.current++;
            }
          }
        } else {
          currentTextRef.current += char;

          if (isNewLineRef.current) {
            setResponseBlocks((prev) => [...prev, char]);
            isNewLineRef.current = false;
          } else {
            setResponseBlocks((prev) => {
              const last = prev[prev.length - 1];
              if (typeof last === "string") {
                return [...prev.slice(0, -1), last + char];
              } else {
                return [...prev, char];
              }
            });
          }

          await new Promise((r) => setTimeout(r, 5));
        }
      }
    }
  };

  return (
    <div className="w-screen min-h-screen flex flex-col gap-5 justify-center items-center p-4">
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="border px-2 py-1"
          placeholder="메시지를 입력하세요"
        />
        <button className="border px-4 py-2" onClick={handleClick}>
          전송
        </button>
      </div>

      <div className="max-w-xl w-full whitespace-pre-wrap text-left p-4 border rounded">
        {responseBlocks.map((block, i) =>
          typeof block === "string" ? (
            <div key={`text-${i}`} className="mb-1">
              {block}
            </div>
          ) : (
            <a
              key={`btn-${i}`}
              href={block.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block my-2 bg-purple-100 hover:bg-purple-200 text-purple-800 py-2 px-4 rounded text-center shadow"
            >
              {block.name} 가입하러 가기
            </a>
          )
        )}
      </div>
    </div>
  );
}
