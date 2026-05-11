<template>
  <div class="min-h-screen bg-gray-50 flex font-sans">
    <!-- Left Navigation -->
    <aside class="w-64 bg-slate-900 text-white flex flex-col transition-all duration-300 hidden md:flex">
      <div class="p-6">
        <h1 class="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <LayersIcon class="w-6 h-6 text-indigo-400" />
          Posts Admin
        </h1>
      </div>
      <nav class="flex-1 px-4 space-y-2 mt-4">
        <router-link 
          to="/" 
          class="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
          active-class="bg-indigo-600/20 text-indigo-400 font-medium"
        >
          <LayoutDashboardIcon class="w-5 h-5" />
          Dashboard
        </router-link>
        <router-link 
          to="/posts" 
          class="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
          active-class="bg-indigo-600/20 text-indigo-400 font-medium"
        >
          <FileTextIcon class="w-5 h-5" />
          Posts
        </router-link>
        <router-link 
          to="/comments" 
          class="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
          active-class="bg-indigo-600/20 text-indigo-400 font-medium"
        >
          <MessageSquareIcon class="w-5 h-5" />
          Comments
        </router-link>
      </nav>
      <div class="p-4 border-t border-slate-800 text-sm text-slate-500">
        Admin Dashboard v1.0
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col min-w-0 overflow-hidden">
      <!-- Topbar -->
      <header class="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm z-10 sticky top-0">
        <div class="flex items-center gap-4">
          <button class="text-gray-500 hover:text-gray-700 md:hidden">
             <MenuIcon class="w-5 h-5" />
          </button>
        </div>
        <div class="flex items-center gap-4">
           <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-sm">
             A
           </div>
        </div>
      </header>

      <!-- Page Content -->
      <div class="flex-1 overflow-auto p-8 bg-slate-50/50">
        <div class="mx-auto max-w-6xl">
          <slot />
        </div>
      </div>
    </main>

    <!-- Global Right Sidebar -->
    <RightSidebar />
  </div>
</template>

<script setup lang="ts">
import { 
  Layers as LayersIcon, 
  LayoutDashboard as LayoutDashboardIcon, 
  FileText as FileTextIcon, 
  MessageSquare as MessageSquareIcon,
  Menu as MenuIcon
} from 'lucide-vue-next'
import RightSidebar from './RightSidebar.vue'
</script>
