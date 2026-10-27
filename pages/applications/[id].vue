<script setup lang="ts">
// TODO: build the application status page.
const route = useRoute()
const id = computed(() => String(route.params.id))
</script>

<template>
  <div class="flex flex-col gap-6">
    <h1 class="text-2xl font-semibold text-brand-400">Application</h1>
    <AppCard>
      <p class="text-sm text-slate-500">Nothing here yet for application {{ id }}.</p>
    </AppCard>
  </div>
</template>
