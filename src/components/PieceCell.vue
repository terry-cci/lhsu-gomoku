<script lang="ts">
const markers = [
  [4, 4],
  [4, 12],
  [8, 8],
  [12, 4],
  [12, 12],
];
</script>

<script setup lang="ts">
import { SIZE as BOARD_SIZE } from "./Gameboard.vue";
import { computed } from "vue";

const props = defineProps<{ x: number; y: number }>();

const hasMarker = computed(
  () => !!markers.find(([x, y]) => x === props.x && y === props.y)
);
</script>

<template>
  <div
    class="bg-white bg-opacity-0 hover:bg-opacity-50 text-gray-600"
    :x="x"
    :y="y"
  >
    <svg class="w-full h-full cell-line stroke-current">
      <line
        x1="50%"
        :y1="y > 1 ? '0%' : '50%'"
        x2="50%"
        :y2="y < BOARD_SIZE ? '100%' : '50%'"
      />
      <line
        :x1="x > 1 ? '0%' : '50%'"
        y1="50%"
        :x2="x < BOARD_SIZE ? '100%' : '50%'"
        y2="50%"
      />
      <line
        v-if="hasMarker"
        x1="50%"
        y1="50%"
        x2="50%"
        y2="50%"
        stroke-width="17.5%"
      />
    </svg>
  </div>
</template>

<style scoped>
.cell-line {
  stroke-linecap: round;
}
</style>
