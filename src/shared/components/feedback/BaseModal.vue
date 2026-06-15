<script setup lang="ts">
import Dialog from 'primevue/dialog'

defineProps<{
  open: boolean
  title?: string
}>()

defineEmits<{
  close: []
}>()
</script>

<template>
  <Dialog
    class="modal-panel"
    :visible="open"
    :header="title"
    modal
    dismissable-mask
    :draggable="false"
    :style="{ width: 'min(92vw, 34rem)' }"
    @update:visible="!$event && $emit('close')"
  >
    <div class="modal-body">
      <slot />
    </div>
    <template v-if="$slots.footer" #footer>
      <footer class="modal-footer">
        <slot name="footer" />
      </footer>
    </template>
  </Dialog>
</template>
