<template>
  <div class="button-area" :class="{ isClose: props.isClose }">
    <q-expansion-item
      expand-separator
      icon="perm_identity"
      label="Account settings"
      caption="John Doe"
      class="button-account"
    >
      <template #header>
        <div class="select-group" :class="{ 'btn-common-active': false }" align="left">
          <img class="home-title-icon" :src="svgIcon('language')" alt="" />
          <span class="btn-title">{{ $t("menu.language") }}</span>
          <!-- <img v-if="!modelValue" class="arrow-btn" :src="svgIcon('arrow-down')" alt="" /> -->
        </div>
      </template>
      <template #default>
        <ul class="account-list">
          <li
            v-for="(language, index) in languageList"
            :key="index"
            class="btn-title"
            @click="changeLanguage(language)"
          >
            <q-btn class="normal-btn" align="left" flat @click="changeLanguage(language)">
              <img class="home-title-icon" :src="getFlagImg(language)" :alt="language" />
              <span class="btn-label">{{ $t(LANGUAGE_TYPE.Labels[language as LANGUAGE_TYPE.Enums]) }}</span>
              <q-radio disable :val="language" v-model="nowLang" size="xs" color="accent" />
            </q-btn>
          </li>
        </ul>
      </template>
    </q-expansion-item>
  </div>

  <!-- <div v-if="languageList.length > 1">
    <q-btn :size="btnSize" :round="!iconRight" unelevated rounded :icon-right="iconRight">
      <q-avatar :size="imgSize">
        <img :src="getFlagImg(currentLanguage)" :alt="currentLanguage" />
      </q-avatar>

      <q-menu dark :offset="[0, 10]">
        <q-list>
          <q-item v-for="(language, index) in languageList" :key="index" clickable v-close-popup>
            <q-item-section @click="changeLanguage(language)">
              <img :style="{ width: imgSize }" :src="getFlagImg(language)" :alt="language" />
            </q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </q-btn>
  </div> -->
</template>

<script lang="ts" setup>
import { useSiteImg } from "app/template/set_r017/hooks/useSiteImg"
import { useLanguage } from "src/common/composables/useLanguage"
import { LANGUAGE_TYPE } from "src/common/utils/constants"
import { computed, defineProps } from "vue"

const { nowLang, availableLanguages, getLanguage, getFlagImg, setLanguage } = useLanguage()

const languageList = computed(() => availableLanguages)
const currentLanguage = computed(() => getLanguage())

const { svgIcon } = useSiteImg()

const props = defineProps({
  isClose: {
    type: Boolean,
    required: false,
    default: () => false
  }
})

function changeLanguage(language: string) {
  setLanguage(language)
}
</script>

<style lang="sass" scoped>
@import "app/template/set_r017/assets/css/_variable.scss"
@import "src/common/css/_variable.sass"

// common style
.q-expansion-item
  width: 100%
  :deep(.q-expansion-item__container)
    width: 100%
    .q-item
      padding: 8px 8px

.select-group
  width: 100%
  display: flex
  flex-direction: row
  justify-content: flex-start
  align-items: center
  .btn-title
    font-size: 13px
    color: $neutral01
    margin-left: 8px
    .q-radio
      pointer-events: none

:deep(.q-expansion-item__content)
  width: 100%

.home-title-icon
  min-width: 20px
  margin: 0 0.5rem
  width: 20px
.btn-label
  color: $neutral01
  font-family: OpenSans, "PingFang SC", "Microsoft YaHei", D-DIN, Arial, SimHei, Helvetica, sans-serif
  font-weight: 400
  text-overflow: ellipsis
  font-size: 13px
  margin-left: 8px
  font-style: normal
  line-height: normal

.q-btn
  padding: 4px 7px
  &:before
    box-shadow: none
  &:hover
    background: linear-gradient(90deg, var(--primany-02, #D12D00) 0%, rgba(209, 45, 0, 0.00) 93.97%)
  :deep(.q-btn__content)
    display: flex
    justify-content: flex-start
    height: 100%

.button-area
  border-radius: 12px
  border-top: 1px solid $secondary11
  border-right: 1px solid $secondary11
  border-bottom: 1px solid $secondary11
  background: linear-gradient(270deg, $secondary11 0%, $secondary13 100%)
  width: auto
  margin: 0 auto
  height: auto
  overflow-y: scroll
  +setFlex
  flex-direction: column
  &.isClose
    padding-left: 0 !important
    padding-right: 0 !important
    .button-account
      width: 100%
      .q-expansion-item__container
        .q-expansion-item__content
          .btn-title
            .btn-label
              display: none
            .q-radio
              display: none
        .q-item__section
          display: none
        .select-group
          .btn-title
            display: none
      .q-btn
        :deep(.q-btn__content)
          +setFlex
    :deep(.q-expansion-item__toggle-icon)
      display: none
    .home-title-icon
      margin: 0 auto


  .button-account
    :deep(.q-expansion-item__container)
      .q-item__section
        padding: 0

  .account-list
    width: 100%
  .normal-btn
    position: relative
    cursor: pointer
    display: flex
    align-items: flex-start
    width: 100%
    height: auto
    // line-height: 2vw
    border-top-left-radius: 12px
    border-bottom-left-radius: 12px
    margin: .3rem 0
    margin-left: 0px
    text-transform: none
    img
      color: $secondary02
    // span
    //   margin-left: 8px
    &.btn-logout
      display: grid
      background: transparent
      border: 1px solid rgba($secondary02, 0.7)
    &.q-btn
      :deep(.q-btn__content)
        width: 100%
      :deep(.q-radio)
        position: absolute
        right: 0
        margin: 0 3px
        pointer-events: none
        .q-radio__inner
          color: #FFFFFF !important
</style>
