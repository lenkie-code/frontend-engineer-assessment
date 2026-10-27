import type {
  CreateLoanApplicationRequest,
  LoanApplication,
  ProblemDetails,
} from '~/types/loan-application'

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly problem: ProblemDetails,
  ) {
    super(problem.title)
    this.name = 'ApiError'
  }
}

export const loanApplicationKeys = {
  all: ['loan-applications'] as const,
  detail: (id: string) => ['loan-applications', id] as const,
}

async function request<T>(
  path: string,
  options: { method?: 'GET' | 'POST'; body?: Record<string, any>; signal?: AbortSignal } = {},
): Promise<T> {
  try {
    return (await $fetch(path, options)) as T
  } catch (error) {
    if (error && typeof error === 'object' && 'statusCode' in error) {
      const { statusCode, data } = error as { statusCode?: number; data?: ProblemDetails }
      const status = statusCode ?? 0
      throw new ApiError(status, data ?? { title: 'Request failed', status })
    }
    throw error
  }
}

export const loanApplicationsApi = {
  list: (signal?: AbortSignal) => request<LoanApplication[]>('/api/loan-applications', { signal }),

  get: (id: string, signal?: AbortSignal) =>
    request<LoanApplication>(`/api/loan-applications/${encodeURIComponent(id)}`, { signal }),

  create: (body: CreateLoanApplicationRequest) =>
    request<LoanApplication>('/api/loan-applications', { method: 'POST', body }),
}
