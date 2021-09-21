<script lang="ts">
export type NumberPair = [number, number];
export function isSame(a: NumberPair, b: NumberPair) {
  return a[0] === b[0] && a[1] === b[1];
}
</script>

<script setup lang="ts">
import TheGameboard from "./components/TheGameboard.vue";
import { ref } from "vue";
import PlayerPanel from "./components/PlayerPanel.vue";

const TOTAL_TIME = 420;

const activePiece = ref(1);
const placementHistory = ref([] as NumberPair[]);

function toggleActivePiece() {
  activePiece.value = activePiece.value === 1 ? 2 : 1;
}

let timingInterval: number | undefined;
const playerRemainingTime = ref([0, TOTAL_TIME, TOTAL_TIME]);

function onPlacement([x, y]: NumberPair) {
  placementHistory.value.push([x, y]);

  toggleActivePiece();

  if (timingInterval !== undefined) clearInterval(timingInterval);
  const timingFunction = (piece: number) => () => {
    playerRemainingTime.value[piece]--;
  };
  timingInterval = setInterval(timingFunction(activePiece.value), 1000);
  timingFunction(activePiece.value)();
}

function onVictory(piece: number, trace: NumberPair[][]) {
  console.debug(piece, trace);
}
</script>

<template>
  <div
    class="
      relative
      flex flex-col
      h-full
      items-center
      justify-center
      bg-yellow-50
    "
  >
    <the-gameboard
      :active-piece="activePiece"
      @chessplaced="onPlacement"
      @victory="onVictory"
    />

    <player-panel :time="playerRemainingTime[2]" :invert="true" />
    <player-panel :time="playerRemainingTime[1]" />
  </div>
</template>

<style></style>
