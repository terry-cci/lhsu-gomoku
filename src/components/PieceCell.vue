<script setup lang="ts">
import { SIZE as BOARD_SIZE } from "./Gameboard.vue";
defineProps<{ x: number; y: number }>();
</script>

<template>
  <div class="bg-white bg-opacity-0 hover:bg-opacity-50 text-gray-600">
    <svg class="w-full h-full cell-line stroke-1">
      <line
        x1="50%"
        :y1="y > 1 ? '0%' : '50%'"
        x2="50%"
        :y2="y < BOARD_SIZE ? '100%' : '50%'"
        class="stroke-current"
      />
      <line
        :x1="x > 1 ? '0%' : '50%'"
        y1="50%"
        :x2="x < BOARD_SIZE ? '100%' : '50%'"
        y2="50%"
        class="stroke-current"
      />
    </svg>
  </div>
</template>

<style scoped>
.cell-line {
  stroke-linecap: round;
}
</style>
