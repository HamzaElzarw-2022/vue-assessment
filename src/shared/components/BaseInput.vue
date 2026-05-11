<template>
  <div class="flex flex-col gap-1.5">
    <label v-if="label" :for="id" class="text-sm font-medium text-slate-700">
      {{ label }}
    </label>
    <input
      :id="id"
      v-model="modelValue"
      :class="cn(
        'flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-colors shadow-sm',
        error ? 'border-red-500 focus:ring-red-500' : '',
        $attrs.class as string
      )"
      v-bind="$attrs"
    />
    <p v-if="error" class="text-sm text-red-500">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { cn } from '@/shared/utils/cn'

defineProps<{
  id?: string
  label?: string
  error?: string
}>()

const modelValue = defineModel<string | number>()
</script>
