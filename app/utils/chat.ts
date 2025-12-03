// utils/chat.ts
import { fetchWithToken } from '@/app/utils/fetchWithToken';

export interface Participant {
  _id: string;
  fullName: string;
  profilePicture?: { url: string };
}

export interface Conversation {
  _id: string;
  participants: Participant[];
  lastMessageAt: string;
  // you can extend with unreadCounts later
}

export const getConversations = async (): Promise<Conversation[]> => {
  const res = await fetchWithToken<{ conversations: Conversation[] }>('/v1/chat/conversations');
  return res?.conversations || [];
};