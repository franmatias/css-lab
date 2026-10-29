import { createRouter, createWebHistory } from 'vue-router'
import { i18n } from './i18n'

declare module 'vue-router' {
  interface RouteMeta {
    titleKey?:
      | 'nav.home'
      | 'nav.theory'
      | 'nav.catalog'
      | 'nav.lab'
      | 'nav.challenges'
      | 'nav.progress'
      | 'notFound.title'
    descriptionKey?:
      | 'sections.theory'
      | 'sections.catalog'
      | 'sections.lab'
      | 'sections.challenges'
      | 'sections.progress'
    milestone?: number
  }
}

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/features/home/HomePage.vue'),
      meta: { titleKey: 'nav.home' },
    },
    {
      path: '/teoria/:slug?',
      name: 'theory',
      component: () => import('@/features/sections/SectionPage.vue'),
      meta: {
        titleKey: 'nav.theory',
        descriptionKey: 'sections.theory',
        milestone: 3,
      },
    },
    {
      path: '/catalogo/:slug?',
      name: 'catalog',
      component: () => import('@/features/sections/SectionPage.vue'),
      meta: {
        titleKey: 'nav.catalog',
        descriptionKey: 'sections.catalog',
        milestone: 3,
      },
    },
    {
      path: '/laboratorio',
      name: 'lab',
      component: () => import('@/features/lab/LabPage.vue'),
      meta: {
        titleKey: 'nav.lab',
        descriptionKey: 'sections.lab',
        milestone: 1,
      },
    },
    {
      path: '/retos/:category?/:id?',
      name: 'challenges',
      component: () => import('@/features/sections/SectionPage.vue'),
      meta: {
        titleKey: 'nav.challenges',
        descriptionKey: 'sections.challenges',
        milestone: 2,
      },
    },
    {
      path: '/progreso',
      name: 'progress',
      component: () => import('@/features/sections/SectionPage.vue'),
      meta: {
        titleKey: 'nav.progress',
        descriptionKey: 'sections.progress',
        milestone: 2,
      },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/features/sections/NotFoundPage.vue'),
      meta: { titleKey: 'notFound.title' },
    },
  ],
  scrollBehavior: () => ({ top: 0 }),
})

router.afterEach((to) => {
  const titleKey = to.meta.titleKey ?? 'nav.home'
  document.title = `${i18n.global.t(titleKey)} · CSS Lab`
})
