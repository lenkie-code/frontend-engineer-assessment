export default defineEventHandler(async () => {
  await delay()
  return listApplications()
})
