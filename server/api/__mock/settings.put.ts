import type { MockSettings } from '../../utils/store'

export default defineEventHandler(async (event) => {
  const update = (await readBody<Partial<MockSettings>>(event)) ?? {}

  if (typeof update.latencyMs === 'number') settings.latencyMs = Math.max(0, update.latencyMs)
  if (update.submitFailure) settings.submitFailure = update.submitFailure
  if (update.dataset) {
    settings.dataset = update.dataset
    seed(update.dataset)
  }

  return settings
})
