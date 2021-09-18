<script setup lang="ts">
import Gameboard from "./components/Gameboard.vue";
import { ref } from "vue";

const activePiece = ref(1);

function toggleActivePiece() {
  activePiece.value = activePiece.value === 1 ? 2 : 1;
}
</script>

<template>
  <div class="flex flex-col h-full items-center justify-center bg-yellow-50">
    <Gameboard :active-piece="activePiece" @chessplaced="toggleActivePiece" />
  </div>
</template>

<style></style>
