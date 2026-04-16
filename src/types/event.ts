export type EventType = 
  | 'Airdrop'
  | 'Trading Competition'
  | 'Fee Rebate'
  | 'Listing'
  | 'Promotion'
  | 'Referral Bonus';

export type Event = {
  id: string;
  exchangeName: string;
  exchangeLogoUrl?: string;
  eventTitle: string;
  eventType: EventType;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  briefDescription: string; // 1-2 lines max
  requirements?: string; // e.g., "KYC required, min. trade $100"
  ctaLabel: string; // e.g., "Join Now", "Learn More"
  ctaUrl: string; // Link to exchange campaign page
  isSponsored: boolean; // If true, show "Sponsored" tag
};


