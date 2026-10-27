<script setup lang="ts">
import type { LoanApplicationStatus } from '~/types/loan-application'

defineProps<{ status: LoanApplicationStatus }>()

const config: Record<LoanApplicationStatus, { label: string; classes: string }> = {
  Submitted: { label: 'Submitted', classes: 'bg-brand-100 text-brand-400' },
  InReview: { label: 'In review', classes: 'bg-warning-100 text-warning-700' },
  Approved: { label: 'Approved', classes: 'bg-success-100 text-success-700' },
  Declined: { label: 'Declined', classes: 'bg-danger-100 text-danger-700' },
  Expired: { label: 'Expired', classes: 'bg-slate-100 text-slate-600' },
}
</script>

<template>
  <span
    class="inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium"
    :class="config[status].classes"
  >
    {{ config[status].label }}
  </span>
</template>
