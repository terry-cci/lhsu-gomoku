<script lang="ts">
const markers = [
  [4, 4],
  [4, 12],
  [8, 8],
  [12, 4],
  [12, 12],
];
</script>

<script setup lang="ts">
import { CellInfo, SIZE as BOARD_SIZE } from "./Gameboard.vue";
import SinglePiece from "./SinglePiece.vue";
import { computed } from "vue";

const props = defineProps<{ info: CellInfo; activePiece: number }>();
const emit = defineEmits<{ (e: "placechess"): void }>();

const hasMarker = computed(
  () =>
    !!markers.find(([x, y]) => x === props.info.pos.x && y === props.info.pos.y)
);
</script>

<template>
  <div
    class="
      chess-piece
      bg-white bg-opacity-0
      hover:bg-opacity-80
      text-gray-600
      relative
      flex
      items-center
      justify-center
      cursor-pointer
      group
      transition
      duration-75
    "
    @click="emit('placechess')"
  >
    <svg class="w-full h-full cell-line stroke-current absolute">
      <line
        x1="50%"
        :y1="info.pos.y > 1 ? '0%' : '50%'"
        x2="50%"
        :y2="info.pos.y < BOARD_SIZE ? '100%' : '50%'"
      />
      <line
        :x1="info.pos.x > 1 ? '0%' : '50%'"
        y1="50%"
        :x2="info.pos.x < BOARD_SIZE ? '100%' : '50%'"
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

    <SinglePiece :type="info.piece" v-if="info.piece" />
    <SinglePiece
      :type="activePiece"
      v-else
      class="transition duration-75 opacity-0 group-hover:opacity-80"
    />
  </div>
</template>

<style scoped>
.chess-piece {
  grid-column: v-bind("info.pos.x");
  grid-row: v-bind("info.pos.y");
}
.cell-line {
  stroke-linecap: round;
}
</style>
