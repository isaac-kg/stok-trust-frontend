export interface SignUpRequest {
  firstName: string;
  lastName: string;
  email: string;
  cellNumber: string;
  password: string;
  role: 'user' | 'admin' | string;
}

export interface SignInRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    services?: {
      password?: string;
    };
    profile?: {
      firstName?: string;
      lastName?: string;
      email?: string;
      cellNumber?: string;
      idNumber?: string;
      passportNumber?: string;
      profilePhotoUrl?: string;
    };
    verifications?: {
      email?: boolean;
      cellNumber?: boolean;
    };
    role?: string;
    isAccountActive?: boolean;
  };
  accessToken: string;
  refreshToken: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: AuthResponse['user'] | null;
  accessToken: string | null;
  refreshToken: string | null;
}
