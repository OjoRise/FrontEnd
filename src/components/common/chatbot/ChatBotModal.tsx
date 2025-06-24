"use client";

import { useMediaQuery } from "react-responsive";
import { Fab } from "@mui/material";
import { Image, Send, X, Maximize2, Minimize2 } from "lucide-react";
import { Button } from "../../ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../../ui/drawer";
import { Input } from "../../ui/input";
import { ChangeEvent, KeyboardEvent, memo, useCallback, useEffect, useRef, useState } from "react";
import ChatBotBubble from "./ChatBotBubble";
import { ScrollArea } from "../../ui/scroll-area";
import { useMutation } from "@tanstack/react-query";
import { useProgressing } from "@/stores/progressStore";
import LoadingLine from "../progress/LoadingLine";
import { throttle } from "lodash";
import { UserProfile } from "@/types/UserProfile";
import { ResultItem } from "@/types/ocr";
import { useOCRToGptMutation } from "@/hooks/useOCRToGptMutation";
import { isSameFile } from "@/utils/isSameFile";
import api from "@/lib/axios";

interface DialogItem {
  teller: "user" | "chatbot";
  block: (string | File | PlanItem)[];
  time: Date;
}

interface PlanItem {
  name: string;
  link: string;
}

const initialProfile: UserProfile = {
  birthdate: "",
  telecomProvider: "",
  planName: "",
  familyBundle: "",
  tongName: "",
};

function ChatBotModal() {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const [initialLoginDialog, setInitialLoginDialog] = useState<DialogItem>({
    teller: "chatbot",
    block: [
      `LG U+ 요금제 추천 도우미입니다.\n데이터 사용량, 가족 결합 여부, 요금 고민 등을 말씀해 주세요.\n\n예:\n- 유튜브를 자주 봐요\n- 가족 결합할 예정이에요\n- 무제한 요금제 쓰고 싶어요`,
    ],
    time: new Date(),
  });
  const [initialGuestDialog, setInitialGuestDialog] = useState<DialogItem>({
    teller: "chatbot",
    block: [
      `LG U+ 요금제 추천 도우미입니다.\n사진을 통해 데이터 사용량, 가족 결합 여부, 요금 고민 등을 보내주시면, 그에 맞는 요금제를 추천해드려요.\n\n예:\n- 유튜브를 자주 봐요\n- 가족 결합할 예정이에요\n- 무제한 요금제 쓰고 싶어요`,
    ],
    time: new Date(),
  });

  const inputRef = useRef<HTMLInputElement | null>(null);
  const [input, setInput] = useState("");
  const [dialog, setDialog] = useState<DialogItem[]>([]);
  const [history, setHistory] = useState<string[]>([]);

  const setGuestDialog = useCallback(() => {
    setUserProfile(initialProfile);
    setInitialGuestDialog({ ...initialGuestDialog, time: new Date() });
    setDialog([initialGuestDialog]);
  }, [initialGuestDialog]);

  const setLoginDialog = useCallback(() => {
    setInitialLoginDialog({ ...initialLoginDialog, time: new Date() });
    setDialog([initialLoginDialog]);
  }, [initialLoginDialog]);

  const onComplete = async (result: ResultItem) => {
    const ocrMessage =
      result.통신사 !== "" || result.통신사
        ? "정보를 저장했습니다."
        : "사진을 인식하지 못했습니다.";
    if (result.통신사 !== "") {
      setUserProfile({
        ...userProfile,
        telecomProvider: result.통신사,
        planName: result["요금제 이름"],
      });
    }
    setDialog((prev) => [
      ...prev,
      {
        teller: "chatbot",
        block: [ocrMessage],
        time: new Date(),
      },
    ]);
    setDisableButton(false);
  };

  const [imgFile, setImgFile] = useState<File | undefined>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { mutate } = useOCRToGptMutation(onComplete);

  const itemIndexRef = useRef(0);
  const itemsRef = useRef<PlanItem[]>([]);
  const jsonParsedRef = useRef(false);
  const textBufferRef = useRef("");
  const currentTextRef = useRef("");
  const isNewLineRef = useRef(true);
  const statusRef = useRef(false);
  const messageField = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(false);
  const [disableButton, setDisableButton] = useState(false);
  const [ambiguousCount, setAmbiguousCount] = useState(0);
  const [userProfile, setUserProfile] = useState<UserProfile>(initialProfile);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    setIsLoggedIn(localStorage.getItem("accessToken") ? true : false);
  }, []);

  useEffect(() => {
    async function updateProfile() {
      setDisableButton(true);
      if (isLoggedIn) {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
          const res = await api(`${process.env.NEXT_PUBLIC_SERVER_URL}/profile`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (res.status !== 200) {
            setGuestDialog();
            return;
          }

          const data = await res.data;

          setUserProfile({
            birthdate: data.birthdate ?? "",
            telecomProvider: data.telecomProvider ?? "",
            planName: data.planName ?? "",
            familyBundle: data.familyBundle ?? "",
            tongName: data.tongName ?? "",
          });
          setLoginDialog();
        } else {
          setGuestDialog();
        }
      } else {
        setGuestDialog();
      }
    }

    updateProfile();
    setDisableButton(false);
  }, [isLoggedIn]);

  const { setIsLoading } = useProgressing();

  const scrollToBottom = () => {
    messageField.current?.scrollIntoView({ behavior: "smooth" });
  };

  const throttledUpdateDialog = useRef(
    throttle((botBlock: DialogItem["block"]) => {
      setDialog((prev) => {
        const lastIndex = prev.length - 1;
        const updated = [...prev];
        updated[lastIndex] = {
          ...updated[lastIndex],
          block: [...botBlock],
        };
        return updated;
      });
    }, 200)
  ).current;

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (message: string) => {
      setDialog((prev) => {
        const lastIndex = prev.length - 1;
        const newEntry: DialogItem = {
          teller: "chatbot",
          block: [],
          time: new Date(),
        };
        return prev[lastIndex].teller === "user"
          ? [...prev, newEntry]
          : [...prev.slice(0, -1), newEntry];
      });

      const res = await fetch("http://localhost:8000/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: message, userProfile, history, ambiguousCount }),
      });

      if (!res.body) {
        const errorBlock = ["응답이 없습니다."];
        setDialog((prev) => [...prev, { teller: "chatbot", block: errorBlock, time: new Date() }]);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      const botBlock: DialogItem["block"] = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          if (botBlock.length === 0) {
            if (ambiguousCount < 3) botBlock.push("질문을 잘 알아듣지 못했어요.");
            else botBlock.push("질문을 잘 알아듣지 못했어요. 고객센터로 연결해드리겠습니다.");
          }

          if (statusRef.current) setHistory((prev) => [...prev, message]);

          throttledUpdateDialog(botBlock);
          break;
        }

        const chunk = decoder.decode(value, { stream: true });

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
              if (typeof parsed.status === "boolean") {
                statusRef.current = parsed.status;
                setAmbiguousCount((prev) => (parsed.status ? 0 : prev + 1));
              }
            } catch {
              continue;
            }
          }
          continue;
        }

        for (const char of chunk) {
          if (char === "\n") {
            const fullLine = currentTextRef.current;
            const trimmedLine = fullLine.trim();
            currentTextRef.current = "";
            isNewLineRef.current = true;

            if (trimmedLine) {
              const last = botBlock[botBlock.length - 1];
              if (!(typeof last === "string" && last.trim() === trimmedLine)) {
                botBlock.push(fullLine);
                throttledUpdateDialog(botBlock);
              }

              if (trimmedLine.startsWith("-")) {
                const plan = itemsRef.current[itemIndexRef.current];
                botBlock.push(plan);
                itemIndexRef.current++;
                throttledUpdateDialog(botBlock);
              }
            }
          } else {
            currentTextRef.current += char;

            if (isNewLineRef.current) {
              botBlock.push(char);
              isNewLineRef.current = false;
            } else {
              const last = botBlock[botBlock.length - 1];
              if (typeof last === "string") {
                botBlock[botBlock.length - 1] = last + char;
              } else {
                botBlock.push(char);
              }
            }

            throttledUpdateDialog(botBlock);
            await new Promise((r) => setTimeout(r, 5));
          }
        }
      }
    },
  });

  useEffect(() => {
    setIsLoading(isPending);
  }, [isPending, setIsLoading]);

  useEffect(() => scrollToBottom(), [dialog]);

  const handleClick = useCallback(async () => {
    setDisableButton(true);
    const message = input.trim();
    if (!message) {
      setDisableButton(false);
      return;
    }

    setInput("");
    itemIndexRef.current = 0;
    itemsRef.current = [];
    textBufferRef.current = "";
    currentTextRef.current = "";
    jsonParsedRef.current = false;
    isNewLineRef.current = true;

    setDialog((prev) => [...prev, { teller: "user", block: [message], time: new Date() }]);

    try {
      await mutateAsync(message);
    } catch (error) {
      console.log(error);
      setDialog((prev) => [
        ...prev.slice(0, prev.length - 1),
        { teller: "chatbot", block: ["네트워크 오류가 발생했습니다."], time: new Date() },
      ]);
    }

    setDisableButton(false);
  }, [input, mutateAsync]);

  const handleEnter = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => e.key === "Enter" && !disableButton && handleClick(),
    [handleClick, disableButton]
  );

  const handleZoom = useCallback(() => {
    setZoom(!zoom);
  }, [zoom]);

  const handleReset = useCallback(() => {
    if (isLoggedIn) {
      setInitialLoginDialog({ ...initialLoginDialog, time: new Date() });
      setDialog((prev) => [...prev, initialLoginDialog]);
    } else {
      setInitialGuestDialog({ ...initialGuestDialog, time: new Date() });
      setDialog((prev) => [...prev, initialGuestDialog]);
    }
    itemIndexRef.current = 0;
    itemsRef.current = [];
    textBufferRef.current = "";
    currentTextRef.current = "";
    jsonParsedRef.current = false;
    isNewLineRef.current = true;
    setAmbiguousCount(0);
  }, []);

  const handleOCR = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setDisableButton(true);
      const file = e.target.files?.[0];
      if (!file) {
        e.target.value = "";
        setDisableButton(false);
        return;
      }

      setDialog((prev) => [...prev, { teller: "user", block: [file], time: new Date() }]);

      if (isSameFile(file, imgFile)) {
        setDialog((prev) => [
          ...prev,
          {
            teller: "chatbot",
            block: ["동일한 사진을 입력하셨습니다. 다른 사진을 이용해주세요."],
            time: new Date(),
          },
        ]);
        e.target.value = "";
        setDisableButton(false);
        return;
      }

      e.target.value = "";
      setImgFile(file);
    },
    [imgFile]
  );

  const handleOCRClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  useEffect(() => {
    if (imgFile) {
      const formData = new FormData();
      formData.append("image", imgFile);

      mutate(formData);
    }
  }, [imgFile]);

  return (
    <Drawer modal={false}>
      <DrawerTrigger asChild>
        <Fab color="primary" aria-label="add">
          <img className="w-full h-full" src="/chatbot.svg" alt="chatbot" />
        </Fab>
      </DrawerTrigger>
      <DrawerContent
        className={`${
          !isMobile
            ? zoom
              ? "fixed bottom-0 left-0 max-w-[100%] h-screen z-50 bg-white"
              : "w-1/2 max-w-[650px] h-[80vh]"
            : "fixed bottom-0 left-0 max-w-[100%] h-screen z-50 bg-white"
        } ml-auto pr-2 pl-2 flex flex-col`}
      >
        <DrawerHeader className="flex flex-row justify-between border-b border-gray-200">
          <div onClick={handleZoom}>
            {zoom ? (
              <Minimize2 className={`text-gray-600 ${!isMobile ? "visible" : "invisible"}`} />
            ) : (
              <Maximize2 className={`text-gray-600 ${!isMobile ? "visible" : "invisible"}`} />
            )}
          </div>
          <div className="flex flex-col items-center w-full">
            <DrawerTitle>챗봇</DrawerTitle>
            <DrawerDescription>요금제 추천을 받아보세요.</DrawerDescription>
          </div>
          <DrawerClose className="hover:cursor-pointer h-fit">
            <X className="text-gray-600" />
          </DrawerClose>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto px-1 pt-4">
          <ScrollArea className="flex flex-col gap-2 w-full pr-3">
            {dialog.map((item, i) => (
              <div key={`${item}-${i}`}>
                <ChatBotBubble
                  key={`dialog-${i}`}
                  teller={item.teller}
                  block={item.block}
                  time={item.time}
                  nextTeller={dialog[i + 1]?.teller}
                  prevTeller={dialog[i - 1]?.teller}
                  zoom={zoom}
                >
                  {<LoadingLine isShow={dialog.length - 1 === i && item.block.length === 0} />}
                </ChatBotBubble>
                {item.teller === "chatbot" &&
                i === dialog.length - 1 &&
                item.block !== initialGuestDialog.block &&
                item.block !== initialLoginDialog.block ? (
                  <div className="ml-2 mb-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs px-3 py-1 rounded-xl border-gray-300 text-gray-600 hover:bg-gray-400"
                      onClick={handleReset}
                      disabled={disableButton}
                    >
                      ⏪ 처음으로
                    </Button>
                  </div>
                ) : null}
              </div>
            ))}
            <div ref={messageField} />
          </ScrollArea>
        </div>

        <DrawerFooter className="flex flex-row items-center gap-2 sticky bottom-0 bg-white pt-2 pb-4">
          <Button
            className="bg-gray-50 hover:bg-gray-200"
            onClick={handleOCRClick}
            disabled={disableButton}
          >
            <input className="hidden" type="file" onChange={handleOCR} ref={fileInputRef} />
            <Image />
          </Button>
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="border px-2 py-1"
            placeholder="메시지를 입력하세요"
            onKeyDown={handleEnter}
          />
          <Button onClick={handleClick} disabled={disableButton}>
            <Send />
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export default memo(ChatBotModal);
