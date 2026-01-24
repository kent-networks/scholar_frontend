import api from "@/lib/api";

export interface Message {
  id: number;
  senderId: number;
  recipientId: number;
  content: string;
  createdAt: string;
  senderName?: string;
  senderUsername?: string;
  senderPhoto?: string;
  senderBio?: string | null;
  recipientName?: string;
  recipientUsername?: string;
  recipientPhoto?: string;
  recipientBio?: string | null;
  isRead?: boolean;
}

export interface Conversation {
  userId: number;
  name: string;
  username: string;
  photo?: string | null;
  bio?: string | null;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

export const messageApi = {
  getConversation: async (userId: number): Promise<Message[]> => {
    const response = await api.get(`/messages/${userId}`);
    return response.data.data;
  },

  getAllConversations: async (): Promise<Conversation[]> => {
    const response = await api.get("/messages/conversations");
    return response.data.data;
  },

  sendMessage: async (recipientId: number, content: string): Promise<Message> => {
    const response = await api.post("/messages", {
      recipientId,
      content,
    });
    return response.data.data;
  },

  getUnreadCount: async (): Promise<number> => {
    const response = await api.get("/messages/unread/count");
    return response.data.data.count || 0;
  },
};

