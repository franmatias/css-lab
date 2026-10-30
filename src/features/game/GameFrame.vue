<script setup lang="ts">
import { computed, ref } from 'vue'
import { useElementSize } from '@vueuse/core'
const props = defineProps<{ document: string; width: string; fit: boolean; title: string }>()
const host = ref<HTMLElement | null>(null)
const { width: available } = useElementSize(host)
const scale = computed(() =>
  props.fit ? Math.min(1, Math.max(1, available.value - 4) / Number(props.width)) : 1,
)
</script>
<template>
  <div
    ref="host"
    class="studio-frame"
    tabindex="0"
    role="region"
    :aria-label="`${title}, zona desplazable`"
  >
    <div :style="{ width: `${Number(width) * scale + 2}px`, height: `${520 * scale + 2}px` }">
      <iframe
        :srcdoc="document"
        :title="title"
        sandbox=""
        referrerpolicy="no-referrer"
        :style="{ width: `${width}px`, height: '520px', transform: `scale(${scale})` }"
      />
    </div>
  </div>
</template>
<style>
.studio-frame {
  width: 100%;
  overflow: auto;
  border: 1px solid var(--border-strong);
  border-radius: 0.6rem;
  background: var(--surface-2);
}
.studio-frame iframe {
  display: block;
  box-sizing: content-box;
  min-height: 0;
  max-width: none;
  border: 0;
  background: white;
  transform-origin: top left;
}
.studio-frame > div {
  position: relative;
}
</style>
