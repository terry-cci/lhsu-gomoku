<script setup lang="ts">
const props = defineProps<{
  open: boolean;
}>();
const emit = defineEmits<{ (e: "confirm"): void; (e: "cancel"): void }>();
</script>

<template>
  <transition name="fade">
    <div
      v-if="open"
      class="
        fixed
        top-1/2
        left-1/2
        transform
        -translate-x-1/2 -translate-y-1/2
        z-30
        w-2/3
        bg-yellow-50
        rounded
        border-4 border-yellow-400
        shadow
        py-10
        px-10
        flex flex-col
      "
    >
      <div class="text-3xl">
        <slot></slot>
      </div>
      <div class="flex items-center justify-between mt-8 text-2xl">
        <button
          type="button"
          class="px-8 py-2 bg-white border-2 border-gray-700 rounded"
          @click="emit('confirm')"
        >
          確定
        </button>
        <button
          type="button"
          class="
            px-8
            py-2
            bg-red-500
            text-white
            border-2 border-red-700
            rounded
          "
          @click="emit('cancel')"
        >
          取消
        </button>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 150ms ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
