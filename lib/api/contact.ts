import api from "@/lib/api";

export interface ContactSubmission {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

export const contactApi = {
  submit: async (submission: ContactSubmission) => {
    const response = await api.post("/contact", submission);
    return response.data;
  },
};

