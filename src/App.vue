<script lang="ts">
export type NumberPair = [number, number];
export function isSame(a: NumberPair, b: NumberPair) {
  return a[0] === b[0] && a[1] === b[1];
}
</script>

<script setup lang="ts">
import TheGameboard from "./components/TheGameboard.vue";
import { ref, watch } from "vue";
import PlayerPanel from "./components/PlayerPanel.vue";

const TOTAL_TIME = 420;

const activePiece = ref(1);
const placementHistory = ref([] as NumberPair[]);

function toggleActivePiece() {
  activePiece.value = activePiece.value === 1 ? 2 : 1;
}

let timingInterval: number | undefined;
const playerRemainingTime = ref([0, TOTAL_TIME, TOTAL_TIME]);
const timingFunction = (piece: number) => () => {
  playerRemainingTime.value[piece] -= 0.1;

  if (playerRemainingTime.value[piece] <= 0) {
    onVictory(piece === 1 ? 2 : 1, []);
    playerRemainingTime.value[piece] = 0;
  }
};

const gameStatus = ref(0); // 0 - waiting for players, 1 - in game, 2 - end
const playerReady = ref([true, false, false]);
function onReady(piece: number, status: boolean) {
  playerReady.value[piece] = status;
}
watch(
  playerReady,
  (v) => {
    if (v.every((v) => v)) {
      gameStatus.value = 1;
      timingInterval = setInterval(timingFunction(activePiece.value), 100);
    }
  },
  { deep: true }
);

const victory = ref(0);
function onVictory(piece: number, trace: NumberPair[][]) {
  victory.value = piece;
  if (timingInterval !== undefined) clearInterval(timingInterval);
  gameStatus.value = 2;
}

function onPlacement([x, y]: NumberPair) {
  placementHistory.value.push([x, y]);

  toggleActivePiece();

  if (timingInterval !== undefined) clearInterval(timingInterval);

  if (!victory.value)
    timingInterval = setInterval(timingFunction(activePiece.value), 100);
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
      font-sans
    "
  >
    <the-gameboard
      :active-piece="activePiece"
      :disabled="gameStatus !== 1"
      @chessplaced="onPlacement"
      @victory="onVictory"
    />

    <player-panel
      :time="playerRemainingTime[2]"
      :piece="2"
      :invert="true"
      :game-status="gameStatus"
      :active-piece="activePiece"
      :victory-piece="victory"
      :ready="playerReady[2]"
      @ready="onReady"
    />
    <player-panel
      :time="playerRemainingTime[1]"
      :game-status="gameStatus"
      :active-piece="activePiece"
      :piece="1"
      :victory-piece="victory"
      :ready="playerReady[1]"
      @ready="onReady"
    />
  </div>
</template>

<style></style>
