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
    <div className={`flex flex-col ${teller === "user" ? "items-end" : ""} pb-2`}>
      <div
        className={`flex items-end ${
          teller === "user" ? "flex-row-reverse" : "flex-row"
        } space-x-2`}
      >
        {teller === "chatbot" && teller !== prevTeller ? (
          <div className="flex w-fit h-fit items-end gap-1 mb-1 pb-0.5">
            <img className="w-[30px] h-[30px]" src="/chatbot.svg" alt="chatbot" />
            <p className="font-[--font-pretendard] flex items-end leading-none text-[16px]">
              요플맨
            </p>
            <div className="font-[--font-pretendard] flex items-end leading-none pr-2 text-[10px] text-gray-500">
              {Number(format(time, "H")) >= 12 ? "오후" : "오전"} {format(time, "h:mm")}
            </div>
          </div>
        ) : (
          <div />
        )}
      </div>
      <div
        className={`
          font-[--font-pretendard] text-[16px]
          ${
            teller === "user"
              ? `bg-(--secondary-userChatbot-color) ml-1 mt-1 ${
                  zoom ? `max-w-2/5` : `max-w-1/2`
                } break-words whitespace-pre-wrap p-2 ${
                  nextTeller === teller
                    ? prevTeller !== teller
                      ? `rounded-tl-[16px]`
                      : ``
                    : `rounded-b-[16px] ${prevTeller !== "chatbot" ? `` : `rounded-tl-[16px]`}`
                } items-end`
              : `bg-(--secondary-chatbot-color) ml-1 mt-1 ${
                  zoom ? `max-w-2/5` : `max-w-1/2`
                } break-words whitespace-pre-wrap p-2 ${
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
  );
}

export default memo(ChatBotBubble);
