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
      inset-x-0
      border-t border-gray-600
      shadow
      flex
      justify-between
      items-center
      py-3
      px-5
      transition
    "
    :class="[
      invert ? ['top-0', 'transform', 'rotate-180'] : ['bottom-0'],
      { 'opacity-50': !active },
      victoryPiece
        ? [victory ? ['bg-red-500'] : ['bg-gray-900'], 'text-white']
        : ['bg-yellow-200'],
    ]"
  >
    <div class="flex flex-col items-center justify-center">
      <div class="w-8 h-8">
        <single-piece class="w-full h-full" :type="piece" />
      </div>
      <span class="text-sm"> 執{{ piece === 1 ? "黑" : "白" }} </span>
    </div>

    <div class="absolute left-1/2 transform -translate-x-1/2">
      <template v-if="gameStatus === 2">
        <span v-if="victory" class="text-4xl font-bold"> 勝 </span>
        <span v-else class="text-4xl font-bold"> 敗 </span>
      </template>
      <template v-else-if="gameStatus === 0">
        <button
          class="text-lg rounded border-2 shadow w-28 py-2 border-yellow-700"
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
            text-lg
            border-2
            rounded
            shadow
            w-28
            py-1
            border-green-800
            bg-green-600
            text-white
          "
          @click="emit('confirmselection')"
          v-if="active && selection"
        >
          確認下子
        </button>
        <span class="text-xl" :class="active && ['font-bold']" v-else>
          {{ active ? "我方下子" : "對方下子" }}
        </span>
      </template>
    </div>

    <the-timer class="" :time="time" />
  </div>
</template>
