<template>
  <BannerMember />
  <div class="promotion-container">
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
    <div class="form-title-content">
      <img :src="svgIcon('member-title-icon')" />
      <div class="title">{{ $t("menu.promotion") }}</div>
    </div>
    <div class="promotion-content">
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
        <q-card class="w-[90%] md:w-auto md:min-w-[500px] min-h-[180px] md:min-h-[350px] px-2 md:px-2">
          <q-card-section>
            <div class="form-title-content !ml-0 !w-full pr-14 flex justify-start">
              <img :src="svgIcon('member-title-icon')" />
              <div class="title">{{ promotionDialog.detail?.title }}</div>
            </div>
          </q-card-section>
          <q-card-section class="mt-0 pt-0">
            <div v-html="promotionDialog.detail?.content" class="text-black/70 break-all"></div>
          </q-card-section>
          <q-btn
            icon="close"
            class="absolute right-4 md:right-8 md:top-9 top-4 text-xs bg-black/30 text-white"
            flat
            round
            dense
            v-close-popup
            @click="promotionDialog.closeDialog"
          />
        </q-card>
      </q-dialog>
    </div>
  </div>
</template>

<script lang="ts" setup>
import BannerMember from "app/template/set_jokerhill/components/BannerMember.vue"
import { useSiteImg } from "app/template/set_jokerhill/hooks/useSiteImg"
import { usePromotion, type TypeItem } from "src/common/composables/usePromotion"
import { computed, onMounted, ref } from "vue"
const { activeType, updateActiveType, typeList, promotionList, handlePromotionList, promotionDialog } = usePromotion()

const aosEffect = ref("fadeIn")
const { svgIcon } = useSiteImg()
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
@import "../../assets/css/form.sass"

// layout style
.promotion-container
  color: #6288D2
  overflow: hidden
  max-width: 68rem
  margin: 0 auto
  +iphone-width
    padding: 0
  .type-show-area
    width: 100%
    overflow: scroll
    display: flex
    gap: 24px
    color: rgba(20, 20, 20, 0.40)
    font-family: "NotoSansTC"
    font-size: 16px
    font-style: normal
    font-weight: 700
    line-height: normal
    text-transform: uppercase
    padding: 2vw
    +phone-width
      max-width: 100vw
      overflow-x: auto
      max-width: 99vw
      margin: auto
      overflow-x: auto
      gap: 8px
      padding: 3vw 7vw
    .menu-item
      padding: 0
      white-space: nowrap
      cursor: pointer
      border-radius: 8px
      padding: 10px
      +iphone-width
        font-size: .75rem
        padding: .25rem .75rem
      &.active
        color: #fff
        background-color: $blue-active
        cursor: default
  .type-show-area::-webkit-scrollbar
    display: none
  .promotion-content
    width: 100%
    border-radius: 8px
    background: #fff
    padding: 2rem 2.5rem
    +setFlex
    cursor: pointer
    flex-direction: column
    +iphone-width
      padding: 2rem 0rem
    .promotion-show-area
      +setFlex
      flex-wrap: wrap
      gap: 10px
      margin: 0 5% 2.5rem
      +phone-width
        margin: 5% 5%
      +iphone-width
        margin: 5% 5%
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
</style>
