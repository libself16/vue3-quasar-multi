<template>
  <div class="web-contact-content">
    <ul v-if="cmsListState[CMS_TYPE.Enums.CONTACT_US].length > 0" class="row text-center contact-us-header_inner">
      <li
        v-for="(cmsItem, cmsIndex) in cmsListState[CMS_TYPE.Enums.CONTACT_US]"
        :key="cmsIndex"
        class="contact_dotted"
        @click="handleEntranceClick({ entrance: cmsItem.Entrance[0] })"
      >
        <q-img :src="cmsItem.Setting.icon_lang[nowLang as LANGUAGE_TYPE.Enums]" class="contact-img" contain />
        <span class="contact-text">{{ cmsItem.Setting.contact_lang[nowLang as LANGUAGE_TYPE.Enums] }}</span>
      </li>
      <li
        v-for="(cmsItem, cmsIndex) in cmsListState[CMS_TYPE.Enums.CONTACT_US]"
        :key="cmsIndex"
        class="contact_dotted"
        @click="handleEntranceClick({ entrance: cmsItem.Entrance[0] })"
      >
        <q-img :src="cmsItem.Setting.icon_lang[nowLang as LANGUAGE_TYPE.Enums]" class="contact-img" contain />
        <span class="contact-text">{{ cmsItem.Setting.contact_lang[nowLang as LANGUAGE_TYPE.Enums] }}</span>
      </li>
      <li
        v-for="(cmsItem, cmsIndex) in cmsListState[CMS_TYPE.Enums.CONTACT_US]"
        :key="cmsIndex"
        class="contact_dotted"
        @click="handleEntranceClick({ entrance: cmsItem.Entrance[0] })"
      >
        <q-img :src="cmsItem.Setting.icon_lang[nowLang as LANGUAGE_TYPE.Enums]" class="contact-img" contain />
        <span class="contact-text">{{ cmsItem.Setting.contact_lang[nowLang as LANGUAGE_TYPE.Enums] }}</span>
      </li>
    </ul>
  </div>
  <FooterArea />
</template>

<script setup lang="ts">
import { onMounted } from "vue"
import { useCms } from "src/common/composables/useCms"
import { CMS_TYPE } from "src/common/utils/constants"
import { LANGUAGE_TYPE } from "src/common/utils/constants"
import { useLanguage } from "src/common/composables/useLanguage"
import { useEntranceHandler } from "app/template/set49/composables/useCms"
import FooterArea from "app/template/okbet_purple/components/Footer/Index.vue"

const { cmsListState, handleCmsList } = useCms()
const { nowLang } = useLanguage()
const { handleEntranceClick } = useEntranceHandler()

onMounted(async () => {
  await handleCmsList(CMS_TYPE.Enums.CONTACT_US)
})
</script>

<style lang="sass" scoped>
@import 'src/common/css/_variable.sass'
@import "app/template/okbet_purple/assets/css/_variable.sass"

.web-contact-content
  max-width: 1366px
  padding: 0
  margin: 0 auto
  +iphone-width
    width: 100%
    padding: 0
  .contact-us-header_inner
    padding-top: 100px
    +iphone-width
      padding-top: 30px
    .contact_dotted
      @apply flex flex-col items-center justify-center cursor-pointer
      border-right: 1px dotted $text-light-secondary
      width: 33%
      font-size: 18px
      color: $text-light-secondary
      margin-bottom: 10px
      &:nth-child(3n)
        border-right: 0
      img
        height: 100px
        width: 100%
        vertical-align: middle
        +iphone-width
          height: 50px
      i
        font-size: 81px
        +iphone-width
          font-size: 55px
      a
        color: #fff
        font-size: 14px
      +iphone-width
        border-right: none
        flex-direction: row
        justify-content: flex-start
        width: auto
        // border-bottom: 1px dotted #fff
        margin-bottom: 10px
        padding-bottom: 10px
        padding-left: 25px
    +iphone-width
      flex-direction: column
      margin-bottom: 20px
// custom cms style
.contact-img
  @apply max-w-[6.25rem] max-h-[6.25rem] mb-4
  +iphone-width
    @apply max-w-[3.125rem] max-h-[3.125rem]
.contact-text
  @apply mb-4 ml-4
</style>
