<template>
  <div class="flex flex-col justify-center items-center h-screen gap-4">
    <q-btn :loading="true" flat v-if="!init"></q-btn>
    <q-btn @click="openBrowser()" v-if="!browser && init">open</q-btn>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue"

let init = ref(false)
let browser = ref<any>(null)

function openBrowser() {
  browser.value = cordova.InAppBrowser.open(
    "https://gsi1.gsiwl.com",
    "_blank",
    "location=no,toolbar=no,hideurlbar=yes,closebuttoncaption=返回"
  )

  browser.value.addEventListener("exit", function () {
    browser.value = null
  })

  browser.value.addEventListener("loadstart", function () {
    init.value = true
  })
}
onMounted(() => {
  openBrowser()
})
</script>

<style></style>
