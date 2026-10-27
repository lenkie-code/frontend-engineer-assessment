<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
import dayjs from 'dayjs'
import { loanApplicationKeys, loanApplicationsApi } from '~/services/loan-applications'

const {
  data: applications,
  isPending,
  isError,
  refetch,
} = useQuery({
  queryKey: loanApplicationKeys.all,
  queryFn: ({ signal }) => loanApplicationsApi.list(signal),
})

const gbp = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' })
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-semibold text-brand-400">Applications</h1>
        <p class="text-sm text-slate-500">Loan applications you've submitted for your clients.</p>
      </div>
      <AppButton to="/applications/new">New application</AppButton>
    </div>

    <AppCard :padded="false">
      <div v-if="isPending" class="flex flex-col gap-3 p-6">
        <AppSkeleton v-for="n in 5" :key="n" class="h-10" />
      </div>

      <div v-else-if="isError" class="p-6">
        <AppAlert variant="error" title="We couldn't load your applications">
          <AppButton variant="secondary" size="sm" class="mt-2" @click="refetch()">Try again</AppButton>
        </AppAlert>
      </div>

      <div v-else-if="!applications?.length" class="p-10 text-center">
        <p class="font-medium">No applications yet</p>
        <p class="mt-1 text-sm text-slate-500">Applications you submit will appear here.</p>
      </div>

      <table v-else class="w-full table-fixed text-left text-sm">
        <thead class="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th scope="col" class="px-6 py-3 font-medium">Company</th>
            <th scope="col" class="hidden w-40 px-6 py-3 text-right font-medium sm:table-cell">Amount</th>
            <th scope="col" class="hidden w-48 px-6 py-3 font-medium md:table-cell">Submitted</th>
            <th scope="col" class="w-32 px-6 py-3 font-medium">Status</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr v-for="application in applications" :key="application.id" class="hover:bg-slate-50">
            <td class="px-6 py-3">
              <NuxtLink
                :to="`/applications/${application.id}`"
                class="block truncate font-medium text-brand-400 hover:underline"
                :title="application.companyName"
              >
                {{ application.companyName }}
              </NuxtLink>
              <span class="block truncate text-slate-500">{{ application.fullName }}</span>
            </td>
            <td class="hidden px-6 py-3 text-right tabular-nums sm:table-cell">{{ gbp.format(application.amount) }}</td>
            <td class="hidden whitespace-nowrap px-6 py-3 text-slate-500 md:table-cell">
              {{ dayjs(application.createdAt).format('D MMM YYYY, HH:mm') }}
            </td>
            <td class="px-6 py-3"><StatusBadge :status="application.status" /></td>
          </tr>
        </tbody>
      </table>
    </AppCard>
  </div>
</template>
