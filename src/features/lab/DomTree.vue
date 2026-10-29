<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { DomTreeNode } from './model/domTree'

defineOptions({ name: 'DomTree' })
defineProps<{ nodes: DomTreeNode[] }>()
const { t } = useI18n()
</script>

<template>
  <ul class="lab-dom-tree-list">
    <li v-for="node in nodes" :key="node.key">
      <div class="lab-dom-tree-node" :class="{ 'lab-dom-tree-match': node.matches }">
        <code>{{ node.label }}</code>
        <span v-if="node.matches">{{ t('lab.treeMatch') }}</span>
      </div>
      <DomTree v-if="node.children.length" :nodes="node.children" />
    </li>
  </ul>
</template>
