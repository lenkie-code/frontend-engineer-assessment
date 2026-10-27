export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  ssr: false,
  devtools: { enabled: false },
  modules: ['@nuxtjs/tailwindcss'],
  components: [{ path: '~/components', pathPrefix: false }],
  typescript: { strict: true },
  vite: {
    // Pre-bundle optional libraries so first use doesn't trigger a full page reload mid-interview.
    optimizeDeps: {
      include: ['@tanstack/vue-query', '@vuelidate/core', '@vuelidate/validators', '@vueuse/core', 'dayjs'],
    },
  },
  app: {
    head: {
      title: 'Lenkie Broker Portal',
      htmlAttrs: { lang: 'en-GB' },
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&display=swap',
        },
      ],
    },
  },
})
