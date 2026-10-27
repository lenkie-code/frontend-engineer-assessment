export const LOAN_PURPOSES = [
  'Working capital',
  'Business expansion',
  'Equipment purchase',
  'Stock purchase',
  'Refinancing',
  'Other',
] as const

export type LoanPurpose = (typeof LOAN_PURPOSES)[number]

export type LoanApplicationStatus = 'Submitted' | 'InReview' | 'Approved' | 'Declined' | 'Expired'

export interface LoanApplication {
  id: string
  companyName: string
  /** Companies House number, e.g. "01234567" or "SC123456" */
  companyNumber: string
  fullName: string
  email: string
  /** Amount requested in GBP, e.g. 50000.5 */
  amount: number
  purpose: LoanPurpose
  status: LoanApplicationStatus
  /** ISO 8601, UTC */
  createdAt: string
  /** ISO 8601, UTC. Submitted applications expire at this time. */
  expiresAt: string
}

export interface CreateLoanApplicationRequest {
  companyName: string
  companyNumber: string
  fullName: string
  email: string
  amount: number
  purpose: LoanPurpose
}

/** RFC 7807 problem details, as returned by the backend for any non-2xx response. */
export interface ProblemDetails {
  title: string
  status: number
  detail?: string
  /** Field-level validation errors, keyed by request field name. */
  errors?: Record<string, string[]>
}
