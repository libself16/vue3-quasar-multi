<template>
  <div v-if="isReady">
    <q-layout view="hHh lpr lFf" container style="height: 100vh" class="bg-grey-1">
      <HeaderComp :key="headerKey" />
      <ContactUsComp />

      <q-page-container>
        <q-page class="mainWrapper">
          <div class="mx-auto items-center text-white">
            <router-view :key="route.params.gameType" />
          </div>
        </q-page>
      </q-page-container>
      <FooterComp />
    </q-layout>
    <CurrencySupportDialog />
    <LaunchGameDialog />
    <GS1MiniGame />
  </div>
  <LiveChat />
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from "vue"
import { useQuasar } from "quasar"
import { useRoute } from "vue-router"
import { useInit } from "src/common/composables/useInit"
import { useAuth } from "src/common/hooks/useAuth"
import HeaderComp from "app/template/set33/components/Header/Index.vue"
import FooterComp from "app/template/set33/components/Footer/Index.vue"
import ContactUsComp from "app/template/set33/components/ContactUs/Index.vue"
import CurrencySupportDialog from "src/common/components/dialog/CurrencySupport.vue"
import LaunchGameDialog from "src/common/components/dialog/LaunchGame.vue"
import LiveChat from "src/common/components/LiveChat/Index.vue"
import GS1MiniGame from "src/common/components/gs1/MiniGame.vue"

import "vue3-carousel/dist/carousel.css"

const $q = useQuasar()
const route: any = useRoute()
const { isReady, initialize } = useInit()
const { isLogin } = useAuth()
const headerKey = ref(0)

watch(isLogin, (newValue) => {
  if (newValue) {
    headerKey.value++
  }
})

onMounted(() => {
  initialize()
})
</script>

<style lang="sass">
@import "src/common/css/_variable.sass"
@import "app/template/set33/assets/css/_variable.sass"
@import "app/template/set33/assets/css/main.sass"
</style>
