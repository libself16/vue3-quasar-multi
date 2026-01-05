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
@import "app/template/set_ed3/assets/css/_variable.scss";

.custom-pagination {
  background: transparent;
  border-radius: 0.375rem;
}

::v-deep(.q-pagination__content) {
  border-radius: 0.375rem !important;
  overflow: hidden;

  .q-btn--push:before {
    border-bottom: none;
  }
}

::v-deep(.q-pagination__content) .q-btn {
  margin: 0;
  border-radius: 0;
  background: transparent !important;
  border: none;


  &:first-child {
    border-top-left-radius: 0.375rem !important;
    border-bottom-left-radius: 0.375rem !important;
  }

  &:last-child {
    border-top-right-radius: 0.375rem !important;
    border-bottom-right-radius: 0.375rem !important;
  }

  &:before {
    box-shadow: none !important;
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
    background: $gradient03 !important;
    color: $white01 !important;
  }
}

::v-deep(.q-pagination__content) .q-pagination__middle button[aria-current="true"] {
  background: transparent !important;
  color: #FFE001 !important;
}
</style>
