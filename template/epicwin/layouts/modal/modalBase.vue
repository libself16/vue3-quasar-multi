<template>
  <q-dialog v-model="model" v-bind="attrs">
    <q-card class="modal form">
      <q-card-section class="row items-center q-pb-none absolute w-full z-10">
        <q-space />
        <q-btn icon="close" color="white" flat round dense v-close-popup />
      </q-card-section>
      <q-card-section>
        <slot name="title"></slot>
      </q-card-section>
      <q-card-section>
        <slot name="form"></slot>
        <slot name="menu"></slot>
        <slot name="copyright"></slot>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { defineModel, useAttrs } from "vue"

const model = defineModel<boolean | undefined>()
const attrs = useAttrs()
</script>

<style lang="sass" scoped>
@import "../../assets/css/modal.sass"
</style>
