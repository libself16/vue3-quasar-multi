<template>
  <HeaderTitleBack titleI18n="menu.promotions" v-bind="HTBConfig">
    <q-tabs v-model:model-value="activeType" :stretch="true" dense :outside-arrows="false">
      <q-tab v-for="item in typeList" :name="item.value" :key="item.value" class="pmbox filter" @click="changeTab(item)"
        :label="$t(item.name).toUpperCase()">
      </q-tab>
    </q-tabs>
    <div class="promo-content">
      <TransitionGroup name="list" tag="div" class="promotions-list">
        <div v-for="item in promotionList" :key="item.id" class="promo-bx mix promo1 inline-block min-h-24"
          @click="promotionDialog.showDialog(item)">
          <img :src="item.details[0]?.image" />
          <div class="promo-box">{{ item.details[0]?.title }}</div>
        </div>
      </TransitionGroup>
    </div>
  </HeaderTitleBack>
  <!-- Promotion Detail Dialog -->
  <q-dialog v-model="promotionDialog.show">
    <q-card class="promo-modal">
      <q-card-section class="modal-title">
        {{ promotionDialog.detail?.title }}
        <q-btn color="blue-grey-8" class="close-btn" icon="close" flat round dense v-close-popup
          @click="promotionDialog.closeDialog" />
      </q-card-section>
      <q-card-section class="promotion-content">
        <div class="content-wrapper">
          <div v-html="promotionDialog.detail?.content"></div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import { usePromotion, type TypeItem } from "src/common/composables/usePromotion"
import { useHTBConfig } from "app/template/set_6M88/hooks/useHTBConfig"
import HeaderTitleBack from "src/common/components/modal/HeaderTitleBack.vue"
import { onMounted } from "vue"
import { useQuasar } from "quasar"
import { useRouter } from "vue-router";

const { HTBConfig } = useHTBConfig()
const { activeType, updateActiveType, typeList, promotionList, handlePromotionList, promotionDialog } = usePromotion()
const $q = useQuasar()
const router = useRouter()

const changeTab = (type: TypeItem) => {
  updateActiveType(type)
}

const initPromotionList = async () => {
  $q.loading.show()
  await handlePromotionList()
  $q.loading.hide()
}

onMounted(() => {
  initPromotionList()
})
</script>

<style lang="scss" scoped>
.promo-content {
  @apply pt-4;
}

.q-tabs {
  @apply bg-white relative z-10 -mt-1;
  box-shadow: rgb(0, 95, 121) 2px 4px 8px -6px;
  ::v-deep(.q-tabs__content) {

    .pmbox {
      @apply mt-0 py-0 border-b-0;
    }
  }
}

.promo-modal {
  @apply w-[95vw] max-h-[98vh] !important;
  @apply rounded-xl;

  .modal-title {
    @apply text-white font-bold;
    @apply flex items-center justify-between;
    background: linear-gradient(to bottom, #3fecff 0%, #2597ff 100%);
  }

  .promotion-content {
    .content-wrapper {
      ::v-deep(table) {
        @apply max-w-full;
      }
    }
  }
}

.list-enter-active {
  animation: zoomIn 0.5s;
}

.list-leave-active {
  animation: zoomOut 0.5s;
  position: absolute;
  width: 100%;
}

.list-move {
  transition: transform 0.5s;
}

@keyframes zoomIn {
  from {
    opacity: 0;
    transform: scale(0.5);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes zoomOut {
  from {
    opacity: 1;
    transform: scale(1);
  }

  to {
    opacity: 0;
    transform: scale(0.5);
  }
}

.list-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.list-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}
</style>
