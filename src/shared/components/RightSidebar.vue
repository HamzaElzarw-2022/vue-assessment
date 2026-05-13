<template>
  <Teleport to="body">
    <!-- Backdrop -->
    <Transition name="fade">
      <div 
        v-if="uiStore.isSidebarOpen" 
        class="fixed inset-0 bg-black/50 z-40 transition-opacity"
        @click="uiStore.closeSidebar"
      ></div>
    </Transition>

    <!-- Sidebar -->
    <Transition name="slide-right">
      <div 
        v-if="uiStore.isSidebarOpen" 
        class="fixed inset-y-0 right-0 w-full max-w-3xl bg-white shadow-xl z-50 flex flex-col h-full transform transition-transform duration-300"
      >
        <!-- Header -->
        <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
          <h2 class="text-lg font-semibold text-gray-800">{{ uiStore.sidebarTitle }}</h2>
          <button 
            @click="uiStore.closeSidebar"
            class="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-200"
          >
            <XIcon class="w-5 h-5" />
          </button>
        </div>

        <!-- Content -->
        <div class="flex-1 overflow-y-auto p-6">
          <component 
            :is="uiStore.sidebarComponent" 
            v-bind="uiStore.sidebarProps"
            @close="uiStore.closeSidebar"
          />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { useUiStore } from '@/shared/stores/uiStore'
import { X as XIcon } from 'lucide-vue-next'

const uiStore = useUiStore()
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.3s ease;
}
.slide-right-enter-from,
.slide-right-leave-to {
  transform: translateX(100%);
}
</style>
