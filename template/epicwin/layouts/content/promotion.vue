<template>
  <div class="promotion-content">
    <div class="type-show-area">
      <div
        v-for="item in typeList"
        :key="item.value"
        :class="['menu-item', activeType == item.value ? 'active' : '']"
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
          </div>
        </transition>
      </div>
    </div>
    <!-- dialog -->
    <q-dialog v-model="promotionDialog.show">
      <q-card class="q-dark promotion-dialog-wrapper">
        <q-card-section class="row items-center text-white font-bold promotion-title">
          {{ promotionDialog.detail?.title }}
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
import { onMounted, ref, computed } from "vue"

const { activeType, updateActiveType, typeList, promotionList, handlePromotionList, promotionDialog } = usePromotion()

import "vue3-carousel/dist/carousel.css"

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

// layout style
.promotion-content
  +setFlex
  cursor: pointer
  flex-direction: column
  +iphone-width
    padding-bottom: 88vw
  .type-show-area
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
    padding: 3vw 5vw
    +phone-width
      gap: 0px
      // background: #333333
      max-width: 100vw
      overflow-x: auto
    +iphone-width
      // background: #333333
      max-width: 99vw
      margin: auto
      overflow-x: auto
    .menu-item
      min-width: 100px
      text-align: center
      margin: 0px 5px 4px
      border: 2px solid #9d00ff
      border-radius: 20px
      padding: 8px
      line-height: normal
      background: #000000
    .active
      color: #fff
      background: #9d00ff
  .type-show-area::-webkit-scrollbar
    display: none
  .promotion-show-area
    display: flex
    align-items: center
    justify-content: flex-start
    flex-wrap: wrap
    width: 100%
    gap: 10px
    margin: 0 5%
    +phone-width
      margin: 0% 5%
    +iphone-width
      margin: 0% 5%
    .image-item
      width: calc(50% - 5px)
      padding: 0 5px
      +phone-width
        width: calc(100% - 10px)
        padding: 5px 0
      +iphone-width
        width: calc(100% - 10px)
        padding: 5px 0
      img
        width: 100%

.promotion-dialog-wrapper
  max-width: 50rem
  width: 100%
  min-height: 50vh
  display: flex
  flex-direction: column
</style>
