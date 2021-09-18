<script setup lang="ts">
const props = defineProps<{ type: number }>();
</script>

<template>
  <div
    class="rounded-full w-3/4 h-3/4 relative shadow-lg border-2"
    :class="{
      'bg-black': type === 1,
      'bg-white': type === 2,
      'border-gray-50': type === 1,
      'border-gray-400': type === 2,
    }"
  ></div>
</template>
