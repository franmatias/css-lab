import { mount } from '@vue/test-utils'
import { expect, it } from 'vitest'
import { createI18n } from 'vue-i18n'
import CollapsibleSidebar from './CollapsibleSidebar.vue'
import { es } from '@/shared/i18n/es'

it('keeps controlled content mounted while exposing its expanded state and control relationship', async () => {
  const wrapper = mount(CollapsibleSidebar, {
    props: { title: 'Ejemplos', modelValue: true },
    slots: { default: '<a href="#example">Abrir ejemplo</a>' },
    global: { plugins: [createI18n({ legacy: false, locale: 'es', messages: { es } })] },
  })
  const toggle = wrapper.get('button')
  const body = wrapper.get('.collapsible-sidebar-body')
  expect(toggle.attributes('aria-controls')).toBe(body.attributes('id'))
  expect(toggle.attributes('aria-expanded')).toBe('true')
  expect(toggle.attributes('aria-label')).toContain('Ejemplos')
  await toggle.trigger('click')
  expect(wrapper.emitted('update:modelValue')).toEqual([[false]])
  await wrapper.setProps({ modelValue: false })
  expect(toggle.attributes('aria-expanded')).toBe('false')
  expect(body.isVisible()).toBe(false)
  expect(wrapper.findAll('a')).toHaveLength(1)
  await toggle.trigger('click')
  expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([true])
  wrapper.unmount()
})
