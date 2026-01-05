<template>
  <div v-if="!isMobile" class="keyword-search-wrapper pc">
    <q-input v-model.trim="keyword" borderless color="white" placeholder="Search" class="search-input">
      <template v-slot:prepend>
        <q-icon name="search" />
      </template>

      <template v-slot:append>
        <q-btn :class="keyword ? '' : 'visibility-hidden'" round flat @click="clear(), toggleSearchBar(false)">
          <q-icon class="cursor-point" name="close" />
        </q-btn>
      </template>
    </q-input>
  </div>

  <div v-else class="keyword-search-wrapper h5" :class="isFocus ? 'active' : ''">
    <q-input
      ref="h5SearchBar"
      v-model.trim="keyword"
      borderless
      color="white"
      dark
      :placeholder="placeholderTxt"
      class="search-input h5SearchBar"
      @blur="toggleSearchBar(false)"
    >
      <template #append>
        <q-icon name="close" @click="clear(), toggleSearchBar(false)" class="btn-close" />
      </template>
    </q-input>
    <q-btn round @click="toggleSearchBar(true)">
      <q-icon name="search" />
    </q-btn>
  </div>
</template>

<script lang="ts" setup>
import { defineModel, ref, computed } from "vue"
import { useQuasar } from "quasar"

const $q = useQuasar()

let isMobile = computed(() => $q.screen.width < 768)
const keyword = defineModel<string>()
const isFocus = defineModel("isFocus")
const h5SearchBar = ref<HTMLInputElement>()
const placeholderTxt = computed(() => (isFocus.value ? "Search" : ""))
function toggleSearchBar(toggle: boolean) {
  isFocus.value = isMobile.value ? toggle : false

  if (toggle) {
    h5SearchBar.value?.focus()
    return
  }

  h5SearchBar.value?.blur()
}

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

  &.pc {
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
      height: 10vw;

      :deep(.q-field__inner) {
        .q-field__marginal,
        .q-field__control {
          height: 10vw;
        }
      }
    }
  }

  &.h5 {
    border: none;
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    position: relative;
    transition-timing-function: ease-in-out;
    transition: 0.3s;
    aspect-ratio: 1 / 1;
    height: 100%;
    position: absolute;
    right: 0;

    .h5SearchBar {
      background: transparent;
      .btn-close {
        display: none;
        cursor: pointer;
      }
    }

    &.active {
      width: 100%;
      aspect-ratio: initial;
      border: 1px solid #fff;
      border-radius: 0.8125rem 1.875rem 1.875rem 0.8125rem;
      background-color: transparent;

      .h5SearchBar {
        padding: 0 3.6rem 0 2rem;
        background: #0d0c0c;
        .btn-close {
          display: block;
        }
      }
    }

    @include iphone-width {
      width: 3rem;
      height: 3rem;
    }

    :deep(.q-field__marginal),
    :deep(.q-field__control) {
      height: 100%;
    }

    .q-btn {
      background: rgba($color: #000000, $alpha: 0.6);
      aspect-ratio: 1 / 1;
      height: 100%;
      position: relative;
      z-index: 1;
      border: 1px solid #fff;
      .q-icon,
      :deep(input) {
        color: #fff;
      }
    }

    .h5SearchBar {
      border-radius: 1.25rem;
      color: #fff;
      width: 100%;
      height: 100%;
      position: absolute;
      transition-timing-function: ease-in-out;
      transition: 0.3s;
    }
  }
}
</style>
