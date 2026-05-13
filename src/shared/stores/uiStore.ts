import { defineStore } from 'pinia'
import { markRaw, ref, computed, type Component } from 'vue'

export interface SidebarEntry {
  title: string
  component: Component
  props: Record<string, any>
}

export const useUiStore = defineStore('ui', () => {
  const sidebarStack = ref<SidebarEntry[]>([])

  // Derived state — API-compatible with old flat refs so no consumers break
  const isSidebarOpen = computed(() => sidebarStack.value.length > 0)
  const sidebarDepth = computed(() => sidebarStack.value.length)
  const currentEntry = computed(() => sidebarStack.value[sidebarStack.value.length - 1] ?? null)
  const sidebarTitle = computed(() => currentEntry.value?.title ?? '')
  const sidebarComponent = computed(() => currentEntry.value?.component ?? null)
  const sidebarProps = computed(() => currentEntry.value?.props ?? {})

  /** Push a new sidebar onto the stack. */
  function openSidebar(title: string, component: Component, props: Record<string, any> = {}) {
    sidebarStack.value.push({ title, component: markRaw(component), props })
  }

  /** Pop the top sidebar (back navigation). If the stack empties the panel closes. */
  function closeSidebar() {
    sidebarStack.value.pop()
  }

  /** Close the entire sidebar regardless of stack depth (X button / backdrop). */
  function closeAllSidebars() {
    sidebarStack.value = []
  }

  return {
    // State
    sidebarStack,
    sidebarDepth,
    isSidebarOpen,
    currentEntry,
    // Compatibility accessors
    sidebarTitle,
    sidebarComponent,
    sidebarProps,
    // Actions
    openSidebar,
    closeSidebar,
    closeAllSidebars,
  }
})
