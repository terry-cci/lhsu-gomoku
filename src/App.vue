<script lang="ts">
export type NumberPair = [number, number];
export function isSame(a: NumberPair, b: NumberPair) {
  return a[0] === b[0] && a[1] === b[1];
}

export const SIZE = 15;
export const VICTORY_GAME_COUNT = 2;
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

export function genDefaultCellInfo() {
  const info: CellInfo[][] = [];
  for (let i = 0; i < SIZE; i++) {
    info.push([]);
    for (let j = 0; j < SIZE; j++) {
      info[i].push({
        pos: [i, j],
        piece: 0,
        power: [],
        victory: false,
        selected: false,
        latestPlacement: false,
      });
    }
  }
  return info;
}

export type SingleGameHistory = {
  history: { pos: NumberPair; piece: number }[];
  victoryTrace: NumberPair[][] | null;
  victoryPiece: number;
};
</script>

<script setup lang="ts">
import TheGameboard from "./components/TheGameboard.vue";
import { computed, ref, watch } from "vue";
import PlayerPanel from "./components/PlayerPanel.vue";
import TheSidebar from "./components/TheSidebar.vue";
import TheModal from "./components/TheModal.vue";

// gameboard
const cellInfo = ref<CellInfo[][]>([]);

function initCellInfo() {
  cellInfo.value = genDefaultCellInfo();
}
initCellInfo();

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
// game count
const gameCount = computed(() => placementHistory.value.length);

// placement
const activePiece = ref(1);
const placementHistory = ref<SingleGameHistory[]>([]);
const latestHistory = computed(
  () => placementHistory.value[placementHistory.value.length - 1]
);
initHistory();

// draw
function checkDraw() {
  const draw = cellInfo.value.flat().every((cell) => cell.piece);
  if (draw) {
    onVictory(3, []);
  }
}
const suddenDeath = computed(() =>
  placementHistory.value.some((history) => history.victoryPiece === 3)
);
const suddenDeathModal = ref(suddenDeath.value);
watch(suddenDeath, (v) => {
  if (v) {
    suddenDeathModal.value = !isGameEnd.value;
  }
});

function getPieceFromPlayer(player: number, gameCount: number) {
  return ((player - 1 + ((gameCount - 1) % 2)) % 2) + 1;
}
function getPlayerFromPiece(piece: number, gameCount: number) {
  return ((piece - 1 + ((gameCount - 1) % 2)) % 2) + 1;
}

function toggleActivePiece() {
  activePiece.value = activePiece.value === 1 ? 2 : 1;
}
function placechess([x, y]: NumberPair, piece: number) {
  if (getCell([x, y]).piece) return;

  latestHistory.value.history.push({ pos: [x, y], piece });
  toggleActivePiece();
  getCell([x, y]).piece = piece;
  calcPower([x, y]);
  latestPlacement.value = [x, y];
  checkDraw();

  stopTiming();
  if (gameStatus.value === 1) startTiming();
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
const playerRemainingTime = ref([0, 0, 0]);
function initPlayerRemainingTime() {
  playerRemainingTime.value = [0, TOTAL_TIME, TOTAL_TIME];
}
initPlayerRemainingTime();
const timingFunction = (piece: number) => () => {
  const player = getPlayerFromPiece(piece, gameCount.value);

  playerRemainingTime.value[player] -= 0.1;

  if (playerRemainingTime.value[player] <= 0) {
    onVictory(piece === 1 ? 2 : 1, []);
    playerRemainingTime.value[player] = 0;
  }

  if (playerRemainingTime.value[player] % 1 <= 0.1) {
    localStorage.setItem(
      "remainingTime",
      JSON.stringify(playerRemainingTime.value)
    );
  }
};
function startTiming() {
  timingInterval = setInterval(timingFunction(activePiece.value), 100);
}
function stopTiming() {
  if (timingInterval !== undefined) clearInterval(timingInterval);
}

// game status
const gameStatus = ref(0); // 0 - waiting for players, 1 - in game, 2 - end
const playerReady = ref([false, false, false]);
function initGameStatus() {
  gameStatus.value = 0;
  playerReady.value = [true, false, false];
}
initGameStatus();

function onReady(player: number, status: boolean) {
  if ([0, 2].includes(gameStatus.value)) {
    playerReady.value[player] = status;
  }
}
watch(
  playerReady,
  (v) => {
    if (v.every((v) => v)) {
      switch (gameStatus.value) {
        case 0:
          gameStatus.value = 1;
          startTiming();
          break;

        case 2:
          nextGame();
          gameStatus.value = 1;
          startTiming();
          break;

        default:
          break;
      }
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
  latestHistory.value.victoryTrace = trace;
  latestHistory.value.victoryPiece = piece;

  gameStatus.value = 2;
  playerReady.value = [true, false, false];
  stopTiming();
}

function getVictoryCount(player: number) {
  return placementHistory.value.filter(
    ({ victoryPiece }, idx) =>
      victoryPiece === getPieceFromPlayer(player, idx + 1)
  ).length;
}

// show if it's already the last game
const isLastGame = computed(() =>
  [1, 2]
    .map((player) => getVictoryCount(player))
    .every((v) => v === VICTORY_GAME_COUNT - 1)
);

// selection
const selectedCell = ref<NumberPair | null>(null);
watch(selectedCell, (newVal, oldVal) => {
  if (oldVal) {
    getCell(oldVal).selected = false;
  }
  if (newVal) {
    getCell(newVal).selected = true;
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

// pausing
const paused = ref(false);
watch(paused, (v) => {
  if (v) stopTiming();
  else if (gameStatus.value === 1) startTiming();
});

// restart
function initHistory() {
  placementHistory.value.push({
    history: [],
    victoryTrace: null,
    victoryPiece: 0,
  });
}

function restartGame() {
  placementHistory.value = [];
  nextGame();
}

function nextGame() {
  localStorage.removeItem("remainingTime");
  initCellInfo();
  activePiece.value = 1;
  initHistory();
  initPlayerRemainingTime();
  stopTiming();
  initGameStatus();
  victory.value = 0;
  selectedCell.value = null;
  latestPlacement.value = null;
  paused.value = false;
}

// end game
const isGameEnd = computed(() => {
  return (
    (suddenDeath.value &&
      [1, 2].map((player) => getVictoryCount(player)).some((v) => v >= 1)) ||
    [1, 2]
      .map((player) => getVictoryCount(player))
      .some((v) => v >= VICTORY_GAME_COUNT)
  );
});

const endGameModal = ref(isGameEnd.value);
watch(isGameEnd, (v) => {
  if (v) {
    suddenDeathModal.value = false;
    endGameModal.value = true;
  }
});

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
    const savedHistory: typeof placementHistory.value = JSON.parse(
      historyJSON as string
    );

    placementHistory.value = savedHistory.slice(0, -1);

    initHistory();

    if (savedHistory.length) {
      savedHistory[savedHistory.length - 1].history.forEach(
        ({ pos, piece }) => {
          placechess(pos, piece);
        }
      );
    }
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
      :paused="paused"
    />

    <the-sidebar
      @pause="paused = true"
      @resume="paused = false"
      @restart="restartGame"
      :placement-history="placementHistory"
    />

    <player-panel
      v-for="player in 2"
      :time="playerRemainingTime[player]"
      :game-count="gameCount"
      :game-status="gameStatus"
      :invert="player === 2"
      :active-piece="activePiece"
      :piece="getPieceFromPlayer(player, gameCount)"
      :victory-piece="victory"
      :victory-count="getVictoryCount(player)"
      :ready="playerReady[player]"
      :selection="selectedCell"
      @ready="onReady(player, !playerReady[player])"
      @confirmselection="onConfirmSelect"
      :sudden-death="suddenDeath || isLastGame"
      :allow-next-game="!isGameEnd"
    />

    <the-modal :open="suddenDeathModal" @confirm="suddenDeathModal = false">
      由於出現和局, 下一局的對局將會直接決定最終勝負.
    </the-modal>

    <the-modal :open="endGameModal" @confirm="endGameModal = false">
      對戰結束. 請通知工作人員記錄賽果.
    </the-modal>
  </div>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 150ms ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-from-left-enter-active,
.slide-from-left-leave-active {
  transition: transform 150ms ease;
}

.slide-from-left-enter-from,
.slide-from-left-leave-to {
  transform: translateX(-100%);
}
</style>
