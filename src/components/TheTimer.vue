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
      px-2
      shadow-inner
      border border-gray-400
      text-center
      sm:text-3xl sm:px-4 sm:py-2
    "
    :class="time > 0 ? 'font-mono' : 'font-sans'"
  >
    {{ time > 0 ? timerString : "超時" }}
  </div>
</template>
