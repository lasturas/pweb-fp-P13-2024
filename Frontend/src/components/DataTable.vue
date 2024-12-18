<template>
  <table>
    <thead>
      <tr>
        <th v-for="header in headers" :key="header">{{ header }}</th>
        <th>Aksi</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(row, index) in data" :key="index">
        <td v-for="key in Object.keys(row)" :key="key as string">
          {{ row[key as keyof typeof row] }}
        </td>
        <td>
          <button @click="$emit('edit', row)">Edit</button>
          <button @click="$emit('delete', row.id)">Hapus</button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

export default defineComponent({
  name: "DataTable",
  props: {
    headers: {
      type: Array as PropType<string[]>,
      required: true,
    },
    data: {
      type: Array as PropType<Record<string, any>[]>,
      required: true,
    },
  },
});
</script>

<style scoped>
table {
  border: 1px solid #ddd;
  width: 100%;
  border-collapse: collapse;
}
th,
td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}
</style>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}
th,
td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
}
th {
  background-color: #f2f2f2;
}
</style>
