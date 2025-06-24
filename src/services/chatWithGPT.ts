import api from "@/lib/axios";

export async function chatWithGPT(question: string) {
  const response = await api.post("/api/v1/chat-gpt", question);
  console.log(response);
  return response.data;
}
