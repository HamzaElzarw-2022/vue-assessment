<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-50 px-4">
    <div class="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-slate-100">
      <div class="text-center">
        <div class="mx-auto w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mb-4">
          <LayersIcon class="w-8 h-8" />
        </div>
        <h2 class="text-3xl font-extrabold text-slate-900">Posts Explorer</h2>
        <p class="mt-2 text-sm text-slate-500">Sign in to your admin account</p>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="space-y-4">
          <BaseInput
            id="username"
            v-model="username"
            label="Username"
            placeholder="admin"
            required
            autocomplete="username"
          />
          <BaseInput
            id="password"
            v-model="password"
            type="password"
            label="Password"
            placeholder="••••••••"
            required
            autocomplete="current-password"
          />
        </div>

        <div v-if="authStore.authError" class="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
          {{ authStore.authError }}
        </div>

        <BaseButton 
          type="submit" 
          class="w-full flex justify-center py-3" 
          :disabled="authStore.isAuthPending"
        >
          <span v-if="authStore.isAuthPending" class="flex items-center gap-2">
            <Loader2Icon class="w-4 h-4 animate-spin" />
            Signing in...
          </span>
          <span v-else>Sign in</span>
        </BaseButton>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Layers as LayersIcon, Loader2 as Loader2Icon } from 'lucide-vue-next'
import { useAuthStore } from '@/shared/stores/authStore'
import BaseInput from '@/shared/components/BaseInput.vue'
import BaseButton from '@/shared/components/BaseButton.vue'

const router = useRouter()
const authStore = useAuthStore()

const username = ref('')
const password = ref('')

async function handleLogin() {
  const success = await authStore.login(username.value, password.value)
  if (success) {
    router.push('/')
  }
}
</script>
