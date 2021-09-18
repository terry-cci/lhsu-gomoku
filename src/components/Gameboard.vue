<script lang="ts">
export const SIZE = 15;
</script>

<script setup lang="ts">
import PieceCell from "./PieceCell.vue";
import { ref } from "vue";

const COUNT_TO_VICTORY = 5;

const props = defineProps<{ activePiece: number }>();
const emit = defineEmits<{
  (e: "chessplaced", pos: [number, number]): void;
  (e: "victory", piece: number, trace: [number, number][]): void;
}>();

export interface CellInfo {
  pos: {
    x: number;
    y: number;
  };
  piece: number;
  power: number[];
}

const cellInfo = ref([] as CellInfo[][]);
for (let i = 0; i < SIZE; i++) {
  cellInfo.value.push([]);
  for (let j = 0; j < SIZE; j++) {
    cellInfo.value[i].push({
      pos: {
        x: i,
        y: j,
      },
      piece: 0,
      power: [],
    });
  }
}

function isInBound(x: number, y: number) {
  return !(x < 0 || x >= SIZE || y < 0 || y >= SIZE);
}

function getCell(x: number, y: number) {
  if (!isInBound(x, y)) return null;
  return cellInfo.value[x][y];
}

function updatePower(x: number, y: number) {
  debugger;
  const piece = getCell(x, y)?.piece;
  const directions = [
    [-1, -1],
    [0, -1],
    [1, -1],
    [-1, 0],
  ];

  const update = (
    [x, y]: [number, number],
    v: number,
    powerIdx: number,
    inverted: boolean
  ) => {
    debugger;
    cellInfo.value[x][y].power[powerIdx] = v;
    const nextx = x + directions[powerIdx][0] * (inverted ? -1 : 1);
    const nexty = y + directions[powerIdx][1] * (inverted ? -1 : 1);
    const next = getCell(nextx, nexty);

    if (next?.piece === piece) update([nextx, nexty], v, powerIdx, inverted);
  };

  directions.forEach(([dx, dy], i) => {
    const neighbour1 = getCell(x + dx, y + dy);
    const neighbour2 = getCell(x - dx, y - dy);

    const power =
      ((neighbour1?.piece === piece && neighbour1?.power[i]) || 0) +
      ((neighbour2?.piece === piece && neighbour2?.power[i]) || 0) +
      1;

    (getCell(x, y) as CellInfo).power[i] = power;

    if (neighbour1?.piece === piece) update([x + dx, y + dy], power, i, false);
    if (neighbour2?.piece === piece) update([x - dx, y - dy], power, i, true);
  });
}

function placechess(x: number, y: number) {
  if (cellInfo.value[x][y].piece) return;
  cellInfo.value[x][y].piece = props.activePiece;
  updatePower(x, y);
  emit("chessplaced", [x, y]);
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
    <template v-for="(col, x) in cellInfo" :key="x">
      <PieceCell
        v-for="(cell, y) in col"
        :key="`(${x},${y})`"
        :info="cell"
        :active-piece="activePiece"
        @placechess="placechess(x, y)"
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
