export type AccountType = 'PERSONAL' | 'BUSINESS';

export interface BankAccountSummary {
  bankName: string;
  accountNumber: string;
  accountType?: string;
}

export interface UserProfile {
  userId: number;
  accountType: AccountType;
  fullName: string;        // ← remove the ? — always present from /me response
  email: string;           // ← same
  phone: string;
  profileComplete: boolean;
  walletBalance: number;
  createdAt: string;

  // These are genuinely optional — only present based on account type
  address?: string;
  dob?: string;
  businessName?: string;
  businessType?: string;
  taxId?: string;
  contactPhone?: string;
  website?: string;
  businessStatus?: string;

  bankAccount?: BankAccountSummary;  // ← stays optional, handled with *ngIf as bank
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

export interface PersonalProfileRequest {
  username?: string;
  dob: string;
  address: string;
  accountHolderName: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  accountType: 'SAVINGS' | 'CHECKING';
  isPrimary: boolean;
}

export interface BusinessProfileRequest {
  username?: string;
  dob?: string;
  address: string;
  accountHolderName: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  accountType: 'SAVINGS' | 'CHECKING';
  isPrimary: boolean;
  businessName: string;
  businessType: 'SOLE_PROPRIETOR' | 'LLC' | 'CORPORATION' | 'PARTNERSHIP' | 'NON_PROFIT';
  taxId: string;
  contactPhone: string;
  website?: string;
}
