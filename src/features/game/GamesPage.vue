<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import {
  PanelsTopLeft,
  Columns3,
  Grid2X2,
  Smartphone,
  Table2,
  Orbit,
  ArrowRight,
} from '@lucide/vue'
import { useLearningStore } from '@/shared/model/learningStore'
const store = useLearningStore()
const games = computed(() => [
  {
    title: 'Semántica',
    text: 'Reconoce cabeceras, navegación, artículos y otras partes de una página. Encuentra el selector que marca exactamente el objetivo.',
    path: '/juego/semantica',
    icon: PanelsTopLeft,
    count: 6,
    done: store.studioCompleted('semantica'),
  },
  {
    title: 'Flexbox',
    text: 'Organiza elementos en un eje, reparte espacio y permite que las tarjetas cambien de línea. Construye el resultado con CSS.',
    path: '/juego/flexbox',
    icon: Columns3,
    count: 6,
    done: store.studioCompleted('flexbox'),
  },
  {
    title: 'Grid CSS',
    text: 'Diseña filas, columnas y áreas. Compara el objetivo con tu código y resuelve cada composición paso a paso.',
    path: '/juego/grid',
    icon: Grid2X2,
    count: 6,
    done: store.studioCompleted('grid'),
  },
  {
    title: 'Responsive',
    text: 'Adapta componentes y páginas a distintos tamaños. Prueba anchos reales y utiliza media queries y medidas fluidas.',
    path: '/juego/responsive',
    icon: Smartphone,
    count: 6,
    done: store.studioCompleted('responsive'),
  },
  {
    title: 'Tablas',
    text: 'Selecciona celdas, filas y columnas con pseudoclases. Practica también estados al pasar el puntero o usar el teclado.',
    path: '/juego/tablas',
    icon: Table2,
    count: 12,
    done: store.tableGamesCompleted,
  },
  {
    title: 'Galaxia de selectores',
    text: 'Conecta planetas mediante selectores CSS. Completa las constelaciones en el escenario espacial original.',
    path: '/juego/galaxia',
    icon: Orbit,
    count: 12,
    done: store.gamesCompleted,
  },
])
</script>
<template>
  <section class="learning-page games-page">
    <p class="eyebrow">UN RETO. UN EXPERIMENTO. TU SIGUIENTE LOGRO.</p>
    <h1 id="page-title" tabindex="-1">Juegos</h1>
    <p class="section-intro">
      Elige un recorrido: 48 misiones para practicar selectores, estructura y diseño CSS. Cada juego
      conserva sus avances, pistas y puntos.
    </p>
    <div class="games-catalog">
      <article v-for="game in games" :key="game.path" class="learning-card game-catalog-card">
        <component :is="game.icon" :size="36" aria-hidden="true" />
        <h2>
          <RouterLink :to="game.path">{{ game.title }}</RouterLink>
        </h2>
        <p>{{ game.text }}</p>
        <progress
          :value="game.done"
          :max="game.count"
          :aria-label="`Progreso de ${game.title}`"
        /><small>{{ game.done }} de {{ game.count }} misiones completadas</small
        ><RouterLink class="text-link" :to="game.path"
          >{{ game.done ? 'Continuar recorrido' : 'Empezar a jugar' }}
          <ArrowRight :size="17" aria-hidden="true"
        /></RouterLink>
      </article>
    </div>
  </section>
</template>
<style>
.games-catalog {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
  margin-top: 1.5rem;
}
.game-catalog-card {
  align-items: stretch;
}
.game-catalog-card > svg {
  color: var(--primary);
  margin-bottom: 0.8rem;
}
.game-catalog-card h2 {
  font-size: 1.25rem;
}
.game-catalog-card p {
  flex: 1;
  color: var(--text-muted);
}
.game-catalog-card progress {
  width: 100%;
  height: 8px;
  accent-color: var(--primary);
  margin-top: 1rem;
}
.game-catalog-card small {
  color: var(--text-muted);
  margin: 0.5rem 0;
}
@media (max-width: 950px) {
  .games-catalog {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 600px) {
  .games-catalog {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
