<script setup lang="ts">
import Gameboard from "./components/Gameboard.vue";
import { ref } from "vue";

const activePiece = ref(1);
const placementHistory = ref([] as [number, number][]);

function toggleActivePiece() {
  activePiece.value = activePiece.value === 1 ? 2 : 1;
}

function onPlacement([x, y]: [number, number]) {
  placementHistory.value.push([x, y]);

  toggleActivePiece();
}
</script>

<template>
  <div class="flex flex-col h-full items-center justify-center bg-yellow-50">
    <Gameboard :active-piece="activePiece" @chessplaced="onPlacement" />
  </div>
</template>

<style></style>
