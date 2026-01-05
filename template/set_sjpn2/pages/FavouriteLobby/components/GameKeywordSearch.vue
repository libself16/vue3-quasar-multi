<template>
  <div class="keyword-search-wrapper pc">
    <q-input v-model.trim="keyword" borderless color="white" placeholder="Search" class="search-input">
      <template v-slot:prepend>
        <q-icon name="search" />
      </template>

      <template v-slot:append>
        <q-btn :class="keyword ? '' : 'visibility-hidden'" round flat @click="clear()">
          <q-icon class="cursor-point" name="close" />
        </q-btn>
      </template>
    </q-input>
  </div>
</template>

<script lang="ts" setup>
import { defineModel } from "vue"

const keyword = defineModel<string>()

function clear() {
  keyword.value = ""
}
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";

.keyword-search-wrapper {
  border-radius: 0.8125rem;
  border: 1px solid #ededed;

  .q-icon,
  :deep(input) {
    color: #8d8d8d;
  }

  :deep(input) {
    font-size: 1rem;
  }

  background: #0d0c0c;
  padding: 0 12px;

  :deep(.q-field__inner) {
    .q-field__marginal,
    .q-field__control {
      height: 4.0625rem;
    }
  }

  @include phone-width {
    height: 10vw;

    :deep(.q-field__inner) {
      .q-field__marginal,
      .q-field__control {
        height: 10vw;
      }
    }
  }

  @include iphone-width {
    height: 12vw;

    :deep(.q-field__inner) {
      .q-field__marginal,
      .q-field__control {
        height: 12vw;
      }
    }
  }
}
</style>
