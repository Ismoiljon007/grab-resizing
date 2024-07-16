<template>

  <table ref="resizableTable" class="custom-table">
    <thead>
      <tr>
        <th>Column 1
          <div class="resizer"></div>
        </th>
        <th>Column 2
          <div class="resizer"></div>
        </th>
        <th>Column 3
          <div class="resizer"></div>
        </th>
      </tr>
    </thead>

    <Sortable :list="elements" item-key="id" tag="tbody" :options="options" @sort="handleSort">
      <template #item="{ element }">
        <tr class="draggable" :key="element.id">
          <td><span>Data {{ element.name }}</span> <button class="handle">a </button></td>
          <td>Data 2</td>
          <td>Data 3</td>
        </tr>
      </template>
    </Sortable>
  </table>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Sortable } from "sortablejs-vue3";

const resizableTable = ref(null);

const elements = ref([
  { id: 1, name: 'Item 1' },
  { id: 2, name: 'Item 2' },
  { id: 3, name: 'Item 3' },
]);

const options = ref({
  handle: ".handle",
  animation: 150,
  ghostClass: "ghost",
  dragClass: "drag",
});

const handleSort = (event) => {
  // Handle sort event if needed (optional)
  console.log('Elements sorted:', event.items);
};
onMounted(() => {
  const el = resizableTable.value;

  const nodeName = el.nodeName;
  if (["TABLE", "THEAD"].indexOf(nodeName) < 0) return;

  const table = nodeName === "TABLE" ? el : el.parentElement;
  const thead = table.querySelector("thead");
  const ths = thead.querySelectorAll("th");
  const barHeight =
    nodeName === "TABLE" ? table.offsetHeight : thead.offsetHeight;

  const resizeContainer = document.createElement("div");
  table.style.position = "relative";
  resizeContainer.style.position = "relative";
  resizeContainer.style.width = table.offsetWidth + "px";
  resizeContainer.className = "vue-columns-resizable";
  table.parentElement.insertBefore(resizeContainer, table);

  let moving = false;
  let movingIndex = 0;
  const bars = document.querySelectorAll(".resizer")
  bars.forEach((bar, index) => {
    const th = ths[index];
    const nextTh = ths[index + 1];
    th.style.width = th.offsetWidth + "px";
    bar.addEventListener("mousedown", () => {
      moving = true;
      movingIndex = index;
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    });
  });

  document.addEventListener("mouseup", () => {
    if (!moving) return;

    moving = false;
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
  });

  const cutPx = (str) => +str.replace("px", "");

  const handleResize = (e) => {
    if (moving) {
      const th = ths[movingIndex];
      const nextTh = ths[movingIndex + 1];
      th.style.width = cutPx(th.style.width) + e.movementX + "px";
      nextTh.style.width = cutPx(nextTh.style.width) - e.movementX + "px";
    }
  };

  resizeContainer.addEventListener("mousemove", handleResize);
  table.addEventListener("mousemove", handleResize);
});
</script>

<style scoped>
.custom-table {
  border-collapse: collapse;
  width: 100%;
}

.custom-table th,
.custom-table td {
  border: 1px solid #dddddd;
  padding: 8px;
  text-align: left;

}

.custom-table span {
  white-space: nowrap;

  overflow: hidden;
  text-overflow: ellipsis;
}

.custom-table th {
  position: relative;
  background-color: #f2f2f2;
}

.resizer {
  width: 10px;
  height: 100%;
  position: absolute;
  top: 0;
  right: -5px;
  cursor: col-resize;
}

.draggable {
  background: #fff;
  padding: 10px;
  margin: 10px;
  /* border: 1px solid #ccc; */

}

.ghost {
  opacity: 1;
  background: #fff;
  color: transparent;
  border: 2px dashed #222 !important;
  /* outline: 2px dashed #222; */
}

.drag {
  background: #f5f5f5;
  opacity: 1;
}

.wrapper {
  max-height: 400px;
  overflow-y: auto;
}

.settings {
  padding: 1rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 20px;
}

.settings .range {
  display: flex;
  flex-direction: column;
}

.settings .range p {
  margin: 0;
}
</style>
