<script setup lang="ts">
import PieceCell from "./PieceCell.vue";
import { ref } from "vue";
import { NumberPair, isSame, SIZE, CellInfo } from "../App.vue";

const props = defineProps<{
  activePiece: number;
  cellInfo: CellInfo[][];
  gameStatus: number;
  paused: boolean;
}>();

const emit = defineEmits<{
  (e: "selectcell", pos: NumberPair): void;
}>();
</script>

<template>
  <div
    class="
      relative
      gameboard
      bg-yellow-200
      rounded
      shadow-md
      border-4 border-gray-500
      grid
      p-1
    "
  >
    <!-- background image -->
    <img
      src="../assets/lhsu-logo.svg"
      alt="LHSU Logo"
      class="
        filter
        hue-rotate-180
        opacity-20
        absolute
        w-3/5
        top-1/2
        left-1/2
        transform
        -translate-x-1/2 -translate-y-1/2
      "
    />
    <template v-for="(col, x) in cellInfo" :key="x">
      <piece-cell
        v-for="(cell, y) in col"
        :key="`(${x},${y})`"
        :info="cell"
        :active-piece="activePiece"
        @click="emit('selectcell', [x, y])"
        :hidden="gameStatus === 0 || paused"
      />
    </template>
  </div>
</template>

<style scoped lang="scss">
.gameboard {
  $margin-to-screen: 2rem;
  $side-length: calc(100vmin - $margin-to-screen);
  width: $side-length;
  height: $side-length;
  max-width: 768px;
  max-height: 768px;

  $grid-template: repeat(v-bind(SIZE), minmax(0, 1fr));
  grid-template-columns: $grid-template;
  grid-template-rows: $grid-template;
}
</style>
