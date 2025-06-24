"use client";
import { memo, PropsWithChildren } from "react";
import { format } from "date-fns";

interface ChatBotBubbleProp {
  teller: "user" | "chatbot";
  block: (
    | string
    | File
    | {
        name: string;
        link: string;
      }
  )[];
  time: Date;
  nextTeller: string;
  prevTeller: string;
  zoom: boolean;
}

function ChatBotBubble({
  teller,
  block,
  time,
  nextTeller,
  prevTeller,
  zoom,
  children,
}: PropsWithChildren<ChatBotBubbleProp>) {
  return (
    <div className={`flex ${teller === "user" ? "flex-row-reverse items-end" : "flex-row"} w-full`}>
      <div className="flex items-start">
        <div className="flex w-fit h-fit items-end gap-2">
          {teller === "chatbot" && teller !== prevTeller ? (
            <div className="w-[48px] h-[48px]">
              <img className="w-[48px] h-[48px]" src="/chatbot.svg" alt="chatbot" />
            </div>
          ) : teller === "chatbot" ? (
            <div className="w-[48px] h-[48px]" />
          ) : null}
        </div>
      </div>
      <div className={`${teller === "user" ? "items-end" : ""} flex flex-col gap-1 pb-1 w-full`}>
        <div className={`flex gap-2 pl-1 ${teller === "user" ? "justify-end" : ""}`}>
          {teller === "chatbot" && teller !== prevTeller ? (
            <p className="font-[--font-pretendard] flex items-end leading-none text-[16px]">홀맨</p>
          ) : (
            <div />
          )}
          {teller !== prevTeller ? (
            <div className="font-[--font-pretendard] flex items-end leading-none pr-2 text-[16px] text-gray-500">
              {Number(format(time, "H")) >= 12 ? "오후" : "오전"} {format(time, "h:mm")}
            </div>
          ) : (
            <div />
          )}
        </div>
        <div
          className={`p-3 pt-2
          font-[--font-pretendard] text-[16px]
          ${
            teller === "user"
              ? `bg-(--primary-medium) ml-1 mt-1 ${
                  zoom ? `max-w-2/5` : `max-w-1/2`
                } break-words whitespace-pre-wrap ${
                  nextTeller === teller
                    ? prevTeller !== teller
                      ? `rounded-tl-[16px]`
                      : ``
                    : `rounded-b-[16px] ${prevTeller !== "chatbot" ? `` : `rounded-tl-[16px]`}`
                } items-end`
              : `bg-white ml-1 mt-1 ${
                  zoom ? `max-w-2/5` : `max-w-1/2`
                } break-words whitespace-pre-wrap ${
                  nextTeller === teller
                    ? prevTeller !== teller
                      ? `rounded-tr-[16px]`
                      : ``
                    : `rounded-b-[16px] ${prevTeller === "chatbot" ? `` : `rounded-tr-[16px]`}`
                }`
          }`}
        >
          {children}
          {block.map((item, i) =>
            typeof item === "string" ? (
              <span key={`text-${i}`}>
                {item}
                <br />
              </span>
            ) : item instanceof File ? (
              <img
                key={i}
                src={URL.createObjectURL(item)}
                alt={item.name}
                className="w-[100px] h-[150px]"
              />
            ) : (
              <a
                key={`plan-${item.name}-${i}`}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block my-2 bg-(--primary-light) hover:bg-(--secondary-hover-color) text-white py-2 px-4 rounded text-center shadow"
              >
                {item.name} 가입하러 가기
                <br />
              </a>
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default memo(ChatBotBubble);
