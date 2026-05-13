<template>
  <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
    <div class="relative w-full sm:w-96">
      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <SearchIcon class="w-5 h-5 text-gray-400" />
      </div>
      <input 
        type="text" 
        v-model="search"
        class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
        placeholder="Search..."
      />
    </div>
    
    <div class="flex flex-wrap items-center gap-3 w-full sm:w-auto">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Search as SearchIcon } from 'lucide-vue-next'

const search = defineModel<string>() 
</script>
