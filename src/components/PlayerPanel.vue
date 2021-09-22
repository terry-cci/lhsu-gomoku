<script setup lang="ts">
import TheTimer from "./TheTimer.vue";
import SinglePiece from "./SinglePiece.vue";

import { computed } from "vue";
import { NumberPair } from "../App.vue";

const props = withDefaults(
  defineProps<{
    time: number;
    invert?: boolean;
    piece: number;
    activePiece: number;
    gameStatus: number;
    victoryPiece: number;
    ready: boolean;
    selection: NumberPair | null;
  }>(),
  {
    invert: false,
  }
);

const emit = defineEmits<{
  (e: "ready", piece: number, status: boolean): void;
  (e: "confirmselection"): void;
}>();

const victory = computed(() => props.piece === props.victoryPiece);
const active = computed(() => {
  if (props.gameStatus === 1) return props.activePiece === props.piece;
  return true;
});
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
      { 'opacity-50': !active },
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

    <template v-if="gameStatus === 2">
      <span v-if="victory" class="text-5xl font-bold"> 勝 </span>
      <span v-else class="text-5xl font-bold"> 敗 </span>
    </template>
    <template v-else-if="gameStatus === 0">
      <button
        class="text-4xl rounded border-4 shadow-md w-1/3 py-4 border-yellow-900"
        :class="
          ready
            ? ['bg-yellow-800', 'text-white']
            : ['bg-yellow-50 text-black', 'hover:bg-yellow-100']
        "
        @click="emit('ready', piece, !ready)"
      >
        {{ ready ? "已準備" : "準備" }}
      </button>
    </template>
    <template v-else>
      <button
        class="
          border-4
          rounded
          shadow-md
          w-1/3
          py-4
          text-4xl
          border-green-800
          bg-green-600
          text-white
        "
        @click="emit('confirmselection')"
        v-if="active && selection"
      >
        確認下子
      </button>
      <span class="text-4xl" :class="active && ['font-bold']" v-else>
        {{ active ? "我方下子" : "對方下子" }}
      </span>
    </template>

    <the-timer class="absolute right-5" :time="time" />
  </div>
</template>

<style scoped>
.player-panel {
  height: calc((100vh - 100vmin) / 2 - 0.5rem);
}
</style>
