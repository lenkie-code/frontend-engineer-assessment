import type { CreateLoanApplicationRequest, ProblemDetails } from '../../../types/loan-application'
import { LOAN_PURPOSES } from '../../../types/loan-application'

const COMPANY_NUMBER = /^(?:\d{8}|[A-Z]{2}\d{6})$/
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MIN_AMOUNT = 1_000
const MAX_AMOUNT = 10_000_000

function validate(body: Partial<CreateLoanApplicationRequest>) {
  const errors: Record<string, string[]> = {}
  const add = (field: string, message: string) => (errors[field] ??= []).push(message)

  if (!body.companyName?.trim()) add('companyName', 'Company name is required.')
  else if (body.companyName.length > 160) add('companyName', 'Company name must be 160 characters or fewer.')

  if (!COMPANY_NUMBER.test(body.companyNumber?.trim().toUpperCase() ?? ''))
    add('companyNumber', 'Enter a valid Companies House number, e.g. 01234567 or SC123456.')

  if (!body.fullName?.trim()) add('fullName', 'Full name is required.')

  if (!EMAIL.test(body.email?.trim() ?? '')) add('email', 'Enter a valid email address.')

  if (typeof body.amount !== 'number' || !Number.isFinite(body.amount)) add('amount', 'Amount must be a number.')
  else if (body.amount < MIN_AMOUNT || body.amount > MAX_AMOUNT)
    add('amount', 'Amount must be between £1,000 and £10,000,000.')
  else if (Math.round(body.amount * 100) / 100 !== body.amount) add('amount', 'Amount can have at most 2 decimal places.')

  if (!LOAN_PURPOSES.includes(body.purpose as never)) add('purpose', 'Select a loan purpose.')

  return errors
}

export default defineEventHandler(async (event) => {
  await delay()
  const body = (await readBody<Partial<CreateLoanApplicationRequest>>(event)) ?? {}

  if (settings.submitFailure === 'server-error') {
    setResponseStatus(event, 500)
    return { title: 'An unexpected error occurred', status: 500 } satisfies ProblemDetails
  }

  const errors = validate(body)
  if (Object.keys(errors).length > 0) {
    setResponseStatus(event, 400)
    return { title: 'One or more validation errors occurred', status: 400, errors } satisfies ProblemDetails
  }

  const companyNumber = body.companyNumber!.trim().toUpperCase()
  const pending = listApplications().find(
    (a) => a.companyNumber === companyNumber && (a.status === 'Submitted' || a.status === 'InReview'),
  )

  if (settings.submitFailure === 'conflict' || pending) {
    setResponseStatus(event, 409)
    return {
      title: 'An application for this company is already in progress',
      status: 409,
      detail: pending
        ? `Application ${pending.id} for company ${companyNumber} is ${pending.status === 'InReview' ? 'in review' : 'awaiting review'}.`
        : `An application for company ${companyNumber} is already awaiting review.`,
    } satisfies ProblemDetails
  }

  const application = addApplication({
    companyName: body.companyName!.trim(),
    companyNumber,
    fullName: body.fullName!.trim(),
    email: body.email!.trim(),
    amount: body.amount!,
    purpose: body.purpose!,
  })

  setResponseStatus(event, 201)
  return application
})
