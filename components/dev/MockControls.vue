<script setup lang="ts">
import { useQueryClient } from '@tanstack/vue-query'

// Dev tooling for the mock API. Not part of the product.
interface MockSettings {
  latencyMs: number
  submitFailure: 'none' | 'server-error' | 'conflict'
  dataset: 'clean' | 'realistic'
}

const open = ref(false)
const settings = ref<MockSettings>()
const queryClient = useQueryClient()

onMounted(async () => {
  settings.value = await $fetch<MockSettings>('/api/__mock/settings')
})

async function update(change: Partial<MockSettings>) {
  settings.value = await $fetch<MockSettings>('/api/__mock/settings', { method: 'PUT', body: change })
  if (change.dataset) await queryClient.resetQueries()
}

const groups = [
  {
    key: 'latencyMs',
    label: 'Latency',
    options: [
      { label: 'Fast', value: 0 },
      { label: 'Normal', value: 400 },
      { label: 'Slow', value: 2500 },
    ],
  },
  {
    key: 'submitFailure',
    label: 'Submit',
    options: [
      { label: 'Normal', value: 'none' },
      { label: '500', value: 'server-error' },
      { label: '409', value: 'conflict' },
    ],
  },
  {
    key: 'dataset',
    label: 'Data',
    options: [
      { label: 'Clean', value: 'clean' },
      { label: 'Realistic', value: 'realistic' },
    ],
  },
] as const
</script>

<template>
  <div class="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2 text-xs">
    <div v-if="open && settings" class="w-64 rounded-xl border border-slate-700 bg-slate-900 p-3 text-slate-200 shadow-xl">
      <p class="mb-2 font-semibold uppercase tracking-wide text-slate-400">Mock API</p>
      <fieldset v-for="group in groups" :key="group.key" class="mb-2 last:mb-0">
        <legend class="mb-1 text-slate-400">{{ group.label }}</legend>
        <div class="flex gap-1">
          <button
            v-for="option in group.options"
            :key="option.label"
            type="button"
            class="flex-1 rounded-md px-2 py-1"
            :class="settings[group.key] === option.value ? 'bg-slate-200 text-slate-900' : 'bg-slate-800 hover:bg-slate-700'"
            :aria-pressed="settings[group.key] === option.value"
            @click="update({ [group.key]: option.value })"
          >
            {{ option.label }}
          </button>
        </div>
      </fieldset>
    </div>
    <button
      type="button"
      class="rounded-full bg-slate-900 px-3 py-1.5 font-medium text-slate-200 shadow-lg hover:bg-slate-800"
      :aria-expanded="open"
      @click="open = !open"
    >
      Mock API
    </button>
  </div>
</template>
