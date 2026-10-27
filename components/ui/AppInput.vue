<script setup lang="ts">
defineOptions({ inheritAttrs: false })

defineProps<{
  label: string
  hint?: string
  error?: string
  /** Short text shown inside the input before the value, e.g. "£". */
  prefix?: string
}>()

const model = defineModel<string>({ default: '' })
const id = useId()
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <label :for="id" class="text-sm font-medium text-slate-700">{{ label }}</label>
    <div
      class="flex h-10 items-center rounded-lg border bg-white transition-colors focus-within:ring-2 focus-within:ring-brand-200"
      :class="error ? 'border-danger-500' : 'border-slate-300'"
    >
      <span v-if="prefix" class="pl-3 text-sm text-slate-500" aria-hidden="true">{{ prefix }}</span>
      <input
        :id="id"
        v-model="model"
        v-bind="$attrs"
        class="h-full w-full min-w-0 rounded-lg bg-transparent px-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0"
        :class="prefix && 'pl-1.5'"
        :aria-invalid="error ? true : undefined"
        :aria-describedby="error || hint ? `${id}-description` : undefined"
      />
    </div>
    <p v-if="error" :id="`${id}-description`" class="text-sm text-danger-700">{{ error }}</p>
    <p v-else-if="hint" :id="`${id}-description`" class="text-sm text-slate-500">{{ hint }}</p>
  </div>
</template>
