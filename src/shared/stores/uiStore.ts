import { defineStore } from 'pinia'
import { markRaw, ref, shallowRef, type Component } from 'vue'

export const useUiStore = defineStore('ui', () => {
  const isSidebarOpen = ref(false)
  const sidebarComponent = shallowRef<Component | null>(null)
  const sidebarProps = ref<Record<string, any>>({})
  const sidebarTitle = ref('')

  function openSidebar(title: string, component: Component, props: Record<string, any> = {}) {
    sidebarTitle.value = title
    sidebarComponent.value = markRaw(component)
    sidebarProps.value = props
    isSidebarOpen.value = true
  }

  function closeSidebar() {
    isSidebarOpen.value = false
    setTimeout(() => {
      sidebarComponent.value = null
      sidebarProps.value = {}
      sidebarTitle.value = ''
    }, 300) // wait for transition
  }

  return {
    isSidebarOpen,
    sidebarComponent,
    sidebarProps,
    sidebarTitle,
    openSidebar,
    closeSidebar,
  }
})
