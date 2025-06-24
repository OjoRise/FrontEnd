import api from '@/lib/axios';
import { userRequest } from '@/types/chatbot';
import axios from 'axios';

export const planOCR = async (formData: FormData) => {
  const response = await api.post('/google/ocr', formData);
  return response.data;
};

export const gptOCR = async (info: userRequest) => {
  const response = await axios.post('/api/chat', info);
  return response.data;
}