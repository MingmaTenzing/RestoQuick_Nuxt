

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { Table } from '~/generated/prisma/browser';


type TableBox = {
  id: string
  x: number
  y: number
  width: number
  height: number
  fill: string
  stroke: string
  strokeWidth: number
  draggable: boolean
  tableNumber: string
  capacity: number
}

definePageMeta({
  layout: 'dashboard-layout',
})

const colorMode = useColorMode();
const toast = useToast()

const stageConfig = {
  width: window.innerWidth,
  height: window.innerHeight,
}

type TableWithLayout = Table & {
  layoutX?: number | null
  layoutY?: number | null
}

const { data: tables } = useFetch<TableWithLayout[]>('/api/tables')

const getThemeColors = () => {
  if (colorMode.value === 'dark') {
    return {
      card: 'oklch(0.2050 0 0)',
      border: 'oklch(0.2750 0 0)',
      foreground: 'oklch(0.9850 0 0)',
      muted: 'oklch(0.7080 0 0)',
    }
  }

  return {
    card: 'oklch(1 0 0)',
    border: 'oklch(0.9220 0 0)',
    foreground: 'oklch(0.1450 0 0)',
    muted: 'oklch(0.5560 0 0)',
  }
}



const boxes = ref<TableBox[]>([])

const rebuildBoxes = (value?: TableWithLayout[] | null) => {
  if (!value) {
    boxes.value = []
    return
  }

  const themeColors = getThemeColors()

  boxes.value = value.map((table, index) => ({
    id: table.id,
    x: table.layoutX ?? (index % 5) * 156 + 20,
    y: table.layoutY ?? Math.floor(index / 5) * 96 + 20,
    width: 136,
    height: 64,
    fill: themeColors.card,
    stroke: themeColors.border,
    strokeWidth: 1,
    draggable: true,
    tableNumber: String(table.number),
    capacity: table.capacity,
  }))
}

watch(
  [tables, () => colorMode.value],
  ([value]) => {
    rebuildBoxes(value)
  },
  { immediate: true },
)

type CanvasEvent = {
  target: {
    id: () => string
    x: () => number
    y: () => number
  }
}

const handleDragStart = (e: CanvasEvent) => {
  const id = e.target.id();
  
  // Move the dragged box to the end of the array to simulate moveToTop
  const box = boxes.value.find(b => b.id === id);
  const filteredBoxes = boxes.value.filter(b => b.id !== id);
  if (box) {
    boxes.value = [...filteredBoxes, box];
  }
};

const handleDragMove = (e: CanvasEvent) => {
  const id = e.target.id();
  const index = boxes.value.findIndex(b => b.id === id);
  
  if (index !== -1) {
    const currentBox = boxes.value[index]
    if (!currentBox) {
      return
    }

    const updatedBox: TableBox = {
      ...currentBox,
      x: e.target.x(),
      y: e.target.y(),
    }
    
    // Replace the box in the array
    const newBoxes = [...boxes.value];
    newBoxes[index] = updatedBox;
    boxes.value = newBoxes;
  }
  
  document.body.style.cursor = 'pointer';
};

const saveTableLayout = async (tableId: string, x: number, y: number) => {
  try {
    await $fetch('/api/tables', {
      method: 'PUT',
      body: {
        table_id: tableId,
        layoutX: x,
        layoutY: y,
      },
    })
  } catch {
    toast.error({
      title: 'Failed to save table layout',
    })
  }
}

const handleDragEnd = (e: CanvasEvent) => {
  void saveTableLayout(e.target.id(), e.target.x(), e.target.y())
}

const handleMouseOver = () => {
  document.body.style.cursor = 'pointer';
};

const handleMouseOut = () => {
  document.body.style.cursor = 'default';
};

const handleDoubleClick = (e: CanvasEvent) => {
  const id = e.target.id();
  // Remove the box
  boxes.value = boxes.value.filter(box => box.id !== id);
};
</script>


<template>
    <v-stage :config="stageConfig">
      <v-layer>
        <v-group
          v-for="box in boxes"
          :key="box.id"
          :config="{ id: box.id, x: box.x, y: box.y, draggable: true }"
          @dragstart="handleDragStart"
          @dragmove="handleDragMove"
          @dragend="handleDragEnd"
          @mouseover="handleMouseOver"
          @mouseout="handleMouseOut"
          @dblclick="handleDoubleClick"
          @dbltap="handleDoubleClick"
        >
          <v-rect
            :config="{ x: 0, y: 0, width: box.width, height: box.height, fill: box.fill, stroke: box.stroke, strokeWidth: box.strokeWidth, cornerRadius: 8 }"
          />
          <v-text :config="{ x: 0, y: 8, width: box.width, align: 'center', text: box.tableNumber, fontSize: 24, fontStyle: 'bold', fill: getThemeColors().foreground }" />
          <v-text :config="{ x: 0, y: 38, width: box.width, align: 'center', text: `${box.capacity} seats`, fontSize: 11, fill: getThemeColors().muted }" />
        </v-group>
      </v-layer>
    </v-stage>

</template>