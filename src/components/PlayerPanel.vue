<script setup lang="ts">
import TheTimer from "./TheTimer.vue";

const props = defineProps<{ time: number; invert: boolean }>();
</script>

<template>
  <div
    class="
      player-panel
      absolute
      inset-x-4
      bg-yellow-200
      border-4 border-b-0 border-gray-600
      shadow
      rounded-t
      flex
      items-center
      justify-end
      px-5
    "
    :class="invert ? ['top-0', 'transform', 'rotate-180'] : ['bottom-0']"
  >
    <the-timer :time="time" />
  </div>
</template>

<style scoped>
.player-panel {
  height: calc((100vh - 100vmin) / 2 - 0.5rem);
}
</style>
