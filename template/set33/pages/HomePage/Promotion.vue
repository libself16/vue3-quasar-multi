<template>
  <div class="promotion-layout">
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
          </div>
        </transition>
      </div>
    </div>
    <!-- dialog -->
    <q-dialog v-model="promotionDialog.show">
      <q-card class="promotion-dialog-wrapper">
        <q-card-section class="row items-center text-white font-bold promotion-title">
          {{ promotionDialog.detail?.title }}
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup @click="promotionDialog.closeDialog" />
        </q-card-section>
        <q-card-section class="flex-1 overflow-scroll promotion-content">
          <div v-html="promotionDialog.detail?.content"></div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>
<script lang="ts" setup>
import { usePromotion, type TypeItem } from "src/common/composables/usePromotion"
import { computed, onMounted, ref } from "vue"

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
// layout style
.promotion-layout
  padding-bottom: 20vw
  +setFlex
  cursor: pointer
  flex-direction: column
  +iphone-width
    padding-bottom: 88vw
  .type-show-area
    margin: 20px 0
    display: grid
    justify-content: space-between
    grid-template-columns: repeat(6, 1fr)
    gap: 15px
    +pad-width
      grid-template-columns: repeat(3, 1fr)
    +iphone-width
      grid-template-columns: repeat(2, 1fr)
      vertical-align: middle
      text-align: center
    .menu-item
      background: #0c103d
      color: #ffffff
      text-transform: uppercase
      display: flex
      justify-content: center
      align-items: center
      padding: 6px 30px
      font-weight: 700
      font-size: 14px
      margin: 0 10px
      cursor: pointer
      border: 1px solid #0c103d
      border-radius: 10px
      text-align: center
      min-width: 150px
      &:hover
        color: #fff
        background: linear-gradient(to bottom, rgba(169, 211, 32, 1) 0%, rgba(56, 131, 18, 1) 100%)
        box-shadow: inset 0px 0px 5px #fff
        border: 1px solid #8cbe1c
      +phone-width
        display: flex
        align-items: center
        justify-content: center
        flex-wrap: wrap
        padding: 5px 0px
        margin: 0 10px
    .active
      color: #fff
      background: linear-gradient(to bottom, rgba(169, 211, 32, 1) 0%, rgba(56, 131, 18, 1) 100%)
      box-shadow: inset 0px 0px 5px #fff
      border: 1px solid #8cbe1c
  .promotion-show-area
    display: grid
    grid-gap: 0px
    grid-template-columns: repeat(2, 1fr)
    gap: 25px 66px
    margin: 0 10px 30px
    +phone-width
      display: grid
      grid-gap: 0px
      grid-template-columns: repeat(1, 1fr)
      gap: 25px 35px
      .pm-boxer
        +setFlex

.promotion-dialog-wrapper
  max-width: 50rem
  width: 100%
  min-height: 50vh
  display: flex
  flex-direction: column

  .promotion-title
    background: #0174b5

  .promotion-content
    background: #d9f1ff
</style>
