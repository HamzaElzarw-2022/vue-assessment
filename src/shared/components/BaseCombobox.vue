<template>
  <div class="relative" ref="containerRef">
    <label v-if="label" :for="id" class="text-sm font-medium text-slate-700 mb-1.5 block">
      {{ label }}
    </label>
    <div class="relative">
      <input
        :id="id"
        type="text"
        v-model="search"
        @focus="isOpen = true"
        :placeholder="placeholder"
        :class="cn(
          'flex w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors shadow-sm',
          error ? 'border-red-500 focus:ring-red-500' : '',
          $attrs.class as string
        )"
        autocomplete="off"
      />
      <div class="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
        <ChevronDownIcon class="w-4 h-4 text-slate-400" />
      </div>
    </div>

    <!-- Dropdown -->
    <div 
      v-if="isOpen && options.length > 0" 
      class="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-auto"
    >
      <ul class="py-1">
        <li 
          v-for="opt in options" 
          :key="opt.value"
          @click="selectOption(opt)"
          class="px-3 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 cursor-pointer transition-colors"
        >
          {{ opt.label }}
        </li>
      </ul>
    </div>
    
    <p v-if="error" class="text-sm text-red-500 mt-1">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { ChevronDown as ChevronDownIcon } from 'lucide-vue-next'
import { cn } from '@/shared/utils/cn'

export interface SelectOption {
  label: string
  value: string | number
}

defineProps<{
  id?: string
  label?: string
  error?: string
  options: SelectOption[]
  placeholder?: string
}>()

const value = defineModel<string | number>()
const search = defineModel<string>('search', { default: '' })

const isOpen = ref(false)
const containerRef = ref<HTMLElement | null>(null)

function selectOption(opt: SelectOption) {
  value.value = opt.value
  search.value = opt.label // Show the selected label in the input
  isOpen.value = false
}

// Click outside to close
function handleClickOutside(event: MouseEvent) {
  if (containerRef.value && !containerRef.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
