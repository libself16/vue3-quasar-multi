<template>
  <div class="search-container">
    <q-input
      v-model.trim="searchState.keyword"
      :placeholder="$t('placeholder.searchGame')"
      borderless
      class="search-input"
    >
      <template #prepend>
        <q-icon name="search" />
      </template>
    </q-input>
  </div>
</template>

<script lang="ts" setup>
import { inject } from "vue"
import { SearchGameKey } from "app/template/set_r022/utils/constants/symbols"

const searchGame = inject(SearchGameKey)

if (!searchGame) {
  throw new Error("searchGame is not provided")
}

const { searchState } = searchGame
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_r022/assets/css/_variable.scss";

.search-container {
  @apply w-full h-[2.5rem] rounded-full flex items-center pl-3;
  background: var(--neutral-01);
}

.search-input {
  @apply w-full;
  :deep(.q-field__prepend) {
    padding-right: 0.5rem;
  }
  :deep(.q-icon),
  :deep(.q-field__native) {
    color: var(--primary-06) !important;
  }

  :deep(.q-icon) {
    font-size: 1.5rem !important;
  }

  :deep(.q-field__native) {
    font-size: 0.875rem !important;
  }
}
</style>
