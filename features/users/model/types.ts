import type { AuthResponse } from '@/features/auth/model/types';

/** Body for PATCH /users/:id (adjust fields to match your backend contract). */
export interface UpdateUserBody {
  cellNumber?: string;
  idNumber?: string;
  isProfileComplete?: boolean;
}

export interface UpdateUserArgs {
  id: string;
  body: UpdateUserBody;
}

export type UpdateUserResponse = AuthResponse['user'];
