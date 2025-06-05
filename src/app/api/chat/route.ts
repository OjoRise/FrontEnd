import { YOPLE_PROMPT } from "@/prompt/yoplePrompt";
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_SECRET_KEY!,
  organization: process.env.OPENAI_ORGANIZATION_ID!,
});

export const POST = async (req: Request) => {
  try {
    const { message: userMessage } = await req.json(); // 이름 충돌 방지

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      stream: false,
      messages: [
        { role: "system", content: YOPLE_PROMPT },
        { role: "user", content: userMessage },
      ],
    });

    const full = completion.choices[0].message?.content ?? "";

    // JSON 형식 파싱
    const parsed = JSON.parse(full);
    const messageText = parsed.message;
    const items = parsed.item;

    const encoder = new TextEncoder();

    const readable = new ReadableStream({
      async start(controller) {
        // 먼저 item을 JSON으로 전달
        controller.enqueue(encoder.encode(JSON.stringify({ item: items }) + "\n"));

        // message를 한 글자씩 스트리밍
        for (let i = 0; i < messageText.length; i++) {
          await new Promise((r) => setTimeout(r, 15)); // 타자 효과
          controller.enqueue(encoder.encode(messageText[i]));
        }

        controller.close();
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
};
