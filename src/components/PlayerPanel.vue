<script setup lang="ts">
import TheTimer from "./TheTimer.vue";
import SinglePiece from "./SinglePiece.vue";

import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    time: number;
    invert?: boolean;
    piece: number;
    active: boolean;
    victoryPiece: number;
  }>(),
  {
    invert: false,
  }
);

const victory = computed(() => props.piece === props.victoryPiece);
</script>

<template>
  <div
    class="
      player-panel
      absolute
      inset-x-4
      border-4 border-b-0 border-gray-600
      shadow
      rounded-t
      flex
      items-center
      justify-center
      px-5
      transition
      duration-100
    "
    :class="[
      invert ? ['top-0', 'transform', 'rotate-180'] : ['bottom-0'],
      { 'opacity-25': !active && !victoryPiece },
      victoryPiece
        ? [victory ? ['bg-red-500'] : ['bg-gray-900'], 'text-white']
        : ['bg-yellow-200'],
    ]"
  >
    <div class="absolute left-5 flex flex-col items-center justify-center">
      <div class="w-14 h-14">
        <single-piece class="w-full h-full" :type="piece" />
      </div>
      <span class="text-2xl"> 執{{ piece === 1 ? "黑" : "白" }} </span>
    </div>

    <template v-if="victoryPiece">
      <span v-if="victory" class="text-5xl font-bold"> 勝 </span>
      <span v-else class="text-5xl font-bold"> 敗 </span>
    </template>
    <span class="text-4xl" :class="active && ['font-bold']" v-else>
      {{ active ? "我方下子" : "對方下子" }}
    </span>

    <the-timer class="absolute right-5" :time="time" />
  </div>
</template>

<style scoped>
.player-panel {
  height: calc((100vh - 100vmin) / 2 - 0.5rem);
}
</style>
