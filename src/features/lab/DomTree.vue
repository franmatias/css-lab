<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { DomTreeNode } from './model/domTree'

defineOptions({ name: 'DomTree' })
defineProps<{ nodes: DomTreeNode[]; selectedKey?: number | null }>()
const emit = defineEmits<{ inspect: [key: number | null]; select: [key: number] }>()
const { t } = useI18n()
</script>

<template>
  <ul class="lab-dom-tree-list">
    <li v-for="node in nodes" :key="node.key">
      <button
        type="button"
        class="lab-dom-tree-node"
        :class="{
          'lab-dom-tree-match': node.matches,
          'lab-dom-tree-selected': selectedKey === node.key,
        }"
        :aria-pressed="selectedKey === undefined ? undefined : selectedKey === node.key"
        @click="emit('select', node.key)"
        @mouseenter="emit('inspect', node.key)"
        @mouseleave="emit('inspect', null)"
        @focus="emit('inspect', node.key)"
        @blur="emit('inspect', null)"
      >
        <code>{{ node.label }}</code>
        <span v-if="node.matches">{{ t('lab.treeMatch') }}</span>
      </button>
      <DomTree
        v-if="node.children.length"
        :nodes="node.children"
        :selected-key="selectedKey"
        @inspect="emit('inspect', $event)"
        @select="emit('select', $event)"
      />
    </li>
  </ul>
</template>
