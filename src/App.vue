<script lang="ts">
export type NumberPair = [number, number];
export function isSame(a: NumberPair, b: NumberPair) {
  return a[0] === b[0] && a[1] === b[1];
}
</script>

<script setup lang="ts">
import TheGameboard from "./components/TheGameboard.vue";
import { ref } from "vue";

const activePiece = ref(1);
const placementHistory = ref([] as NumberPair[]);

function toggleActivePiece() {
  activePiece.value = activePiece.value === 1 ? 2 : 1;
}

function onPlacement([x, y]: NumberPair) {
  placementHistory.value.push([x, y]);

  toggleActivePiece();
}

function onVictory(piece: number, trace: NumberPair[][]) {
  console.debug(piece, trace);
}
</script>

<template>
  <div class="flex flex-col h-full items-center justify-center bg-yellow-50">
    <the-gameboard
      :active-piece="activePiece"
      @chessplaced="onPlacement"
      @victory="onVictory"
    />
  </div>
</template>

<style></style>
