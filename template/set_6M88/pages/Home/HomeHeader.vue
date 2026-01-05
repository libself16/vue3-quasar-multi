<template>
  <div class="t-header">
    <div class="top-header">
      <div class="top-logo"><img :src="logoSrc" /></div>
      <div class="top-right">
        <div class="lang_top_box" @click="langDialogOpened = true">{{ getCountryNameByCode(nowLang, nowLang) }}</div>
        <q-btn :to="{ name: 'ContactUs' }" size="sm" unelevated flat dense
          ><img :src="result('index/chat.png')"
        /></q-btn>
      </div>
    </div>
  </div>

  <q-dialog v-model="langDialogOpened" position="bottom" class="z-[6002]">
    <q-card class="bg-[#f4faff]">
      <q-card-section class="bg-white mb-2" @click="langDialogOpened = false">
        <div class="text-lg text-[#2599f8]">{{ $t("common.btn.cancel") }}</div>
      </q-card-section>
      <q-list separator class="bg-white">
        <q-item clickable v-ripple v-for="lang in languageList" :key="lang" @click="setLanguage(lang)">
          <q-item-section>{{ getCountryNameByCode(lang) }}</q-item-section>
          <q-item-section side v-if="lang === nowLang">
            <q-icon size="1rem" color="primary" name="fa-solid fa-check" />
          </q-item-section>
        </q-item>
      </q-list>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import { computed, ref, onMounted } from "vue"
import { useSiteImg } from "../../hooks/useSiteImg"
import { useLogo } from "src/common/composables/useLogo"

import { useLanguage } from "src/common/composables/useLanguage"
const { availableLanguages, nowLang, getCountryNameByCode, setLanguage } = useLanguage()
const languageList = computed(() => availableLanguages)

const { getWideLogo, handleLogoList } = useLogo()

const { result } = useSiteImg()

const logoSrc = computed(() => {
  const wideLogo = getWideLogo()
  return wideLogo || ""
})

const langDialogOpened = ref(false)

onMounted(async () => {
  await handleLogoList()
})
</script>

<style lang="scss" scoped>
.top-logo {
  img {
    @apply object-contain h-8;
  }
}
</style>
