<script lang="ts">
export const SIZE = 15;
</script>

<script setup lang="ts">
import PieceCell from "./PieceCell.vue";
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
    <template v-for="y in SIZE" :key="y">
      <PieceCell v-for="x in SIZE" :key="x" :x="x" :y="y" />
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
