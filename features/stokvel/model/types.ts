/** POST /stokvels request body (matches backend contract). */
export interface CreateStokvelRequest {
  name: string;
  type: string;
  description: string;
  location: string;
  monthlyContribution: number;
  nasasaRegistrationNumber?: string;
}


/* 
  API TODO GET /stokvels
  Update swagger doc with example for filtering and searching usage.
  update get all stokvels response to include the following
  - memberCount // number of members in the stokvel
  - reputation // reputation of the stokvel as a number 
  - membershipRole // weather user is admin, member or pending or other
*/

  /*
    API TODO PUT/PATCH  /stokvels/:id
    Update to allow the following fields to be updated on stokvels a part of update request

    // constitution object with the following fields:
    constitution: {
      - groupPurpose : string
      - membershipRules : string
      - contributionRules : string
      - payoutRules : string
      - meetingRules : string
      - disputeRules : string
      - amendmentRules : string
    }
  */


export interface Stokvel {
  _id?: string;
  name?: string;
  type?: string;
  description?: string;
  location?: string;
  monthlyContribution?: number;
  nasasaRegistrationNumber?: string;
  isActive?: boolean;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
  memberCount?: number; //number of members in the stokvel
  reputation?: number;
  membershipRole?: 'admin' | 'member' | 'pending'; //other roles can be added later
  constitution?: {
    groupPurpose?: string;
    membershipRules?: string;
    contributionRules?: string;
    payoutRules?: string;
    meetingRules?: string;
    disputeRules?: string;
    amendmentRules?: string;
  };
}


export interface CreateStokvelResponse extends Stokvel {

}
