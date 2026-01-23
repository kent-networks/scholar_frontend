import api from "@/lib/api";

export interface Message {
  id: number;
  senderId: number;
  recipientId: number;
  content: string;
  createdAt: string;
  senderName?: string;
  senderPhoto?: string;
  recipientName?: string;
  recipientPhoto?: string;
  isRead?: boolean;
}

export const messageApi = {
  getConversation: async (userId: number): Promise<Message[]> => {
    const response = await api.get(`/messages/${userId}`);
    return response.data.data;
  },

  sendMessage: async (recipientId: number, content: string): Promise<Message> => {
    const response = await api.post("/messages", {
      recipientId,
      content,
    });
    return response.data.data;
  },
};

