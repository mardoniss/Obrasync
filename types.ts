export enum UserRole {
  ADMIN = 'ADMIN', // Engenharia
  FIELD = 'FIELD'  // Encarregado
}

export enum IssueStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  REVIEW = 'REVIEW',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export enum IssuePriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH'
}

export interface User {
  id: string;
  username: string;
  full_name: string;
  role: UserRole;
  avatar_url?: string;
}

export interface Issue {
  id: string;
  title: string;
  description: string;
  status: IssueStatus;
  priority: IssuePriority;
  location: string;
  assigned_to?: string; // User ID
  created_by: string; // User ID
  created_at: string;
  updated_at: string;
  photo_url_before?: string;
  photo_url_after?: string;
}

export interface DashboardStats {
  total: number;
  open: number;
  inProgress: number;
  review: number;
  approved: number;
}