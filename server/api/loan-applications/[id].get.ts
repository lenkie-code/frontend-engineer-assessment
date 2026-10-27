import type { ProblemDetails } from '../../../types/loan-application'

export default defineEventHandler(async (event) => {
  await delay()
  const application = getApplication(getRouterParam(event, 'id') ?? '')

  if (!application) {
    setResponseStatus(event, 404)
    return { title: 'Loan application not found', status: 404 } satisfies ProblemDetails
  }

  return application
})
