<template>
  <BannerMember />
  <div class="promotion-content">
    <div class="type-show-area">
      <div
        v-for="item in typeList"
        :key="item.value"
        :class="['menu-item', item.value === activeType ? 'active' : '']"
        @click="changeTab(item)"
      >
        {{ $t(item.name) }}
      </div>
    </div>
    <div class="promotion-show-area">
      <div v-for="item in promotionList" :key="item.id" class="image-item">
        <transition
          appear
          :enter-active-class="enterActiveClass"
          leave-active-class="animated fadeOut"
          @click="promotionDialog.showDialog(item)"
        >
          <div class="pm-boxer">
            <img :src="item.details[0]?.image" />
            <div class="more-info">{{ $t("common.btn.moreInfo") }}</div>
          </div>
        </transition>
      </div>
    </div>
    <!-- dialog -->
    <q-dialog v-model="promotionDialog.show">
      <q-card class="q-dark promotion-dialog-wrapper">
        <q-card-section class="row items-center promotion-title">
          <div class="form-title-content">
            <div class="color-label"></div>
            <div class="title">{{ promotionDialog.detail?.title }}</div>
          </div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup @click="promotionDialog.closeDialog" />
        </q-card-section>
        <q-card-section class="flex-1 overflow-scroll">
          <div v-html="promotionDialog.detail?.content"></div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script lang="ts" setup>
import { usePromotion, type TypeItem } from "src/common/composables/usePromotion"
import { computed, onMounted, ref } from "vue"
import BannerMember from "app/template/set49/components/BannerMember.vue"
const { activeType, updateActiveType, typeList, promotionList, handlePromotionList, promotionDialog } = usePromotion()

const aosEffect = ref("fadeIn")
const enterActiveClass = computed(() => `animated ${aosEffect.value}`)
const changeTab = (current: TypeItem) => {
  aosEffect.value = current.value > activeType.value ? "fadeInRight" : "fadeInLeft"
  updateActiveType(current)
}
onMounted(async () => {
  await handlePromotionList()
})
</script>

<style lang="sass" scoped>
@import 'src/common/css/_variable.sass'
@import 'src/css/form.sass'
@import 'template/set49/assets/css/_variable.scss'

// layout style
.promotion-content
  +setFlex
  flex-direction: column
  align-items: flex-start
  .type-show-area
    @apply py-8 px-24 pb-0
    width: 100%
    overflow: scroll
    display: flex
    gap: 24px
    color: var(--white-70, rgba(255, 255, 255, 0.70))
    font-family: "Century Gothic"
    font-size: 16px
    font-style: normal
    font-weight: 700
    line-height: normal
    text-transform: uppercase
    +phone-width
      @apply px-4 py-4
      background: $primary-btn-bg
      max-width: 100vw
      overflow-x: auto
    +iphone-width
      background: $primary-btn-bg
      max-width: 99vw
      margin: auto
      overflow-x: auto
    .menu-item
      cursor: pointer
      padding: 0
      white-space: nowrap
      padding: 10px
    .active
      color: var(--sidebar_black, #24262B)
      border-radius: 8px
      background: #FFC002
  .type-show-area::-webkit-scrollbar
    display: none
  .promotion-show-area
    +setFlex
    @apply justify-start flex-wrap gap-[40px] p-8 px-16
    +phone-width
      @apply px-0 p-0
      margin: 5% 5%
      gap: 16px
    +iphone-width
      margin: 5% 5%
      gap: 16px
    .image-item
      cursor: pointer
      width: calc(50% - 20px)
      +phone-width
        width: calc(100% - 0px)
      +iphone-width
        width: calc(100% - 0px)
      .pm-boxer
        @apply relative
        img
          width: 100%
        .more-info
          @apply absolute right-4 bottom-4 bg-[#FFC002]
          @apply text-[#1C1E22B2] text-[1.25rem] font-bold
          @apply rounded-full py-1 px-4 uppercase
          box-shadow: 0px 2.23px 5.57px 0px #00000040
          +phone-width
            @apply text-xs px-3 capitalize

.promotion-dialog-wrapper
  max-width: 50rem
  width: 100%
  min-height: 50vh
  display: flex
  flex-direction: column
</style>
