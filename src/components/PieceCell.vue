<script lang="ts">
const markers: NumberPair[] = [
  [3, 3],
  [3, 11],
  [7, 7],
  [11, 3],
  [11, 11],
];
</script>

<script setup lang="ts">
import { CellInfo, SIZE as BOARD_SIZE } from "../App.vue";
import SinglePiece from "./SinglePiece.vue";
import { computed } from "vue";
import { NumberPair } from "../App.vue";

const props = defineProps<{
  info: CellInfo;
  activePiece: number;
  hidden: boolean;
}>();

const hasMarker = computed(
  () =>
    !!markers.find(
      ([x, y]) => x === props.info.pos[0] && y === props.info.pos[1]
    )
);
</script>

<template>
  <div
    class="
      chess-piece
      text-gray-700
      relative
      flex
      items-center
      justify-center
      cursor-pointer
      group
    "
    :class="
      info.selected &&
      !hidden && [
        'bg-white',
        'bg-opacity-80',
        'ring-1',
        'ring-inset',
        'sm:ring-2',
      ]
    "
  >
    <svg class="w-full h-full cell-line stroke-current absolute">
      <line
        x1="50%"
        :y1="info.pos[1] > 0 ? '0%' : '50%'"
        x2="50%"
        :y2="info.pos[1] < BOARD_SIZE - 1 ? '100%' : '50%'"
      />
      <line
        :x1="info.pos[0] > 0 ? '0%' : '50%'"
        y1="50%"
        :x2="info.pos[0] < BOARD_SIZE - 1 ? '100%' : '50%'"
        y2="50%"
      />
      <line
        v-if="hasMarker"
        x1="50%"
        y1="50%"
        x2="50%"
        y2="50%"
        stroke-width="17.5%"
      />
    </svg>

    <single-piece
      :type="info.piece"
      v-if="info.piece && !hidden"
      :class="[
        info.victory && ['ring', 'ring-green-400', 'sm:ring-8'],
        info.latestPlacement &&
          !info.victory && ['ring', 'ring-red-500', 'sm:ring-4'],
      ]"
    />

    <single-piece
      v-else-if="info.selected && !hidden"
      :type="activePiece"
      class="opacity-90"
    />
  </div>
</template>

<style scoped>
.chess-piece {
  grid-column: calc(v-bind("info.pos[0]") + 1);
  grid-row: calc(v-bind("info.pos[1]") + 1);
}
.cell-line {
  stroke-linecap: round;
}
</style>
