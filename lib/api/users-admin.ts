import api from "@/lib/api";

export type AdminUserRole = "student" | "educator" | "creator" | "admin";

export interface AdminUser {
  id: number;
  email: string;
  name: string;
  username: string;
  role: AdminUserRole;
  bio?: string | null;
  profilePhotoPath?: string | null;
  institution?: string | null;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminUsersQuery {
  search?: string;
  role?: AdminUserRole | "";
  isActive?: "true" | "false" | "";
  limit?: number;
  offset?: number;
}

export interface AdminUsersResponse {
  data: AdminUser[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

export const userAdminApi = {
  getUsers: async (params: AdminUsersQuery): Promise<AdminUsersResponse> => {
    const response = await api.get("/users", { params });
    return {
      data: response.data.data,
      pagination: response.data.pagination,
    };
  },

  toggleActiveStatus: async (userId: number): Promise<{ isActive: boolean }> => {
    const response = await api.put(`/users/${userId}/active-status`);
    return response.data.data;
  },
};

