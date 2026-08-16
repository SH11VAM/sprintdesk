export interface AuthUser {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender?: string;
  image?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
  expiresInMins?: number;
}

export interface DummyJsonLoginResponse {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
  token?: string;
  accessToken?: string;
  refreshToken?: string;
  message?: string;
}

export interface DummyJsonRefreshResponse {
  token?: string;
  accessToken?: string;
  refreshToken?: string;
  message?: string;
}

export interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isRestoringSession: boolean;
  login: (user: AuthUser, accessToken: string, refreshToken?: string) => void;
  setAccessToken: (accessToken: string) => void;
  logout: () => void;
  setRestoringSession: (isRestoring: boolean) => void;
}
