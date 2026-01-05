<template>
  <ModalBase
    v-model="modalShow"
    modal-class="modal_promotion_custom"
    use-title
    :title="$t('menu.promotion')"
    title-class="modal_title_top_promo"
    max-width="1280px"
    height="calc(100vh - 100px)"
  >
    <div class="promo_mainwrapper">
      <ul class="filter-list desktop_promo">
        <li
          :class="{ 'mixitup-control-active': activeType === item.value }"
          v-for="item in typeList"
          :key="item.name"
          @click="changeTab(item)"
        >
          {{ $t(item.name) }}
        </li>
      </ul>
      <div class="filt-container">
        <div class="mix category1" v-for="item in promotionList" :key="item.id">
          <div class="promo_box_wrap">
            <q-img :src="item.details[0]?.image"></q-img>
            <div class="promo_box_wrap_inn">
              <p>{{ promotionTitle(item.details) }}</p>
              <div class="promo_box_wrap_a">
                <q-btn href="#" size="1rem" class="capitalize" @click="promotionDialog.showDialog(item)">
                  {{ $t("common.btn.readMore") }}</q-btn
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- More Info -->
    <ModalBase v-model="promotionDialog.show" max-width="900px" modal-class="modal_promotion_detail_custom">
      <div class="break-words" v-html="promotionDialog.detail?.content"></div>
    </ModalBase>
  </ModalBase>
</template>

<script setup lang="ts">
import { useLanguage } from "src/common/composables/useLanguage"
import { usePromotion, type TypeItem } from "src/common/composables/usePromotion"
import ModalBase from "./modalBase.vue"
import { ref, onMounted, computed } from "vue"
import type * as Response from "src/api/response.type"
import { injectStrict } from "src/common/utils/injectTyped"
import { EventBusKey } from "src/symbols"

const { getLanguage } = useLanguage()
const { activeType, updateActiveType, typeList, promotionList, handlePromotionList, promotionDialog } = usePromotion()
const eventbus = injectStrict(EventBusKey)

const nowLang = computed(() => getLanguage())
const modalShow = ref(false)
const modalDetailShow = ref(false)

const promotionTitle = (detail: Response.PromotionDetail[]) => {
  const promotionDetail = detail.find((detail: Response.PromotionDetail) => detail.lang === nowLang.value)

  if (promotionDetail) {
    return promotionDetail.title
  }
}

const changeTab = (current: TypeItem) => {
  updateActiveType(current)
}

const openModal = async () => {
  modalShow.value = true
  await handlePromotionList()
}

defineExpose({
  openModal
})

onMounted(() => {
  eventbus.on("openPromotion", (show: boolean) => {
    if (show) {
      openModal()
    }
  })
})
</script>

<style lang="scss">
.modal_promotion_custom {
  .promo_mainwrapper {
    margin: 1.5rem 1rem 1rem 1rem;
  }
}

.modal_promotion_detail_custom {
  .modal-content {
    max-height: calc(100vh - 100px) !important;
  }
}
</style>
