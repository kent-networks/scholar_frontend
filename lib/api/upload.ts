import api from "../api";

export interface UploadVideoData {
  title: string;
  description?: string;
  subject?: string;
  year?: number;
  institution?: string;
  videoType: "research-lab" | "scoop";
}

export const uploadApi = {
  uploadVideo: async (file: File, data: UploadVideoData) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", data.title);
    if (data.description) formData.append("description", data.description);
    if (data.subject) formData.append("subject", data.subject);
    if (data.year) formData.append("year", data.year.toString());
    if (data.institution) formData.append("institution", data.institution);
    formData.append("videoType", data.videoType);

    const response = await api.post("/upload/video", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        // Progress is handled by the component
      },
    });
    return response.data;
  },

  uploadImages: async (files: File[], data?: { description?: string; subject?: string; videoType?: "research-lab" | "scoop" }) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });
    if (data?.description) formData.append("description", data.description);
    if (data?.subject) formData.append("subject", data.subject);
    if (data?.videoType) formData.append("videoType", data.videoType);

    const response = await api.post("/upload/images", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
};

