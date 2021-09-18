<script lang="ts">
export const SIZE = 15;
</script>

<script setup lang="ts">
import PieceCell from "./PieceCell.vue";
import { ref } from "vue";

const props = defineProps<{ activePiece: number }>();
const emit = defineEmits<{ (e: "chessplaced", idx: number): void }>();

export interface CellInfo {
  pos: {
    x: number;
    y: number;
  };
  piece: number;
}

const cellInfo = ref([] as CellInfo[]);
for (let i = 1; i <= SIZE; i++) {
  for (let j = 1; j <= SIZE; j++) {
    cellInfo.value.push({
      pos: {
        x: i,
        y: j,
      },
      piece: 0,
    });
  }
}

function placechess(idx: number) {
  if (cellInfo.value[idx].piece) return;
  cellInfo.value[idx].piece = props.activePiece;
  emit("chessplaced", idx);
}
</script>

<template>
  <div
    class="
      gameboard
      bg-yellow-200
      rounded
      shadow-md
      border-4 border-gray-500
      grid
      p-1
    "
  >
    <PieceCell
      v-for="(cell, i) in cellInfo"
      :key="i"
      :info="cell"
      :active-piece="activePiece"
      @placechess="placechess(i)"
    />
  </div>
</template>

<style scoped lang="scss">
.gameboard {
  $margin-to-screen: 1.5rem;
  $side-length: calc(100vmin - $margin-to-screen);
  width: $side-length;
  height: $side-length;

  $grid-template: repeat(v-bind(SIZE), minmax(0, 1fr));
  grid-template-columns: $grid-template;
  grid-template-rows: $grid-template;
}
</style>
