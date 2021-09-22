<script lang="ts">
export const SIZE = 15;
</script>

<script setup lang="ts">
import PieceCell from "./PieceCell.vue";
import { ref } from "vue";
import { NumberPair, isSame } from "../App.vue";

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

const props = defineProps<{ activePiece: number; disabled: boolean }>();
const emit = defineEmits<{
  (e: "chessplaced", pos: NumberPair): void;
  (e: "victory", piece: number, trace: NumberPair[][]): void;
}>();

export type CellInfo = {
  pos: NumberPair;
  piece: number;
  power: number[];
  pieceClass: string[];
};

// init gameboard
const cellInfo = ref([] as CellInfo[][]);

for (let i = 0; i < SIZE; i++) {
  cellInfo.value.push([]);
  for (let j = 0; j < SIZE; j++) {
    cellInfo.value[i].push({
      pos: [i, j],
      piece: 0,
      power: [],
      pieceClass: [],
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
  const piece = cellInfo.value[x][y].piece;
  const trace: NumberPair[] = [[x, y]];

  DIRECTIONS.filter((d) => d.powerIdx === powerIdx).forEach(
    ({ dPos: [dx, dy] }) => {
      for (
        let i = 1;
        isInBound([x + dx * i, y + dy * i]) &&
        cellInfo.value[x + dx * i][y + dy * i].piece === piece;
        i++
      ) {
        trace.push([x + dx * i, y + dy * i]);
      }
    }
  );

  return trace;
}

function calcPower([x, y]: NumberPair) {
  const cell = cellInfo.value[x][y];
  const piece = cell.piece;
  cell.power = [1, 1, 1, 1];

  // calc power of the cell
  DIRECTIONS.forEach(({ dPos: [dx, dy], powerIdx }) => {
    if (
      isInBound([x + dx, y + dy]) &&
      cellInfo.value[x + dx][y + dy].piece === piece
    ) {
      cell.power[powerIdx] += cellInfo.value[x + dx][y + dy].power[powerIdx];
    }
  });

  // update power of the cells connected
  DIRECTIONS.forEach(({ dPos: [dx, dy], powerIdx }) => {
    for (
      let i = 1;
      isInBound([x + dx * i, y + dy * i]) &&
      cellInfo.value[x + dx * i][y + dy * i].piece === piece;
      i++
    ) {
      cellInfo.value[x + dx * i][y + dy * i].power[powerIdx] =
        cell.power[powerIdx];
    }
  });

  // victory detected
  if (cell.power.some((v) => v >= COUNT_TO_VICTORY)) {
    const trace = cell.power
      .map((v, i) => ({ idx: i, v }))
      .filter((info) => info.v >= COUNT_TO_VICTORY)
      .map((info) => getPowerTrace([x, y], info.idx));

    emit("victory", piece, trace);

    trace.flat().forEach((v) => {
      getCell(v).pieceClass.push("ring-8", "ring-green-400");
    });
  }
}

function placechess([x, y]: NumberPair, piece: number) {
  if (cellInfo.value[x][y].piece) return;
  if (props.disabled) return;

  cellInfo.value[x][y].piece = piece;

  calcPower([x, y]);
  emit("chessplaced", [x, y]);
}
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
        @placechess="placechess([x, y], activePiece)"
        :piece-class="cell.pieceClass"
        :disabled="disabled"
      />
    </template>
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
