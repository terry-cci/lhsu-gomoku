<script lang="ts" setup>
import { ref, watch } from "vue";
import TheModal from "./TheModal.vue";

const emit = defineEmits<{
  (e: "pause"): void;
  (e: "resume"): void;
  (e: "restart"): void;
}>();

const open = ref(false);
watch(open, (v) => {
  if (v) emit("pause");
  else {
    emit("resume");
    restartModalOpen.value = false;
  }
});

// restart modal
const restartModalOpen = ref(false);

function onOverlayClicked() {
  if (restartModalOpen.value) restartModalOpen.value = false;
  else open.value = false;
}

function restartGame() {
  restartModalOpen.value = false;
  open.value = false;
  emit("restart");
}
</script>

<template>
  <transition name="fade">
    <div
      class="
        fixed
        inset-0
        bg-black bg-opacity-75
        flex
        items-center
        justify-center
        text-white
        z-10
      "
      v-if="open"
      @click="onOverlayClicked"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="w-2/5 opacity-75"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    </div>
  </transition>

  <template v-if="open">
    <the-modal
      :open="restartModalOpen"
      @cancel="restartModalOpen = false"
      @confirm="restartGame"
    >
      確定要開始新的一局嗎?
    </the-modal>
  </template>

  <div
    class="
      absolute
      left-0
      top-1/2
      transform
      -translate-y-1/2
      flex
      items-center
      z-20
    "
  >
    <transition name="slide-from-left">
      <button
        class="
          bg-white
          rounded-r
          py-8
          border border-l-0 border-gray-800
          opacity-80
          absolute
          left-0
          transition
        "
        v-if="!open"
        type="button"
        @click="open = !open"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-8 w-8 transition"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          :class="open ? ['transform rotate-180'] : ['']"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </transition>

    <transition name="slide-from-left">
      <div
        class="
          flex flex-col
          bg-white
          p-2
          border-l-0 border-2 border-indigo-500
          transition
          relative
        "
        v-if="open"
      >
        <button
          type="button"
          class="text-white bg-indigo-600 rounded p-2 shoadow"
          @click="restartModalOpen = !restartModalOpen"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-14 w-14"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </button>
      </div>
    </transition>
  </div>
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

.slide-from-left-enter-active,
.slide-from-left-leave-active {
  transition: transform 150ms ease;
}

.slide-from-left-enter-from,
.slide-from-left-leave-to {
  transform: translateX(-100%);
}
</style>
