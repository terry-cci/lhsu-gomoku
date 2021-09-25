<script lang="ts" setup>
import { ref, watch } from "vue";
import TheModal from "./TheModal.vue";
import ReplayModal from "./ReplayModal.vue";
import { NumberPair } from "../App.vue";

const props = defineProps<{
  placementHistory: { pos: NumberPair; piece: number }[];
  victoryTrace: NumberPair[][] | null;
}>();

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
        flex flex-col
        items-center
        justify-center
        text-white
        z-10
      "
      v-show="open"
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
      <h1 class="text-3xl font-bold">對局暫停</h1>
    </div>
  </transition>

  <template v-if="open">
    <replay-modal
      :open="replayModalOpen"
      :placement-history="placementHistory"
      @close="replayModalOpen = false"
      :victory-trace="victoryTrace"
    />

    <the-modal
      :open="restartModalOpen"
      @cancel="restartModalOpen = false"
      @confirm="restartGame"
    >
      確定要開始新的一局嗎?
    </the-modal>
  </template>

  <div class="absolute left-0 top-1/4 z-10">
    <transition name="slide-from-left">
      <button
        class="
          absolute
          top-0
          bg-white
          rounded-r
          py-4
          border border-l-0 border-gray-800
          opacity-80
        "
        v-show="!open"
        type="button"
        @click="open = !open"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
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
          absolute
          top-0
          flex flex-col
          bg-white
          p-2
          pl-0
          w-40
          rounded-r
          border-l-0 border-2 border-indigo-500
        "
        v-show="open"
      >
        <button
          type="button"
          class="
            text-white
            bg-green-600
            rounded-r
            p-2
            shadow
            mb-2
            flex
            items-center
            justify-center
            disabled:opacity-20
          "
          @click="open = false"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-8 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          繼續對局
        </button>
        <button
          type="button"
          class="
            text-white
            bg-indigo-600
            rounded-r
            p-3
            shadow
            mb-2
            flex
            items-center
            justify-center
            disabled:opacity-20
          "
          @click="replayModalOpen = !replayModalOpen"
          :disabled="!placementHistory.length"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            class="w-6 mr-2"
          >
            <path
              fill="currentColor"
              d="M504 255.532c.252 136.64-111.182 248.372-247.822 248.468-64.014.045-122.373-24.163-166.394-63.942-5.097-4.606-5.3-12.543-.443-17.4l16.96-16.96c4.529-4.529 11.776-4.659 16.555-.395C158.208 436.843 204.848 456 256 456c110.549 0 200-89.468 200-200 0-110.549-89.468-200-200-200-55.52 0-105.708 22.574-141.923 59.043l49.091 48.413c7.641 7.535 2.305 20.544-8.426 20.544H26.412c-6.627 0-12-5.373-12-12V45.443c0-10.651 12.843-16.023 20.426-8.544l45.097 44.474C124.866 36.067 187.15 8 256 8c136.811 0 247.747 110.781 248 247.532zm-167.058 90.173l14.116-19.409c3.898-5.36 2.713-12.865-2.647-16.763L280 259.778V116c0-6.627-5.373-12-12-12h-24c-6.627 0-12 5.373-12 12v168.222l88.179 64.13c5.36 3.897 12.865 2.712 16.763-2.647z"
              class=""
            ></path>
          </svg>
          下子紀錄
        </button>

        <button
          type="button"
          class="
            text-white
            bg-red-600
            rounded-r
            shadow
            flex
            items-center
            justify-center
            p-2
          "
          @click="restartModalOpen = !restartModalOpen"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-8 mr-2"
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
          重新開局
        </button>
      </div>
    </transition>
  </div>
</template>
