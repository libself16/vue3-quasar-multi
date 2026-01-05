<template>
  <q-layout class="bg-image" v-cloak>
    <q-page-container>
      <q-page class="flex flex-center">
        <q-card class="bg-transparent no-border no-shadow">
          <div
            class="row items-center full-width justify-center q-col-gutter-lg"
          >
            <q-icon
              name="settings"
              color="bg-grey-2 text-white"
              size="5rem"
            ></q-icon>
            <q-icon
              name="warnings"
              class="q-ml-lg"
              color="bg-grey-2 text-white"
              size="5rem"
            ></q-icon>
          </div>
          <div class="row full-width">
            <div class="col-lg-12 col-md-12 cl-sm-12 col-xs-12">
              <div class="title-box">
                <div class="title-item text-h3 text-center text-white">
                  系統維護中
                </div>
                <div class="title-item text-h6 text-center text-white">
                  目前系統例行性維護, 請洽系統管理員
                </div>
              </div>
            </div>
          </div>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'maintenance-page',
});
</script>

<style lang="sass">
.bg-image
  background-image: linear-gradient(135deg, #7028e4 0%, #e5b2ca 100%)

[v-cloak]
  display: none !important

.title-box
  margin: 20px 0
  .title-item
    margin: 10px 0
</style>
