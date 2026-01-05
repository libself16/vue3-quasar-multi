<template>
  <q-card class="form-container">
    <!-- title web -->
    <q-card-section v-if="!isMobile" class="p-0 mb-8">
      <h4 class="text-2xl font-bold">{{ $t("member.profile.title") }}</h4>
    </q-card-section>
    <div class="section-wrap">
      <!-- form -->
      <q-card-section class="p-0 detail-section">
        <q-form>
          <!-- user name -->
          <div class="form-row">
            <label class="form-label">{{ $t("member.profile.username") }}</label>
            <q-input v-model="userInfoForm.username" class="form-input opacity-60" disable />
          </div>
          <!-- real name -->
          <div class="form-row">
            <label class="flex items-center justify-between form-label">
              <span>{{ $t("member.profile.fullName") }}</span>
              <!-- <span class="mr-4 text-base text-red-600">*</span> -->
            </label>
            <q-input v-model="userInfoForm.real_name" class="form-input opacity-60" disable />
          </div>
          <!-- email -->
          <div class="form-row">
            <label class="form-label">{{ $t("member.profile.email") }}</label>
            <q-input v-model="userInfoForm.email" class="form-input" />
          </div>
          <!-- gender -->
          <div class="form-row">
            <label class="form-label">{{ $t("member.profile.gender") }}</label>
            <q-select
              v-model="userInfoForm.gender"
              class="form-input"
              :options="genderDropdown"
              emit-value
              map-options
              lazy-rules
              :rules="[Rules.requiredGender]"
            />
          </div>
          <!-- birthday -->
          <!-- <div class="relative form-row">
            <label class="form-label">{{ $t("member.profile.birthday") }}</label>
            <q-input
              v-model="userInfoForm.date_of_birth"
              class="form-input"
              readonly
              @click="isDatePickerShow = true"
              lazy-rules
              :rules="[Rules.noRule]"
            />
            <div v-if="isDatePickerShow" class="mask" @click.self="isDatePickerShow = false">
              <q-date v-model="userInfoForm.date_of_birth" mask="YYYY-MM-DD" minimal class="bg-black" />
            </div>
          </div> -->
          <!-- nick name -->
          <div class="form-row">
            <label class="form-label">
              {{ $t("member.profile.nickName") }}
            </label>
            <q-input v-model="userInfoForm.nickname" class="form-input" :rules="[Rules.noRule]" />
          </div>
        </q-form>
      </q-card-section>
      <!-- title web -->
      <q-card-section v-if="isMobile" class="p-0 mb-8">
        <h4 class="text-2xl font-bold">{{ $t("member.profile.title") }}</h4>
      </q-card-section>
      <q-card-section class="image-section">
        <div class="image-box">
          <div class="image-title">{{ userActiveLevelsInfo.lang }}</div>
          <div class="image-image-wrap"><img :src="userActiveLevelsInfo.img" class="image-image" /></div>
          <div ref="quotaRef" class="image-quota" :class="{ 'long-text': isLongText }">
            {{ userRemark ? userRemark.replace(/\r?\n|\r/g, " ") : userActiveLevelsInfo.remark }}
          </div>
        </div>
      </q-card-section>
    </div>
    <!-- submit btn -->
    <div class="form-row-submit">
      <q-btn class="submit-btn" :label="$t('common.btn.submit')" @click="setUserInfo" />
    </div>
  </q-card>
</template>

<script lang="ts">
export default {
  name: "ProfileDetail"
}
</script>

<script setup lang="ts">
import { computed, ref, watchEffect, watch, onMounted } from "vue"
import { useI18n } from "vue-i18n"
import { useCommon } from "src/common/hooks/useCommon"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useRule } from "src/common/hooks/useRule"
import { GENDER } from "src/common/utils/constants"
import { useWindowSize } from "@vueuse/core"
import { useEnv } from "src/common/hooks/useEnv"

let isLongText = ref(false)
const quotaRef = ref<HTMLElement | null>(null)
const { t } = useI18n()
const Rules = useRule()
const { isCredit } = useEnv()
const { userInfo, userInfoForm, resetUserInfoForm, setUserInfo, userActiveLevelsInfo, userRemark, getUserRemark } =
  useUserInfo()
const { moneyFormat } = useCommon()
const { width } = useWindowSize()
let isMobile = ref(false)

watch(
  width,
  (newWidth) => {
    if (newWidth >= 576) {
      isMobile.value = false
    } else {
      isMobile.value = true
    }
  },
  { immediate: true }
)

const genderDropdown = computed(() => {
  const genderList = Object.values(GENDER.Enums).filter((v) => !isNaN(Number(v)))
  return genderList.map((e) => {
    const value = e
    const label = t(GENDER.I18nKeys[e as GENDER.Enums])
    return {
      label,
      value
    }
  })
})

const isDatePickerShow = ref(false)

watchEffect(async () => {
  if (userInfo.value.contact) resetUserInfoForm()

  getUserRemark()
})

onMounted(() => {
  checkTextWidth()
})

watch(userRemark, () => {
  checkTextWidth()
})

function checkTextWidth() {
  if (quotaRef.value) {
    const containerWidth = quotaRef.value.offsetWidth
    const span = document.createElement("span")
    span.style.visibility = "hidden"
    span.style.position = "absolute"
    span.style.whiteSpace = "nowrap"
    span.style.fontSize = isMobile.value ? "10px" : "inherit"
    span.textContent = userRemark.value ? userRemark.value.replace(/\r?\n|\r/g, " ") : userActiveLevelsInfo.remark
    document.body.appendChild(span)
    const textWidth = span.offsetWidth
    document.body.removeChild(span)
    isLongText.value = textWidth > containerWidth
  }
}
</script>

<style lang="sass" scoped>
@import 'src/common/css/_variable.sass'
@import 'src/css/modal.sass'
@import "app/template/set_sjpn2/assets/css/_variable.sass"
@import "app/template/set_sjpn2/assets/css/button.sass"
@import "app/template/set_sjpn2/assets/css/main.sass"

.form-container
  @apply bg-transparent shadow-none mt-2 p-6 rounded-lg
  background: #000
  .section-wrap
    @apply flex items-start flex-wrap
    +iphone-width
      flex-direction: column-reverse
  .detail-section
    width: 55%
    +iphone-width
      width: 100%
  .image-section
    background: url("app/template/set_sjpn2/assets/images/vip/vip-wrap-empty.png") no-repeat center center
    background-size: 100% 100%
    background-position: center center
    width: 26rem
    height: 25.625rem
    margin: -4rem auto 0 35rem
    position: absolute
    +iphone-width
      background-size: cover
      background-position: unset
      position: relative
      width: 18rem
      height: 17.625rem
      margin: 0 auto
    .image-box
      flex-direction: column
      width: 100%
      height: 100%
      padding-top: 4.625rem
      +iphone-width
        padding-top: 2.625rem
      .image-title
        width: 100%
        text-align: center
        min-height: 1.5rem
      .image-quota
        line-height: 2.8
        padding-left: 0.25rem
        padding-right: 0.25rem
        background: linear-gradient(180deg, #FFFFFF 20%, #C99737 100%)
        -webkit-background-clip: text
        -webkit-text-fill-color: transparent
        justify-content: center
        display: flex
        white-space: nowrap
        overflow: hidden
        text-overflow: ellipsis
        max-width: calc(100% - 2.5rem)
        padding-top: 0.35rem
        margin: 0 1rem
        &.long-text
          justify-content: flex-start
        +iphone-width
          padding-top: 8px
          font-size: 10px
      .image-image-wrap
        width: 100%
        height: 11.75rem
        display: flex
        align-items: center
        justify-content: center
        padding-top: 1.5rem
        +iphone-width
          height: 7.75rem
        .image-image
          height: 7rem
          width: auto
          +iphone-width
            height: 5rem
    .image-wrap
      @apply w-full h-full relative cursor-pointer bg-black
      width: 100%
      height: auto
      object-fit: cover
      border-radius: 10%
      aspect-ratio: 1/1
  .form-row
    @apply mb-5 flex items-center flex-wrap
    +iphone-width
      @apply mb-0
    .form-label
      @apply text-base flex justify-between items-center
      width: 40%
      +iphone-width
        @apply w-full mt-5 mb-2
    .form-input
      width: 60%
      +iphone-width
        @apply w-full
      :deep(.q-field__control)
        color: transparent
        height: 3rem
        min-height: 3rem
        +iphone-width
          min-height: auto
          .q-field__native
            min-height: auto
        .q-field__native
          min-height: 3rem
          color: #fff
        .q-field__append
          height: 3rem
  .form-row-submit
    @apply flex justify-end mt-4
    .submit-btn
      margin-left: 25%
      border: 1px solid #ED772E
      padding: 0.5rem 3rem
      +iphone-width
        @apply w-full ml-0
.mask
  transform: translateX(-10%)
  +iphone-width
    transform: translateX(10%)
:deep(.q-date__content)
  background: #131313
  border-radius: 1rem
  color: #fff
  .bg-primary
    background: #917D60 !important
:deep(.q-field__native)
  border: 2px solid #313131
  border-radius: 0.5rem
  padding: 1.2rem 0.5rem
  line-height: 0.15rem
:deep(.q-field--with-bottom)
  padding: 0
:deep(.q-field__append)
  display: none
</style>
