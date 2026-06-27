<template>
  <Teleport to="body">
    <!-- Backdrop -->
    <Transition name="fade">
      <div 
        v-if="uiStore.isSidebarOpen" 
        class="fixed inset-0 bg-black/50 z-40 transition-opacity"
        @click="uiStore.closeAllSidebars()"
      ></div>
    </Transition>

    <!-- Sidebar Panel -->
    <Transition name="slide-right">
      <div 
        v-if="uiStore.isSidebarOpen" 
        class="fixed inset-y-0 right-0 w-full max-w-3xl bg-white shadow-xl z-50 flex flex-col h-full"
      >
        <!-- Header -->
        <div class="px-6 py-4 border-b border-gray-100 bg-gray-50 flex-shrink-0">
          <!-- Breadcrumbs (depth > 1) -->
          <div v-if="uiStore.sidebarDepth > 1" class="flex items-center gap-1.5 text-xs text-slate-400 mb-1.5 flex-wrap">
            <template v-for="(entry, index) in uiStore.sidebarStack" :key="index">
              <span 
                :class="index === uiStore.sidebarStack.length - 1 
                  ? 'text-slate-600 font-medium' 
                  : 'hover:text-indigo-500 cursor-pointer transition-colors'"
                @click="index < uiStore.sidebarStack.length - 1 && navigateTo(index)"
              >{{ entry.title }}</span>
              <ChevronRightIcon v-if="index < uiStore.sidebarStack.length - 1" class="w-3 h-3 flex-shrink-0" />
            </template>
          </div>

          <!-- Title Row -->
          <div class="flex items-center justify-between gap-3">
            <div class="flex items-center gap-2 min-w-0">
              <!-- Back button (depth > 1) -->
              <button
                v-if="uiStore.sidebarDepth > 1"
                @click="uiStore.closeSidebar()"
                class="flex-shrink-0 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 p-1.5 rounded-lg transition-colors"
                title="Go back"
              >
                <ChevronLeftIcon class="w-4 h-4" />
              </button>
              <h2 class="text-lg font-semibold text-gray-800 truncate">{{ uiStore.sidebarTitle }}</h2>
            </div>
            <!-- Close all -->
            <button 
              @click="uiStore.closeAllSidebars()"
              class="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors p-1.5 rounded-full hover:bg-gray-200"
              title="Close"
            >
              <XIcon class="w-5 h-5" />
            </button>
          </div>
        </div>

        <!-- Content — transitions between stack levels -->
        <div class="flex-1 overflow-y-auto p-6">
          <Transition name="slide-content" mode="out-in">
            <component
              :key="uiStore.sidebarDepth"
              :is="uiStore.sidebarComponent"
              v-bind="uiStore.sidebarProps"
              @close="uiStore.closeSidebar()"
            />
          </Transition>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { useUiStore } from '@/shared/stores/uiStore'
import { X as XIcon, ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon } from 'lucide-vue-next'

const uiStore = useUiStore()

/** Navigate directly to a specific stack depth by popping entries above it. */
function navigateTo(index: number) {
  // Splice the stack to keep only entries up to and including the clicked index
  uiStore.sidebarStack.splice(index + 1)
}
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

/* Content transition when navigating between stack levels */
.slide-content-enter-active,
.slide-content-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.slide-content-enter-from {
  opacity: 0;
  transform: translateX(20px);
}
.slide-content-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
</style>
