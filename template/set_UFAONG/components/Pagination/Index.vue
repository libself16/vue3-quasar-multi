<template>
  <div class="pagination-wrapper flex justify-end">
    <q-pagination
      class="custom-pagination"
      v-model="currentPage"
      :max="totalPages"
      direction-links
      push
      @update:model-value="handlePageChange"
    ></q-pagination>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue"

interface Props {
  modelValue: number
  totalPages: number
}

const props = defineProps<Props>()
const emit = defineEmits(["update:modelValue", "change"])

const currentPage = computed({
  get: () => props.modelValue,
  set: (value: number) => emit("update:modelValue", value)
})

const handlePageChange = (page: number) => {
  emit("change", page)
}
</script>

<style lang="scss" scoped>
@import "../../assets/css/variable.scss";

.custom-pagination {
  background: $gradient-to-bottom;
  border-radius: 0.375rem;
}

::v-deep(.q-pagination__content) {
  border-radius: 0.375rem !important;
  overflow: hidden;
}

::v-deep(.q-pagination__content) .q-btn {
  margin: 0;
  border-radius: 0;
  border: 1px solid rgba(240, 228, 127, 1);
  background: #2b2b2b !important;

  &:hover {
    background: $gradient-to-bottom !important;
    color: #000 !important;
  }

  &:first-child {
    border-top-left-radius: 0.375rem !important;
    border-bottom-left-radius: 0.375rem !important;
  }

  &:last-child {
    border-top-right-radius: 0.375rem !important;
    border-bottom-right-radius: 0.375rem !important;
  }
}

::v-deep(.q-pagination__middle) .q-btn {
  &:first-child {
    border-top-left-radius: 0 !important;
    border-bottom-left-radius: 0 !important;
    border-left: none !important;
  }

  &:last-child {
    border-top-right-radius: 0 !important;
    border-bottom-right-radius: 0 !important;
    border-right: none !important;
  }
}

::v-deep(.q-pagination__content) .q-btn:disabled {
  opacity: 1 !important;
}

::v-deep(.q-pagination__content) .q-pagination__middle button[aria-current="false"] {
  &:hover {
    background: $gradient-to-bottom !important;
    color: #000 !important;
  }
}

::v-deep(.q-pagination__content) .q-pagination__middle button[aria-current="true"] {
  background: $gradient-to-bottom !important;
  color: #000 !important;
}
</style>
