/** POST /stokvels request body (matches backend contract). */
export interface CreateStokvelRequest {
  name: string;
  type: string;
  description: string;
  location: string;
  monthlyContribution: number;
  nasasaRegistrationNumber?: string;
}

export interface CreateStokvelResponse {
  id?: string;
}
