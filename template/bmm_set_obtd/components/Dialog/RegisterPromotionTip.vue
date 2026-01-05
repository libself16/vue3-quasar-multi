<template>
  <q-dialog v-model="dialog" persistent class="register-promotion-wrapper">
    <q-card class="register-promotion-content">
      <q-card-section class="register-promotion-header">
        <q-img :src="rouletteGameRegisterImg('box.png')" loading="lazy"></q-img>
      </q-card-section>
      <q-card-section class="register-promotion-body">
        <div>{{ $t("promotion.are_you_sure_you_want_to_cancel_registration") }}</div>
        <div v-if="firstRegisterPromotion">
          {{ $t("promotion.complete_registration_to_receive_immediately") }}
          <span>{{ getCurrencyCodeById(firstRegisterPromotion.reward[0].currency_id) }}&nbsp;</span>
          <span>{{ moneyFormat(firstRegisterPromotion.reward[0].amount) }}</span>
          &nbsp;{{ $t("promotion.reward") }}
        </div>
      </q-card-section>
      <q-card-section class="register-promotion-footer">
        <q-btn color="primary" class="btn-submit" v-close-popup>{{ $t("common.btn.continue") }}</q-btn>
        <q-btn flat class="btn-cancel" @click="closeRegister">{{ $t("promotion.yes_i_painfully_give_up") }}</q-btn>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"
import { useCommon } from "src/common/hooks/useCommon"
import { useCurrency } from "src/common/hooks/useCurrency"
import { useCommonImg } from "src/common/hooks/useCommonImg"
import { usePromotionRegister } from "src/common/composables/usePromotionRegister"
import { useEventBus } from "src/common/hooks/useEventBus"

const { moneyFormat } = useCommon()
const { getCurrencyCodeById } = useCurrency()
const { rouletteGameRegisterImg } = useCommonImg()
const { firstRegisterPromotion } = usePromotionRegister()
const { eventOn, eventEmit } = useEventBus()

const dialog = ref(false)

function closeRegister() {
  dialog.value = false
  eventEmit("openLogin", false)
}

onMounted(async () => {
  eventOn("openRegisterPronotionTip", (show: boolean) => {
    dialog.value = show
  })
})
</script>

<style scoped lang="scss">
@import "app/template/bmm_set_obtd/assets/css/button.scss";

.register-promotion-content {
  @apply flex flex-col  items-center p-6 rounded-xl;
  width: 19.8125rem;
  min-height: 21.89rem;

  .q-card__section--vert {
    padding: 0;
  }

  .register-promotion-header {
    .q-img {
      width: 7.4375rem;
      height: 9.015rem;
    }
  }

  .register-promotion-body {
    @apply mt-3;

    div {
      font-family: NotoSans;
      font-weight: 400;
      font-size: 1rem;
      line-height: 1.375rem;
      text-align: center;
      vertical-align: middle;
      color: #464646;

      span {
        font-weight: 900;
        color: #0048ff;
      }
    }
  }

  .register-promotion-footer {
    @apply mt-7 flex flex-col items-center gap-1;

    .btn-submit {
      @apply py-2 px-7 rounded-xl min-h-0;

      :deep(.q-btn__content) {
        font-family: NotoSans;
        font-weight: 700;
        font-size: 0.875rem;
        line-height: 1.1875rem;
        text-align: center;
        vertical-align: middle;
        color: #ffffff;
      }
    }

    .btn-cancel {
      @apply py-2 px-7 rounded-xl min-h-0;

      :deep(.q-btn__content) {
        font-family: NotoSans;
        font-weight: 400;
        font-size: 0.875rem;
        line-height: 1.1875rem;
        text-align: center;
        vertical-align: middle;
        color: #464646;
        text-transform: capitalize;
      }
    }
  }
}
</style>
