<template>
  <q-dialog
    v-model="alertDialog.show"
    transition-show="fade"
    transition-hide="fade"
    class="common-alert-dialog-wrapper"
  >
    <q-card class="common-alert-dialog-content">
      <q-card-section class="common-alert-dialog-header">
        <h3 class="common-alert-dialog-title">{{ $t(alertDialog.titleI18n) }}</h3>
        <q-btn class="common-close-btn" icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-card-section class="common-alert-dialog-body">
        <q-img
          v-if="alertDialog.type"
          :src="commonSvgIcon(`alert-${alertDialog.type}`)"
          loading="lazy"
          class="body-icon"
        ></q-img>
        <span class="body-text">{{ $t(alertDialog.contentI18n) }}</span>
      </q-card-section>
      <q-card-section class="common-alert-dialog-footer">
        <q-btn class="common-footer-btn" v-close-popup>{{ $t(alertDialog.footerBtnTextI18n) }}</q-btn>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { reactive, defineEmits, onMounted } from "vue"
import { useCommonImg } from "src/common/hooks/useCommonImg"
import { useEventBus } from "src/common/hooks/useEventBus"
import { ALERT_DIALOG_TYPE } from "src/common/utils/constants"

const { commonSvgIcon } = useCommonImg()
const { eventOn } = useEventBus()
const emits = defineEmits(["closeDialog", "footerBtnClick"])

const alertDialog = reactive({
  type: ALERT_DIALOG_TYPE.Enums.EMPTY,
  show: false,
  titleI18n: "",
  contentI18n: "",
  footerBtnTextI18n: ""
})

onMounted(() => {
  eventOn("openAlertDialog", (data) => {
    alertDialog.type = data.type || ALERT_DIALOG_TYPE.Enums.EMPTY
    alertDialog.show = data.show
    alertDialog.titleI18n = data.titleI18n
    alertDialog.contentI18n = data.contentI18n
    alertDialog.footerBtnTextI18n = data.footerBtnTextI18n || "OK"
  })
})
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";

// 可以在各自版型引入時，最外層包裹一個 class 來覆蓋樣式
.common-alert-dialog-content {
  max-width: 22.9375rem;
  width: 100%;
  min-height: 11.5rem;
  border-radius: 0.625rem;

  .common-alert-dialog-header {
    @apply flex items-center justify-between py-3 px-4;
    color: #000000;

    .common-alert-dialog-title {
      font-size: 1.5rem;
      font-weight: 700;
      line-height: 1.75rem;
    }

    .common-close-btn {
      min-width: auto;
      min-height: auto;

      :deep(.q-icon) {
        font-size: 1.25rem;
        font-weight: 500;
      }
    }
  }

  .common-alert-dialog-body {
    @apply overflow-y-auto flex items-center justify-center gap-2;
    padding: 0.625rem 1.875rem 0.125rem;
    max-height: calc(100vh - 244px);
    box-sizing: content-box;
    border: none;

    .body-icon {
      @apply w-6 h-6 flex-shrink-0;
    }

    .body-text {
      font-family: PingFangTC;
      font-weight: 600;
      font-size: 16px;
      line-height: 28.8px;
      text-align: center;
    }
  }

  .common-alert-dialog-footer {
    @apply p-[1.875rem] flex justify-center items-center;

    .common-footer-btn {
      @apply w-full;
      padding: 0.625rem 1.25rem;
      border-radius: 0.5rem;
      background: #025be8;
      box-shadow: 0px 2px 4px 0px #00000040;

      :deep(.q-btn__content) {
        font-family: OpenSans;
        font-weight: 400;
        font-size: 14px;
        line-height: 1.1875rem;
        text-transform: capitalize;
        color: #ffffff;
      }
    }
  }
}
</style>

<style lang="scss">
@import "src/common/css/_variable.sass";

.common-alert-dialog-wrapper {
  .q-dialog__backdrop {
    background: #000000b2 !important;
  }
  .q-dialog__inner {
    @include phone-width {
      &.q-dialog__inner--minimized {
        padding: 3.125rem 0.6875rem;
      }
    }
  }

  &.mobile-align-center {
    .q-dialog__inner {
      @include phone-width {
        &.q-dialog__inner--minimized {
          padding: 0 1rem;
        }
        &.flex-center {
          align-items: center;
        }
      }
    }
  }
}
</style>
