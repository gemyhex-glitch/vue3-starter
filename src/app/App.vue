<script setup lang="ts">
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import AuthLayout from '@app/layouts/AuthLayout.vue'
import DefaultLayout from '@app/layouts/DefaultLayout.vue'
import BaseToast from '@shared/components/feedback/BaseToast.vue'

const route = useRoute()

const layouts = {
  auth: AuthLayout,
  default: DefaultLayout,
} as const

const layoutName = computed(() => route.meta.layout ?? 'default')
const layoutComponent = computed(() => layouts[layoutName.value])
</script>

<template>
  <component :is="layoutComponent">
    <RouterView />
  </component>

  <BaseToast />
</template>
