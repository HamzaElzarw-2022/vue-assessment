<template>
  <div class="flex flex-col gap-1.5">
    <label v-if="label" :for="id" class="text-sm font-medium text-slate-700">
      {{ label }}
    </label>
    <select
      :id="id"
      v-model="modelValue"
      :multiple="multiple"
      :class="cn(
        'flex w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-colors shadow-sm',
        multiple ? 'min-h-[100px]' : 'h-10',
        error ? 'border-red-500 focus:ring-red-500' : '',
        $attrs.class as string
      )"
      v-bind="$attrs"
    >
      <option v-for="opt in options" :key="opt.value" :value="opt.value">
        {{ opt.label }}
      </option>
    </select>
    <p v-if="error" class="text-sm text-red-500">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
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
  multiple?: boolean
}>()

const modelValue = defineModel<string | number | (string | number)[]>()
</script>
