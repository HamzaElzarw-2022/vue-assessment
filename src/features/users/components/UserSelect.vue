<template>
  <BaseCombobox
    :id="id"
    :label="label"
    :error="error"
    :placeholder="placeholder"
    :options="userOptions"
    v-model="modelValue"
    v-model:search="search"
  />
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import debounce from 'lodash-es/debounce'
import BaseCombobox from '@/shared/components/BaseCombobox.vue'
import { usersApi } from '@/features/users/api'

const props = defineProps<{
  id?: string
  label?: string
  error?: string
  placeholder?: string
  defaultSearch?: string
}>()

const modelValue = defineModel<string | number | undefined>()

const search = ref('')
const activeSearch = ref('')

onMounted(() => {
  if (props.defaultSearch) {
    search.value = props.defaultSearch
    activeSearch.value = props.defaultSearch
  }
})

const handleSearch = debounce(() => {
  activeSearch.value = search.value
}, 300)

watch(search, (newVal) => {
  handleSearch()
  if (!newVal) {
    modelValue.value = undefined
  }
})

const { data: usersData } = useQuery({
  queryKey: ['users', activeSearch],
  queryFn: () => usersApi.getUsers({ size: 5, search: activeSearch.value || undefined })
})

const userOptions = computed(() => {
  const options: { label: string, value: any }[] = []
  if (usersData.value?.data?.items) {
    usersData.value.data.items.forEach((u: any) => {
      options.push({ label: u.fullName || u.username, value: u.id })
    })
  }
  return options
})
</script>
