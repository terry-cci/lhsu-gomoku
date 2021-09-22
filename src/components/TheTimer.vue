<script setup lang="ts">
import { ref, computed } from "vue";
const props = defineProps<{ time: number }>();

const timerString = computed(
  () =>
    `${Math.floor(props.time / 60)
      .toString()
      .padStart(2, "0")}:${Math.floor(props.time % 60)
      .toString()
      .padStart(2, "0")}`
);
</script>

<template>
  <div
    class="
      bg-white
      text-gray-800
      p-3
      rounded
      border-4 border-gray-400
      font-mono
      text-4xl
    "
  >
    {{ timerString }}
  </div>
</template>
