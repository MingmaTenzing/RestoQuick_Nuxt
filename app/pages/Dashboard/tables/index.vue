

<script setup>
import { ref } from 'vue';
definePageMeta({
  
  layout: 'dashboard-layout'
  
})




const stageConfig = {
  width:800,
  height: 800,
};

const { data: tables } = useFetch("/api/tables")
  



console.log(tables.value)
// console.log(data.value)
const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple'];

// Initialize boxes with proper configuration

  const initialBoxes = tables.value?.map((table) => ({
  id: table.id,
  x: i * 30 + 50,
  y: i * 18 + 40,
  width: 100,
  height: 50,
  fill: colors[0],
  stroke: 'black',
  strokeWidth: 4,
  draggable: true
}));

const boxes = ref(initialBoxes);

const handleDragStart = (e) => {
  const id = e.target.id();
  
  // Move the dragged box to the end of the array to simulate moveToTop
  const box = boxes.value.find(b => b.id === id);
  const filteredBoxes = boxes.value.filter(b => b.id !== id);
  boxes.value = [...filteredBoxes, box];
};

const handleDragMove = (e) => {
  const id = e.target.id();
  const index = boxes.value.findIndex(b => b.id === id);
  
  if (index !== -1) {
    // Update position
    const updatedBox = { ...boxes.value[index] };
    updatedBox.x = e.target.x();
    updatedBox.y = e.target.y();
    
    // Replace the box in the array
    const newBoxes = [...boxes.value];
    newBoxes[index] = updatedBox;
    boxes.value = newBoxes;
  }
  
  document.body.style.cursor = 'pointer';
};

const handleMouseOver = () => {
  document.body.style.cursor = 'pointer';
};

const handleMouseOut = () => {
  document.body.style.cursor = 'default';
};

const handleDoubleClick = (e) => {
  const id = e.target.id();
  // Remove the box
  boxes.value = boxes.value.filter(box => box.id !== id);
};
</script>


<template>
    <v-stage :config="stageConfig">
      <v-layer>
        <v-rect
          v-for="box in boxes"
          :key="box.id"
          :config="box"
          @dragstart="handleDragStart"
          @dragmove="handleDragMove"
          @mouseover="handleMouseOver"
          @mouseout="handleMouseOut"
          @dblclick="handleDoubleClick"
          @dbltap="handleDoubleClick"
        />
      </v-layer>
    </v-stage>

</template>