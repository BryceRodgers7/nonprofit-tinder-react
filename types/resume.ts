// Shared TypeScript types for Resume data across frontend and backend

export interface Resume {
  id: string;
  fileName: string;
  fileType: string;
  fullName: string | null;
  email: string | null;
  phone: string | null;
  lastJob: string | null;
  lastCompany: string | null;
  yearsExperience: string | null;
  technicalSkills: string[];
  education: string | null;
  summary: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface UploadResponse {
  success: boolean;
  fileName: string;
  fileType: string;
  extractedText: string;
  error?: string;
}

export interface ExtractResponse {
  success: boolean;
  resume: Resume;
  error?: string;
}

export interface ResumesResponse {
  success: boolean;
  resumes: Resume[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  error?: string;
}

