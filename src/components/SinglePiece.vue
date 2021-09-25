<script setup lang="ts">
const props = defineProps<{ type: number }>();
</script>

<template>
  <div
    class="rounded-full w-4/5 h-4/5 relative shadow-lg border sm:border-2 z-10"
    :class="{
      'bg-black': type === 1,
      'bg-white': type === 2,
      'border-gray-50': type === 1,
      'border-gray-500': type === 2,
    }"
  ></div>
</template>
