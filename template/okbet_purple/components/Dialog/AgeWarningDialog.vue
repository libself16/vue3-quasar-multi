<template>
  <q-dialog v-model="dialog" persistent>
    <q-card class="age-warning-wrapper overflow-hidden">
      <q-card-section class="flex flex-center q-mb-none absolute w-full z-10">
        <q-space />
        <q-btn class="text-lg" icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-card-section class="flex flex-center q-mb-none py-0">
        <div class="py-1 text-h6 text-center logo">
          <img :src="getWideLogo()" :class="{ invisible: !getWideLogo() }" alt="logo" />
        </div>
      </q-card-section>

      <q-card-section class="text-center q-py-none warning-content-wrapper">
        <h6 class="mx-auto text-center verification-title" v-html="cmsPopupTitle"></h6>
      </q-card-section>

      <q-card-section class="q-py-none warning-content-wrapper">
        <q-card flat bordered>
          <q-list class="agree-list-wrapper">
            <q-item v-for="(item, index) in cmsPopupAgreeList" :key="index" tag="label" v-ripple>
              <q-item-section side top>
                <div class="w-1.5 h-1.5 rounded-full bg-white mr-2 mt-2"></div>
              </q-item-section>
              <q-item-section>
                <q-item-label class="agree-item cursor-text">
                  <div v-html="item.label"></div>
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>
        <div class="inline check-all-verification-wrapper">
          <q-item tag="label" v-ripple>
            <q-item-section side top>
              <q-checkbox
                v-model="cmsPopupCheckAllAgree"
                size="sm"
                checked-icon="check_circle"
                unchecked-icon="radio_button_unchecked"
              />
            </q-item-section>
            <q-item-section>
              <q-item-label>
                <div v-html="cmsPopupAgreeAllText"></div>
              </q-item-label>
            </q-item-section>
          </q-item>
        </div>
      </q-card-section>

      <q-card-actions class="column verification-action-wrapper">
        <q-btn
          color="age-verification-enter-color"
          class="btn-action mb-5"
          block
          rounded
          unelevated
          :disable="!cmsPopupCheckAllAgree"
          v-close-popup
          @click="updateAlreadyShow"
        >
          <span class="w-full break-words">{{ cmsComfirmButtonLabel }}</span>
        </q-btn>
        <q-btn
          color="age-verification-exit-color"
          class="btn-action exit-btn mb-5 ml-0"
          block
          rounded
          unelevated
          v-close-popup
          @click="updateAlreadyShow"
        >
          <span class="w-full break-words">{{ cmsRejectButtonLabel }}</span>
        </q-btn>
      </q-card-actions>

      <q-separator />

      <q-card-section class="flex flex-center">
        <div class="text-h6 text-center signatureLogo">
          <img v-for="(img, imgIndex) in cmsPopupImgs" :key="imgIndex" class="warning-icon" :src="img" />
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue"
import { useAgeVerificationStore } from "stores/ageVerificationStore"
import { useLogo } from "src/common/composables/useLogo"
import { useCms } from "src/common/composables/useCms"
import { CMS_TYPE } from "src/common/utils/constants"

const { alreadyShow, updateAlreadyShow } = useAgeVerificationStore()
const { getWideLogo } = useLogo()
const {
  cmsPopupTitle,
  cmsComfirmButtonLabel,
  cmsPopupImgs,
  cmsRejectButtonLabel,
  cmsPopupAgreeList,
  cmsPopupCheckAgree,
  cmsPopupAgreeAllText,
  cmsPopupCheckAllAgree,
  handleCmsList
} = useCms()
const dialog = ref(false)

onMounted(async () => {
  if (!alreadyShow) {
    await handleCmsList(CMS_TYPE.Enums.POPUP)
    dialog.value = true
  }
})
</script>

<style lang="sass" scoped>
@import 'src/common/css/_variable.sass'
@import "app/template/okbet_purple/assets/css/_variable.sass"

.bg-age-verification-enter-color
  background: $bg-secondary
.bg-age-verification-exit-color
  background: $bg-dark-secondary

body.platform-ios
  .age-warning-wrapper
    max-height: 100%
    overflow: auto !important

.age-warning-wrapper
  width: 100%
  max-width: 28.125rem
  border-radius: 1.875rem
  background: $bg-dark-secondary
  color: $text-light-secondary

  .btn-link
    color: $bg-secondary
  :deep(.btn-link)
    color: $bg-secondary

  .logo
    max-width: 100%
    height: 4.6875rem
    max-height: 4.6875rem
    img
      height: 100%

  .signatureLogo
    max-width: 10.3125rem
    display: flex
    justify-content: center
    margin: 0 auto
    +iphone-width
      max-width: 5.4688rem
    & *
      margin: 0 0.9375rem
      height: 2.375rem

  .warning-content-wrapper
    width: 23rem
    max-width: 100%
    margin: 0 auto
    :deep(.q-icon)
      color: $text-light-secondary

    .agree-list-wrapper
      overflow-y: scroll
      max-height: 18.75rem
      font-size: 0.875rem
      background: $bg-dark-secondary
      border: 1px solid $bg-secondary
      :deep(.q-item__section--side)
        padding-right: 0.25rem
      .agree-item
        font-size: 0.875rem
        line-height: 1.5
      +iphone-se-width
        max-height: 34vh

    .verification-title
      width: 100%
      font-size: 1rem
      line-height: 1.5
      margin-bottom: 0.5rem

    .verification-content
      font-size: 1.125rem
      max-width: 26.4375rem
      margin: 0 auto
      line-height: normal
      +iphone-width
        font-size: 0.75rem
        max-width: 15.375rem

    .check-all-verification-wrapper
      width: 100%
      display: flex
      align-items: center
      font-size: 0.875rem
      font-weight: 500
      color: $text-light-secondary
      flex-wrap: nowrap
      justify-content: flex-start
      margin-top: 0.9375rem
      :deep(.q-item)
        width: 100%
        padding: 0.5rem 0
      :deep(.q-item__section--side)
        padding-right: 0.25rem

  .verification-action-wrapper
    justify-content: center
    width: 23rem
    padding: 0.5rem 1rem
    margin: 0 auto

    @include phone-width
      width: 100%

    .btn-action
      width: 100%
      height: 2.5rem
      flex: 1
      font-size: 0.875rem
      font-style: normal
      line-height: normal
      text-transform: initial
      margin: auto auto 1rem auto
      background-color: $bg-secondary
      +iphone-width
        max-width: 100%
        width: 100%
        height: 3.125rem
        font-size: 1rem
        &:last-child
          margin-bottom: 1rem
    .exit-btn
      background-color: #49456C
</style>
