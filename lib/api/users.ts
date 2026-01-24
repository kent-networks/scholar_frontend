import api from "@/lib/api";

export interface UserProfile {
  id: string; // username
  userId: number; // actual user ID
  name: string;
  username: string;
  bio?: string;
  photo?: string;
  followers: number;
  following: number;
  likes: number;
  isFollowing: boolean;
  isOwnProfile: boolean;
}

export const userApi = {
  getProfile: async (username: string): Promise<UserProfile> => {
    const response = await api.get(`/users/${username}`);
    return response.data.data;
  },

  toggleFollow: async (userId: number): Promise<{ following: boolean }> => {
    const response = await api.post(`/users/${userId}/follow`);
    return response.data.data;
  },

  updateBio: async (bio: string): Promise<void> => {
    await api.put("/users/bio", { bio });
  },

  deleteProfilePhoto: async (): Promise<void> => {
    await api.delete("/users/profile-photo");
  },

  getFollowers: async (userId: number): Promise<Array<{ id: number; username: string; name: string; photo?: string | null }>> => {
    const response = await api.get(`/users/${userId}/followers`);
    return response.data.data;
  },

  getFollowing: async (userId: number): Promise<Array<{ id: number; username: string; name: string; photo?: string | null }>> => {
    const response = await api.get(`/users/${userId}/following`);
    return response.data.data;
  },
};

