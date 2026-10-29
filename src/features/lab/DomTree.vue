<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { DomTreeNode } from './model/domTree'

defineOptions({ name: 'DomTree' })
defineProps<{ nodes: DomTreeNode[] }>()
const emit = defineEmits<{ inspect: [key: number | null] }>()
const { t } = useI18n()
</script>

<template>
  <ul class="lab-dom-tree-list">
    <li v-for="node in nodes" :key="node.key">
      <button
        type="button"
        class="lab-dom-tree-node"
        :class="{ 'lab-dom-tree-match': node.matches }"
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
        @inspect="emit('inspect', $event)"
      />
    </li>
  </ul>
</template>
