<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    variant?: 'info' | 'success' | 'warning' | 'error'
    title?: string
  }>(),
  { variant: 'info', title: undefined },
)

const styles = {
  info: 'border-brand-100 bg-brand-25 text-brand-500',
  success: 'border-success-100 bg-success-50 text-success-700',
  warning: 'border-warning-100 bg-warning-50 text-warning-700',
  error: 'border-danger-100 bg-danger-50 text-danger-700',
}

// Errors interrupt screen readers; everything else waits its turn.
const role = computed(() => (props.variant === 'error' ? 'alert' : 'status'))
</script>

<template>
  <div :role="role" class="rounded-lg border px-4 py-3 text-sm" :class="styles[variant]">
    <p v-if="title" class="font-semibold">{{ title }}</p>
    <div :class="title && 'mt-1'"><slot /></div>
  </div>
</template>
