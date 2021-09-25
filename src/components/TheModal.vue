<script setup lang="ts">
const props = defineProps<{
  open: boolean;
}>();
const emit = defineEmits<{ (e: "confirm"): void; (e: "cancel"): void }>();
</script>

<template>
  <transition name="fade">
    <div
      class="
        fixed
        inset-0
        bg-black bg-opacity-75
        z-20
        flex flex-col
        items-center
        justify-center
        px-4
        sm:px-24
      "
      v-if="open"
      @click.self="emit('cancel')"
    >
      <div
        class="
          w-full
          bg-yellow-50
          rounded
          border-2 border-yellow-200
          shadow
          p-4
          flex flex-col
        "
      >
        <div class="text-lg">
          <slot></slot>
        </div>
        <div class="flex items-center justify-end mt-8">
          <button
            type="button"
            class="
              px-5
              py-2
              bg-indigo-500
              border
              text-white
              shadow
              rounded
              mr-2
            "
            @click="emit('confirm')"
          >
            確定
          </button>

          <button
            type="button"
            class="px-5 py-2 bg-white border text-gray-700 shadow rounded"
            @click="emit('cancel')"
          >
            取消
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>
