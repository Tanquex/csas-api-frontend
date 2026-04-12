import { User } from './user.model';

export interface LoginRequest {
  username: string;
  password?: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user?: User;
}