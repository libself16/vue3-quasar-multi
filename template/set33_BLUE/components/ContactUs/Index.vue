<template>
  <div id="slide_right" class="slide_right_close srl_menu">
    <ul v-if="cmsListState[CMS_TYPE.Enums.CONTACT_US].length > 0" class="list_menu menu-container">
      <li
        v-for="(cmsItem, cmsIndex) in cmsListState[CMS_TYPE.Enums.CONTACT_US]"
        :key="cmsIndex"
        @click="handleEntranceClick(cmsItem.Entrance[0])"
      >
        <div class="contact-list">
          <div class="contact-title">
            <q-img :src="cmsItem.Setting.icon_lang[nowLang as LANGUAGE_TYPE.Enums]" class="icon-img" contain />
            <h4>{{ cmsItem.Setting.lang[nowLang as LANGUAGE_TYPE.Enums] }}</h4>
          </div>
          <div class="contact-content">
            <p>{{ cmsItem.Setting.contact_lang[nowLang as LANGUAGE_TYPE.Enums] }}</p>
            <q-img
              :src="cmsItem.Setting.contact_img_lang[nowLang as LANGUAGE_TYPE.Enums]"
              class="content-img"
              contain
            />
          </div>
        </div>
      </li>
    </ul>
    <button id="button_right" class="button sbutton">
      <img id="bsright" :src="contactUs" alt="" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue"
import { useEnv } from "src/common/hooks/useEnv"
import { useCms } from "src/common/composables/useCms"
import { CMS_TYPE } from "src/common/utils/constants"
import { LANGUAGE_TYPE } from "src/common/utils/constants"
import { useLanguage } from "src/common/composables/useLanguage"
import { useSiteImg } from "app/template/set33_BLUE/hooks/useSiteImg"
import { useEntranceHandler } from "app/template/set33_BLUE/composables/useCms"

const { cmsListState, handleCmsList } = useCms()
const { companyName, nowHost } = useEnv()
const { contactUs, qrGsi } = useSiteImg()
const { nowLang } = useLanguage()
const { handleEntranceClick } = useEntranceHandler()

onMounted(async () => {
  await handleCmsList(CMS_TYPE.Enums.CONTACT_US)
})
</script>

<style lang="scss" scoped>
.menu-container {
  @apply max-h-[80vh] overflow-y-auto;
  border-radius: 0;
}

.contact-list {
  @apply flex flex-col items-center bg-[#002236] cursor-pointer;
  padding: 0.3125rem 0rem;
}

.contact-title {
  background: #1a2d38;
  display: flex;
  width: 166px;
  text-align: center;
  justify-content: center;
  padding: 8px 0px;
  align-items: center;
  border-radius: 20px 20px 0px 0px;

  .icon-img {
    @apply w-[1.75rem] h-[1.75rem] mr-[.5rem];
  }
}

.contact-content {
  @apply bg-[#001521] w-[10.375rem] text-center;
  border-radius: 0rem 0rem 1.25rem 1.25rem;

  p {
    @apply my-[.5rem];
  }
}
</style>
