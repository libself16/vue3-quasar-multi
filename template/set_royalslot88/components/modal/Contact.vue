<template>
  <ModalBase
    v-model="modalShow"
    modal-class="modal_contact_custom"
    use-title
    :title="$t('menu.contact')"
    title-class="modal_title_top"
  >
    <div v-if="cmsListState[CMS_TYPE.Enums.CONTACT_US].length > 0" class="contact_wrapper">
      <div
        v-for="(cmsItem, cmsIndex) in cmsListState[CMS_TYPE.Enums.CONTACT_US]"
        :key="cmsIndex"
        class="contact-bar cursor-pointer"
        @click="handleEntranceClick({ entrance: cmsItem.Entrance[0] })"
      >
        <div class="contact_wrap">
          <q-img :src="cmsItem.Setting.icon_lang[nowLang as LANGUAGE_TYPE.Enums]" class="contact-img" contain />
          <div class="contact-text-wrapper">
            <span>{{ cmsItem.Setting.lang[nowLang as LANGUAGE_TYPE.Enums] }}：</span>
            <span>{{ cmsItem.Setting.contact_lang[nowLang as LANGUAGE_TYPE.Enums] }}</span>
          </div>
        </div>
      </div>
    </div>
  </ModalBase>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"
import { useCms } from "src/common/composables/useCms"
import { CMS_TYPE, LANGUAGE_TYPE } from "src/common/utils/constants"
import { useLanguage } from "src/common/composables/useLanguage"
import { useEntranceHandler } from "app/template/set49/composables/useCms"
import { injectStrict } from "src/common/utils/injectTyped"
import { EventBusKey } from "src/symbols"
import ModalBase from "./modalBase.vue"

const { cmsListState, handleCmsList } = useCms()
const { nowLang } = useLanguage()
const { handleEntranceClick } = useEntranceHandler()
const eventbus = injectStrict(EventBusKey)
const modalShow = ref(false)

const openModal = async () => {
  modalShow.value = true
  await handleCmsList(CMS_TYPE.Enums.CONTACT_US)
}

defineExpose({
  openModal
})

onMounted(async () => {
  eventbus.on("openContactUs", (show: boolean) => {
    if (show) {
      openModal()
    }
  })
})
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";

.modal_contact_custom {
  width: auto;
}

.contact-img {
  @apply max-w-[6.25rem] max-h-[6.25rem] mb-4;
  @include iphone-width {
    @apply max-w-[3.125rem] max-h-[3.125rem];
  }
}

.contact-text-wrapper {
  @apply mb-4 ml-4;
}
</style>
