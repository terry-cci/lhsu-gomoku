<script setup lang="ts">
import { ref, watch } from "vue";
import { CellInfo, genDefaultCellInfo, NumberPair } from "../App.vue";
import TheGameboard from "./TheGameboard.vue";

const props = defineProps<{
  placementHistory: { pos: NumberPair; piece: number }[];
  open: boolean;
  victoryTrace: NumberPair[][] | null;
}>();
const emit = defineEmits<{
  (e: "close"): void;
}>();

const cellInfo = ref<CellInfo[][]>(genDefaultCellInfo());
const curStep = ref(0);
watch(curStep, (newVal, oldVal) => {
  for (let i = -1; i >= newVal - oldVal; i--) {
    const history = props.placementHistory[oldVal + i];
    const [x, y] = history.pos;
    cellInfo.value[x][y].piece = 0;

    if (oldVal + i - 1 >= 0) {
      latestPlacement.value = props.placementHistory[oldVal + i - 1].pos;
    } else {
      latestPlacement.value = null;
    }
    cellInfo.value[x][y].victory = false;
  }
  for (let i = 0; i < newVal - oldVal; i++) {
    const history = props.placementHistory[oldVal + i];
    const [x, y] = history.pos;
    cellInfo.value[x][y].piece = history.piece;
    latestPlacement.value = [x, y];
    cellInfo.value[x][y].victory = false;
  }

  if (newVal === props.placementHistory.length) {
    if (props.victoryTrace) {
      props.victoryTrace.flat().forEach(([x, y]) => {
        cellInfo.value[x][y].victory = true;
      });
    }
  } else {
    if (props.victoryTrace) {
      props.victoryTrace.flat().forEach(([x, y]) => {
        cellInfo.value[x][y].victory = false;
      });
    }
  }
});

// latest placement
const latestPlacement = ref<NumberPair | null>(null);
watch(latestPlacement, (newVal, oldVal) => {
  console.debug(newVal, oldVal);
  if (newVal) {
    const [x, y] = newVal;
    cellInfo.value[x][y].latestPlacement = true;
  }
  if (oldVal) {
    const [x, y] = oldVal;
    cellInfo.value[x][y].latestPlacement = false;
  }
});
</script>

<template>
  <transition name="fade">
    <div
      class="
        fixed
        inset-0
        bg-black bg-opacity-80
        z-20
        flex flex-col
        items-center
        justify-center
      "
      v-if="open"
      @click.self="emit('close')"
    >
      <button
        type="button"
        class="
          text-white
          absolute
          right-0
          top-0
          p-4
          rounded
          bg-white bg-opacity-0
          hover:bg-opacity-25
        "
        @click="emit('close')"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
      <the-gameboard
        :active-piece="0"
        :game-status="1"
        :paused="false"
        :cell-info="cellInfo"
      />
      <div
        class="
          text-white text-lg
          flex
          items-center
          justify-between
          w-full
          py-8
          px-8
          sm:text-2xl
        "
      >
        <button
          type="button"
          class="
            bg-yellow-100
            px-4
            py-1
            text-gray-600
            rounded
            disabled:opacity-50
            sm:px-8 sm:py-2
          "
          :disabled="curStep <= 0"
          @click="curStep--"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-8 sm:w-12"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
            />
          </svg>
        </button>

        <span> 第 {{ curStep }} / {{ placementHistory.length }} 着 </span>

        <button
          type="button"
          class="
            bg-yellow-100
            px-4
            py-1
            text-gray-600
            rounded
            disabled:opacity-50
            sm:px-8 sm:py-2
          "
          @click="curStep++"
          :disabled="curStep >= placementHistory.length"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-8 sm:w-12"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 5l7 7-7 7M5 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  </transition>
</template>
