export interface SignUpRequest {
  firstName: string;
  lastName: string;
  email: string;
  cellphoneNumber: string;
  password: string;
}

export interface SignInRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    firstName: string;
    lastName: string;
  };
  token: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: AuthResponse['user'] | null;
  token: string | null;
}
