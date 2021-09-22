<script lang="ts">
export type NumberPair = [number, number];
export function isSame(a: NumberPair, b: NumberPair) {
  return a[0] === b[0] && a[1] === b[1];
}

export const SIZE = 15;
export type CellInfo = {
  pos: NumberPair;
  piece: number;
  power: number[];
  victory: boolean;
  selected: boolean;
  latestPlacement: boolean;
};

const COUNT_TO_VICTORY = 5;
const DIRECTIONS = [
  { dPos: [-1, -1], powerIdx: 0 },
  { dPos: [0, -1], powerIdx: 1 },
  { dPos: [1, -1], powerIdx: 2 },
  { dPos: [-1, 0], powerIdx: 3 },
  { dPos: [1, 0], powerIdx: 3 },
  { dPos: [-1, 1], powerIdx: 2 },
  { dPos: [0, 1], powerIdx: 1 },
  { dPos: [1, 1], powerIdx: 0 },
];
export const TOTAL_TIME = 420;
</script>

<script setup lang="ts">
import TheGameboard from "./components/TheGameboard.vue";
import { ref, watch } from "vue";
import PlayerPanel from "./components/PlayerPanel.vue";

// gameboard
const cellInfo = ref<CellInfo[][]>([]);
for (let i = 0; i < SIZE; i++) {
  cellInfo.value.push([]);
  for (let j = 0; j < SIZE; j++) {
    cellInfo.value[i].push({
      pos: [i, j],
      piece: 0,
      power: [],
      victory: false,
      selected: false,
      latestPlacement: false,
    });
  }
}
function isInBound([x, y]: NumberPair) {
  return !(x < 0 || x >= SIZE || y < 0 || y >= SIZE);
}
function getCell([x, y]: NumberPair) {
  return cellInfo.value[x][y];
}
function getPowerTrace([x, y]: NumberPair, powerIdx: number) {
  const piece = getCell([x, y]).piece;
  const trace: NumberPair[] = [[x, y]];

  DIRECTIONS.filter((d) => d.powerIdx === powerIdx).forEach(
    ({ dPos: [dx, dy] }) => {
      for (
        let i = 1;
        isInBound([x + dx * i, y + dy * i]) &&
        getCell([x + dx * i, y + dy * i]).piece === piece;
        i++
      ) {
        trace.push([x + dx * i, y + dy * i]);
      }
    }
  );

  return trace;
}
function calcPower([x, y]: NumberPair) {
  const cell = getCell([x, y]);
  const piece = cell.piece;
  cell.power = [1, 1, 1, 1];

  // calc power of the cell
  DIRECTIONS.forEach(({ dPos: [dx, dy], powerIdx }) => {
    if (
      isInBound([x + dx, y + dy]) &&
      getCell([x + dx, y + dy]).piece === piece
    ) {
      cell.power[powerIdx] += getCell([x + dx, y + dy]).power[powerIdx];
    }
  });

  // update power of the cells connected
  DIRECTIONS.forEach(({ dPos: [dx, dy], powerIdx }) => {
    for (
      let i = 1;
      isInBound([x + dx * i, y + dy * i]) &&
      getCell([x + dx * i, y + dy * i]).piece === piece;
      i++
    ) {
      getCell([x + dx * i, y + dy * i]).power[powerIdx] = cell.power[powerIdx];
    }
  });

  // victory detected
  if (cell.power.some((v) => v >= COUNT_TO_VICTORY)) {
    const trace = cell.power
      .map((v, i) => ({ idx: i, v }))
      .filter((info) => info.v >= COUNT_TO_VICTORY)
      .map((info) => getPowerTrace([x, y], info.idx));

    onVictory(cell.piece, trace);
  }
}

// placement
const activePiece = ref(1);
const placementHistory = ref<{ pos: NumberPair; piece: number }[]>([]);
function toggleActivePiece() {
  activePiece.value = activePiece.value === 1 ? 2 : 1;
}
function placechess([x, y]: NumberPair, piece: number) {
  if (getCell([x, y]).piece) return;

  placementHistory.value.push({ pos: [x, y], piece });
  toggleActivePiece();
  getCell([x, y]).piece = piece;
  calcPower([x, y]);
  latestPlacement.value = [x, y];

  if (timingInterval !== undefined) clearInterval(timingInterval);
  if (gameStatus.value === 1)
    timingInterval = setInterval(timingFunction(activePiece.value), 100);
}
watch(
  placementHistory,
  (v) => {
    localStorage.setItem("placementHistory", JSON.stringify(v));
  },
  { deep: true }
);

// timing
let timingInterval: number | undefined;
const playerRemainingTime = ref([0, TOTAL_TIME, TOTAL_TIME]);
const timingFunction = (piece: number) => () => {
  playerRemainingTime.value[piece] -= 0.1;

  if (playerRemainingTime.value[piece] <= 0) {
    onVictory(piece === 1 ? 2 : 1, []);
    playerRemainingTime.value[piece] = 0;
  }

  if (playerRemainingTime.value[piece] % 1 <= 0.1) {
    localStorage.setItem(
      "remainingTime",
      JSON.stringify(playerRemainingTime.value)
    );
  }
};

// game status
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
      localStorage.removeItem("remainingTime");
      localStorage.removeItem("placementHistory");
      timingInterval = setInterval(timingFunction(activePiece.value), 100);
    }
  },
  { deep: true }
);

// victory
const victory = ref(0);
function onVictory(piece: number, trace: NumberPair[][]) {
  victory.value = piece;
  trace.flat().forEach((v) => {
    getCell(v).victory = true;
  });
  if (timingInterval !== undefined) clearInterval(timingInterval);
  gameStatus.value = 2;

  console.debug(placementHistory.value);
}

// selection
const selectedCell = ref<NumberPair | null>(null);
watch(selectedCell, (newVal, oldVal) => {
  if (newVal) {
    getCell(newVal).selected = true;
  }
  if (oldVal) {
    getCell(oldVal).selected = false;
  }
});
function onSelect([x, y]: NumberPair) {
  if (gameStatus.value !== 1) return;
  if (getCell([x, y]).piece) return;

  selectedCell.value = [x, y];
}

// latest
const latestPlacement = ref<NumberPair | null>(null);
watch(latestPlacement, (newVal, oldVal) => {
  if (newVal) {
    getCell(newVal).latestPlacement = true;
  }
  if (oldVal) {
    getCell(oldVal).latestPlacement = false;
  }
});

function onConfirmSelect() {
  if (selectedCell.value) {
    placechess(selectedCell.value, activePiece.value);
    selectedCell.value = null;
  }
}

// load from localstorage
try {
  const remainingTimeJSON = localStorage.getItem("remainingTime");
  if (remainingTimeJSON) {
    const savedRemainingTime = JSON.parse(remainingTimeJSON as string);
    playerRemainingTime.value = savedRemainingTime;
  }
} catch (error) {}

try {
  const historyJSON = localStorage.getItem("placementHistory");
  if (historyJSON) {
    const savedHistory: { pos: NumberPair; piece: number }[] = JSON.parse(
      historyJSON as string
    );
    savedHistory.forEach((history) => {
      placechess(history.pos, history.piece);
    });
  }
} catch (error) {
  playerRemainingTime.value = [0, TOTAL_TIME, TOTAL_TIME];
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
      :cell-info="cellInfo"
      :active-piece="activePiece"
      @selectcell="onSelect"
      :game-status="gameStatus"
    />

    <player-panel
      :time="playerRemainingTime[2]"
      :piece="2"
      :invert="true"
      :game-status="gameStatus"
      :active-piece="activePiece"
      :victory-piece="victory"
      :ready="playerReady[2]"
      :selection="selectedCell"
      @ready="onReady"
      @confirmselection="onConfirmSelect"
    />
    <player-panel
      :time="playerRemainingTime[1]"
      :game-status="gameStatus"
      :active-piece="activePiece"
      :piece="1"
      :victory-piece="victory"
      :ready="playerReady[1]"
      :selection="selectedCell"
      @ready="onReady"
      @confirmselection="onConfirmSelect"
    />
  </div>
</template>

<style></style>
