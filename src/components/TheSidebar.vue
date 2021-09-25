<script lang="ts" setup>
import { ref, watch } from "vue";
import TheModal from "./TheModal.vue";
import ReplayModal from "./ReplayModal.vue";
import { NumberPair } from "../App.vue";

const props =
  defineProps<{ placementHistory: { pos: NumberPair; piece: number }[] }>();

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
function restartGame() {
  restartModalOpen.value = false;
  open.value = false;
  emit("restart");
}

// replay modal
const replayModalOpen = ref(false);

function onOverlayClicked() {
  if (restartModalOpen.value) restartModalOpen.value = false;
  else if (replayModalOpen.value) replayModalOpen.value = false;
  else open.value = false;
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
        class="w-2/5 opacity-70"
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
    <replay-modal
      :open="replayModalOpen"
      :placement-history="placementHistory"
      @close="replayModalOpen = false"
    />

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
      z-10
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
          class="
            text-white
            bg-indigo-600
            rounded
            w-16
            h-16
            p-3
            shoadow
            mb-2
            flex
            items-center
            justify-center
          "
          @click="replayModalOpen = !replayModalOpen"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            class=""
          >
            <path
              fill="currentColor"
              d="M504 255.532c.252 136.64-111.182 248.372-247.822 248.468-64.014.045-122.373-24.163-166.394-63.942-5.097-4.606-5.3-12.543-.443-17.4l16.96-16.96c4.529-4.529 11.776-4.659 16.555-.395C158.208 436.843 204.848 456 256 456c110.549 0 200-89.468 200-200 0-110.549-89.468-200-200-200-55.52 0-105.708 22.574-141.923 59.043l49.091 48.413c7.641 7.535 2.305 20.544-8.426 20.544H26.412c-6.627 0-12-5.373-12-12V45.443c0-10.651 12.843-16.023 20.426-8.544l45.097 44.474C124.866 36.067 187.15 8 256 8c136.811 0 247.747 110.781 248 247.532zm-167.058 90.173l14.116-19.409c3.898-5.36 2.713-12.865-2.647-16.763L280 259.778V116c0-6.627-5.373-12-12-12h-24c-6.627 0-12 5.373-12 12v168.222l88.179 64.13c5.36 3.897 12.865 2.712 16.763-2.647z"
              class=""
            ></path>
          </svg>
        </button>

        <button
          type="button"
          class="
            text-white
            bg-red-600
            rounded
            shoadow
            flex
            items-center
            justify-center
            w-16
            h-16
            p-2
          "
          @click="restartModalOpen = !restartModalOpen"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>
    </transition>
  </div>
</template>
