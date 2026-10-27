<template>
  <div class="flex min-h-screen flex-col">
    <header class="border-b border-brand-500 bg-brand-400 text-white">
      <div class="mx-auto flex h-16 max-w-5xl items-center justify-between gap-4 px-4">
        <NuxtLink to="/applications" class="flex items-baseline gap-2">
          <span class="text-xl font-bold tracking-tight">lenkie</span>
          <span class="hidden text-sm text-brand-100 sm:inline">Broker Portal</span>
        </NuxtLink>
        <nav class="flex items-center gap-1 text-sm">
          <NuxtLink
            to="/applications"
            class="rounded-lg px-3 py-2 text-brand-100 hover:bg-brand-500 hover:text-white"
            exact-active-class="bg-brand-500 text-white"
          >
            Applications
          </NuxtLink>
        </nav>
      </div>
    </header>

    <main class="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
      <slot />
    </main>

    <MockControls />
  </div>
</template>
