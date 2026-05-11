<template>
  <div class="w-full overflow-auto bg-white rounded-xl shadow-sm border border-slate-200">
    <table class="w-full text-sm text-left">
      <thead class="text-xs text-slate-500 uppercase bg-slate-50/80 border-b border-slate-200">
        <tr>
          <th 
            v-for="col in columns" 
            :key="String(col.key)" 
            class="px-6 py-4 font-medium"
          >
            {{ col.label }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr 
          v-for="row in data" 
          :key="row.id" 
          class="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors"
        >
          <td 
            v-for="col in columns" 
            :key="String(col.key)" 
            class="px-6 py-4"
          >
            <slot :name="`cell-${String(col.key)}`" :row="row">
              {{ getNestedValue(row, String(col.key)) }}
            </slot>
          </td>
        </tr>
        <tr v-if="!data || data.length === 0">
          <td :colspan="columns.length" class="px-6 py-8 text-center text-slate-500">
            No data available.
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
export interface Column<T = any> {
  key: keyof T | string
  label: string
}

const props = defineProps<{
  columns: Column[]
  data: any[]
}>()

function getNestedValue(obj: any, path: string) {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj)
}
</script>
