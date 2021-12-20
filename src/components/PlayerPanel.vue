<script setup lang="ts">
import TheTimer from "./TheTimer.vue";
import SinglePiece from "./SinglePiece.vue";

import { computed } from "vue";
import { NumberPair } from "../App.vue";

const props = withDefaults(
  defineProps<{
    time: number;
    gameCount: number;
    invert?: boolean;
    victoryCount: number;
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
  (e: "ready"): void;
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
      transform
      sm:inset-x-4 sm:border-l sm:border-r sm:rounded-t
      border-t border-gray-600
      shadow
      flex
      justify-between
      items-center
      py-3
      px-5
      sm:px-10 sm:py-6
      transition
    "
    :class="[
      invert ? ['top-0', 'rotate-180'] : ['bottom-0'],
      { 'opacity-50': !active },
      victoryPiece
        ? [victory ? ['bg-red-500'] : ['bg-gray-900'], 'text-white']
        : ['bg-yellow-300'],
    ]"
  >
    <div class="flex flex-col items-center justify-center">
      <span class="font-bold text-xl mb-0.5">{{ victoryCount }} 勝</span>
      <div class="w-8 h-8 sm:w-10 sm:h-10">
        <single-piece class="w-full h-full" :type="piece" />
      </div>
      <span class="text-sm sm:text-base">
        執{{ piece === 1 ? "黑" : "白" }}
      </span>
    </div>

    <div class="absolute left-1/2 transform -translate-x-1/2">
      <div v-if="gameStatus === 2" class="flex items-center">
        <span class="text-4xl font-bold sm:text-6xl">
          {{ victory ? "勝" : "敗" }}
        </span>

        <button
          class="
            rounded
            border-2
            shadow
            w-28
            py-2
            ml-16
            sm:text-3xl sm:w-44 sm:py-4
          "
          :class="
            ready ? ['bg-green-600', 'text-white'] : ['bg-white', 'text-black']
          "
          @click="emit('ready')"
        >
          {{ ready ? "已準備" : "準備下一局" }}
        </button>
      </div>
      <template v-else-if="gameStatus === 0">
        <button
          class="
            text-lg
            rounded
            border-2
            shadow
            w-28
            py-2
            sm:text-3xl sm:w-44 sm:py-4
          "
          :class="
            ready ? ['bg-green-600', 'text-white'] : ['bg-white', 'text-black']
          "
          @click="emit('ready')"
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
            sm:py-4 sm:text-3xl sm:w-44
          "
          @click="emit('confirmselection')"
          v-if="active && selection"
        >
          確認下子
        </button>
        <span
          class="text-xl sm:text-3xl"
          :class="active && ['font-bold']"
          v-else
        >
          {{ active ? "我方下子" : "對方下子" }}
        </span>
      </template>
    </div>

    <div class="flex flex-col items-center">
      <the-timer class="" :time="time" />
      <span> 第 {{ gameCount }} 局 </span>
    </div>
  </div>
</template>
