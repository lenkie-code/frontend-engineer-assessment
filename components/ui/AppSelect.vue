<script setup lang="ts">
defineOptions({ inheritAttrs: false })

withDefaults(
  defineProps<{
    label: string
    options: readonly string[] | readonly { label: string; value: string }[]
    placeholder?: string
    hint?: string
    error?: string
  }>(),
  { placeholder: 'Select…', hint: undefined, error: undefined },
)

const model = defineModel<string>({ default: '' })
const id = useId()

const toOption = (option: string | { label: string; value: string }) =>
  typeof option === 'string' ? { label: option, value: option } : option
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <label :for="id" class="text-sm font-medium text-slate-700">{{ label }}</label>
    <select
      :id="id"
      v-model="model"
      v-bind="$attrs"
      class="h-10 rounded-lg border bg-white px-3 text-sm text-slate-900 outline-none focus-visible:ring-2 focus-visible:ring-brand-200 focus-visible:ring-offset-0"
      :class="[error ? 'border-danger-500' : 'border-slate-300', !model && 'text-slate-400']"
      :aria-invalid="error ? true : undefined"
      :aria-describedby="error || hint ? `${id}-description` : undefined"
    >
      <option value="" disabled>{{ placeholder }}</option>
      <option v-for="option in options.map(toOption)" :key="option.value" :value="option.value" class="text-slate-900">
        {{ option.label }}
      </option>
    </select>
    <p v-if="error" :id="`${id}-description`" class="text-sm text-danger-700">{{ error }}</p>
    <p v-else-if="hint" :id="`${id}-description`" class="text-sm text-slate-500">{{ hint }}</p>
  </div>
</template>
