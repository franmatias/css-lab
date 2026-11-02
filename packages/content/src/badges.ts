import { gameBadges } from './game'
import { workshopBadges } from './designProgress'
import { tableGameBadges } from './tableGame'
import { studioGameBadges } from './studioGames'
export const badgeDefinitions = [
  ['primer-selector', 'Primer selector', 'Resuelve tu primer reto.', 'challenges', 1],
  ...[5, 10, 25, 40, 50, 62].map((n) => [
    `retos-${n}`,
    `${n} retos`,
    `Resuelve ${n} retos.`,
    'challenges',
    n,
  ]),
  ['primera-leccion', 'Primer concepto', 'Completa una lección.', 'lessons', 1],
  ...Array.from({ length: 9 }, (_, i) => [
    `maestria-${i + 1}`,
    `Maestría M${i + 1}`,
    `Completa los retos del módulo ${i + 1} sin pistas.`,
    'module',
    i + 1,
  ]),
  ...[3, 7, 30, 100].map((n) => [
    `racha-${n}`,
    `Racha de ${n}`,
    `Practica ${n} días seguidos.`,
    'streak',
    n,
  ]),
  ['semana', 'Semana perfecta', 'Practica siete días seguidos.', 'streak', 7],
  ['regreso', 'De vuelta', 'Practica tras una pausa de al menos dos días.', 'return', 1],
  ['catalogo', 'Explorador', 'Visita veinte fichas del catálogo.', 'visits', 20],
  ['favoritos', 'Tu biblioteca', 'Guarda cinco favoritos.', 'favorites', 5],
  ['noctambulo', 'Modo noctámbulo', 'Prueba el tema oscuro.', 'dark', 1],
  ['compartir', 'Comparte lo aprendido', 'Crea un enlace del laboratorio.', 'share', 1],
  ['sin-pistas', 'Sin pistas ×5', 'Resuelve cinco retos sin pistas.', 'clean', 5],
  ['universal', 'Todo conectado', 'Prueba * en el laboratorio.', 'universal', 1],
  ['has', 'Visión relacional', 'Resuelve un reto de :has().', 'has', 1],
  ['madrugada', 'Una idea de madrugada', 'Resuelve un reto entre las 0 y las 5.', 'night', 1],
].map(([id, name, description, metric, threshold]) => ({
  id: String(id),
  name: String(name),
  description: String(description),
  metric: String(metric),
  threshold: Number(threshold),
}))
badgeDefinitions.push(...gameBadges)
badgeDefinitions.push(...workshopBadges)
badgeDefinitions.push(...tableGameBadges)
badgeDefinitions.push(...studioGameBadges)
