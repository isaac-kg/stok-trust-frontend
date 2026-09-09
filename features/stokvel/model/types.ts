/** POST /stokvels request body (matches backend contract). */
export interface CreateStokvelRequest {
  name: string;
  type: string;
  description: string;
  location: string;
  monthlyContribution: number;
  nasasaRegistrationNumber?: string;
}

export interface FetchStokvelsResponse {
  data: Stokvel[];
  meta?: {
    currentPage?: number;
    totalPages?: number;
    totalItems?: number;
  }
}

export interface Stokvel {
  _id?: string;
  name?: string;
  description?: string;
  location?: string;
  type?: string;
  monthlyContribution?: number;
  members?: number;
  nasasaRegistrationNumber?: string;
  createdBy?: string;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface StokvelConstitutionRequest {
  purpose: string;
  membershipRules: string;
  contributionRules: string;
  payoutRules: string;
  meetingRules: string;
  disputeRules: string;
  constitutionAmendmentRules: string;
  stokvelId: string;
}

export interface StokvelConstitution extends StokvelConstitutionRequest {
  _id?: string;
  version?: number;
  createdBy?: string;
  isActive?: boolean;
  createdAt: Date;
  updatedAt: Date; 
}

export interface StokvelMember {
  _id?: string;
  userId?: string;
  stokvelId?: string;
  role?: 'administrator' | 'member';
  userDetails?: {
    profile: {
      firstName: string;
      lastName: string;
      email: string;
      cellNumber: string;
    }
  }
}