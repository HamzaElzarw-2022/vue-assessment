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

    <div v-if="pagination && pagination.totalItems > 0" class="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50/50">
      <div class="text-sm text-slate-500">
        Showing 
        <span class="font-medium text-slate-900">{{ (pagination.page * pagination.size) + 1 }}</span>
        to 
        <span class="font-medium text-slate-900">{{ Math.min((pagination.page + 1) * pagination.size, pagination.totalItems) }}</span>
        of 
        <span class="font-medium text-slate-900">{{ pagination.totalItems }}</span>
        results
      </div>
      <div class="flex items-center gap-4">
        <div class="flex items-center bg-slate-200/50 p-1 rounded-lg">
          <button 
            v-for="size in [5, 10, 20]" 
            :key="size"
            @click="$emit('size-change', size)"
            :class="[
              'px-3 py-1 text-xs font-medium rounded-md transition-all',
              pagination.size === size 
                ? 'bg-white text-indigo-600 shadow-sm' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            ]"
          >
            {{ size }}
          </button>
        </div>
        <div class="flex items-center gap-2">
        <button 
          @click="$emit('page-change', pagination.page - 1)"
          :disabled="pagination.page === 0"
          class="px-3 py-1.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>
        <button 
          @click="$emit('page-change', pagination.page + 1)"
          :disabled="pagination.page >= pagination.totalPages - 1"
          class="px-3 py-1.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Next
        </button>
      </div>
    </div>
    </div>
  </div>
</template>

<script setup lang="ts">
export interface Column<T = any> {
  key: keyof T | string
  label: string
}

export interface PaginationDetails {
  page: number
  totalPages: number
  totalItems: number
  size: number
}

const props = defineProps<{
  columns: Column[]
  data: any[]
  pagination?: PaginationDetails
}>()

defineEmits<{
  (e: 'page-change', page: number): void
  (e: 'size-change', size: number): void
}>()

function getNestedValue(obj: any, path: string) {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj)
}
</script>
