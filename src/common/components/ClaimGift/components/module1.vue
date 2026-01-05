<template>
  <div
    class="w-fit h-fit cursor-pointer fixed right-[4.375rem] bottom-[8.75rem] z-[6000]"
    v-if="iconShow && isLogin && giftsList.length > 0"
    v-draggable="{ storeKey: ELEMENT_KEYS.CLAIMGIFT }"
  >
    <q-img
      class="w-[1.5rem] absolute top-0 right-0 z-10"
      :src="getGiftImg('btn-close.svg')"
      loading="lazy"
      @click.stop="iconShow = false"
    />
    <q-img
      class="w-[5rem] mt-[.875rem]"
      :src="getGiftImg('giftBox.svg')"
      loading="lazy"
      @click="eventbus.emit('openClaimGiftDialog', true)"
    />
  </div>
  <q-dialog
    v-model="show"
    transition-show="fade"
    transition-hide="fade"
    :transition-duration="isMobile ? '0' : '300'"
    :maximized="isMobile"
    :no-backdrop-dismiss="true"
  >
    <q-card
      v-if="giftsList.length > 0"
      class="bg-transparent shadow-none flex justify-center items-center w-full relative !max-w-[1200px]"
    >
      <canvas ref="coinCanvas" class="absolute top-0 left-0 w-full h-full pointer-events-none z-10"></canvas>
      <div class="gift-card-container">
        <q-btn class="gift-close-btn" flat round dense v-close-popup @click="closeDialog">
          <q-img class="w-10 h-10" :src="getGiftImg('btn-close.svg')" loading="lazy" />
        </q-btn>
        <q-badge class="gift-length-circle" rounded :label="giftsList.length" />
        <span class="gift-title">{{ t("promotion.pick_and_win") }}</span>
        <q-img :src="getGiftImg('giftBox.svg')" class="gift-img" loading="lazy" />
        <q-btn class="gift-confirm-btn" :label="t('common.btn.claim')" @click="claimDialog = true" />
      </div>
    </q-card>
    <q-card v-else class="bg-transparent shadow-none flex justify-center items-center w-full relative !max-w-[800px]">
      <div class="gift-card-container">
        <q-btn class="gift-close-btn" flat round dense v-close-popup @click="closeDialog">
          <q-img class="w-10 h-10" :src="getGiftImg('btn-close.svg')" loading="lazy" />
        </q-btn>
        <span class="no-bonus-title">{{ t("promotion.no_bonus") }}</span>
        <q-img width="200px" :src="getGiftImg('giftBox_disabled.svg')" loading="lazy" />
      </div>
    </q-card>
  </q-dialog>

  <q-dialog v-model="claimDialog" persistent transition-show="scale" transition-hide="scale" class="claim-gift-dialog">
    <q-card v-if="giftsList.length" class="claim-gift-card">
      <q-card-section class="flex justify-between items-center px-0 py-4">
        <div class="w-5"></div>
        <div v-if="giftsList[0].options.length > 1" class="claim-gift-title">
          {{ t("invite_bonus.congrats") }}
        </div>
        <div v-else class="claim-gift-title">{{ t("invite_bonus.congrats") }}</div>
        <q-btn
          class="w-5 h-5 min-h-5 text-white text-[.75rem] p-0"
          icon="close"
          flat
          dense
          v-close-popup
          @click="closeDialog"
        />
      </q-card-section>
      <q-card-section v-if="giftsList[0].options.length > 1" class="px-0 py-4">
        <q-select
          v-model="selectedIndex"
          :options="giftsList[0].options"
          :option-value="(opt) => opt.value"
          :option-label="(opt) => opt.label"
          standout
          outlined
          dense
          borderless
          no-error-icon
          hide-bottom-space
          emit-value
          map-options
          class="claim-gift-select"
          popup-content-class="claim-gift-select-options"
          options-selected-class="claim-gift-select-options-selected"
        />
      </q-card-section>
      <q-card-section class="gift-amount-wrapper" :class="{ 'multi-option': giftsList[0].options.length > 1 }">
        <div class="gift-amount-content">
          <span>{{ t("promotion.you_get") }}</span>
          <span class="gift-amount">{{ moneyFormat(giftsList[0].options[selectedIndex].amount) }}</span>
          <span class="font-bold">{{ currencyIdMap?.[giftsList[0].options[selectedIndex].currency_id]?.code }}</span>
        </div>
      </q-card-section>
      <q-card-actions class="px-0 py-4">
        <q-btn
          class="claim-gift-btn"
          :label="t('common.btn.confirm')"
          @click="
            claimGift(
              giftsList[0].id,
              parseFloat(giftsList[0].options[selectedIndex].amount),
              giftsList[0].options[selectedIndex].currency_id
            )
          "
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, toRef } from "vue"
import { useQuasar } from "quasar"
import { useI18n } from "vue-i18n"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useCommonImg } from "src/common/hooks/useCommonImg"
import { useCoinsAnimation } from "src/common/composables/useClaimGift"
import { useGiftStore } from "src/stores/giftStore"
import { useBank } from "src/common/composables/useBank"
import { useClaimGift } from "src/common/hooks/useClaimGift"
import { useCommon } from "src/common/hooks/useCommon"
import { injectStrict } from "src/common/utils/injectTyped"
import { EventBusKey } from "src/symbols"
import { useAgentCode } from "src/common/hooks/useAgentCode"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import { useAuth } from "src/common/hooks/useAuth"
import { ELEMENT_KEYS } from "src/common/utils/constants/draggableElementKeyName"

const { isDown } = useMediaQuery()
const isMobile = toRef(isDown, "padXl")

const { isCNYToUSDT } = useAgentCode()
const eventbus = injectStrict(EventBusKey)
const { currencyIdMap } = useBank()
const { moneyFormat } = useCommon()
const giftStore = useGiftStore()
const giftsList = computed(() =>
  giftStore.giftState.list.map((e) => ({
    ...e,
    options: e.options.map((opt, i) => ({
      ...opt,
      value: i,
      label: isCNYToUSDT.value && opt.currency_code === "CNY" ? "USDT" : opt.currency_code
    }))
  }))
)

const { t } = useI18n()
const $q = useQuasar()
const { coinCanvas, startCoinAnimation, stopAnimation } = useCoinsAnimation()
const { ClaimGift } = useClaimGift()
const { getUserWalletList } = useUserInfo()
const { getGiftImg } = useCommonImg()
const { isLogin } = useAuth()

const iconShow = ref(true)
const show = ref(false)
const claimDialog = ref(false)
const selectedIndex = ref(0)

watch(show, async (newVal) => {
  if (newVal) {
    await nextTick()
    startCoinAnimation()
  } else {
    stopAnimation()
  }
})

function closeDialog() {
  claimDialog.value = false
  eventbus.emit("openClaimGiftDialog", false)
}

async function claimGift(id: number, amount: number, currency: number) {
  $q.loading.show()
  const status = await ClaimGift({
    gift_id: id,
    amount,
    currency
  })
  $q.loading.hide()
  if (!status) return
  claimDialog.value = false
  $q.notify({
    type: "positive",
    message: t("common.alarm.successfullyClaimed"),
    position: "top",
    timeout: 1000
  })
  await getUserWalletList()

  selectedIndex.value = 0
  if (giftsList.value.length === 0) {
    closeDialog()
  }
}

onMounted(async () => {
  eventbus.on("openClaimGiftDialog", (value: boolean) => {
    show.value = value
  })
})
</script>

<style lang="scss">
.claim-gift-dialog {
  .q-dialog__inner--minimized {
    @apply px-4;
  }
}
.claim-gift-select-options {
  background: var(--bg-08, #0c0c1c);
  color: var(--dialog-text-02, #ffffff);
  text-align: center;

  .q-item--active {
    color: var(--dialog-text-02, #ffffff);
  }

  .q-focus-helper {
    display: none;
  }

  .q-manual-focusable--focused {
    background: linear-gradient(90deg, var(--btn-bg-01, #f26319) 0%, var(--btn-bg-02, #d12d00) 100%);
  }
}
</style>
<style scoped lang="scss">
@import "src/common/css/_variable.sass";

.claim-gift-dialog {
  .gift-amount-wrapper {
    @apply px-0 py-[1.5688rem];

    &.multi-option {
      @apply py-[.475rem];
    }
  }
  .gift-amount-content {
    font-family: NotoSans;
    font-weight: 700;
    font-size: 1.5rem;
    line-height: 2.8125rem;
    color: var(--dialog-text-01, #ffffff);
    text-align: center;
  }
  .gift-amount {
    @apply mx-2 text-[2.25rem] leading-[2.8125rem];
  }
  .claim-gift-card {
    @apply py-0 px-5 rounded-xl bg-[#1D125D] w-[34.375rem] phone:w-full;
  }
  .claim-gift-title {
    font-family: NotoSans;
    font-weight: 700;
    font-size: 1.25rem;
    line-height: 1.6875rem;
    color: var(--dialog-text-02, #ffffff);
  }
  .claim-gift-select {
    :deep(.q-field__control) {
      @apply rounded pl-4 pr-[.625rem]  h-[2.5rem];
      @apply shadow-[0_2px_4px_0_#00000080];
      background: var(--input-dropdown-bg-01, #070609);
      border: 2px solid var(--input-dropdown-text-03, #d2d2d23d);
      box-shadow: 0px 2px 4px 0px #00000080;

      .q-field__control-container {
        @apply h-[2.375rem];
      }
      .q-field__native {
        @apply min-h-[2.375rem];
      }

      .q-field__native {
        @apply p-0 font-[NotoSans] font-bold text-[1rem] leading-[1.375rem];
        color: var(--input-dropdown-text-02, #ffffff);

        &::placeholder {
          @apply opacity-100;
        }
      }

      &::after {
        @apply border-none;
      }
    }
    :deep(.q-field__append) {
      @apply h-[2.375rem];
      color: var(--input-dropdown-text-02, #ffffff);
    }
  }
  .claim-gift-btn {
    @apply w-full py-[.625rem] rounded capitalize;
    @apply font-[NotoSans] font-bold text-[.75rem] leading-[1rem];
    color: var(--btn-text-05, #ffffff);
    background: linear-gradient(90deg, var(--btn-bg-01, #f26319) 0%, var(--btn-bg-02, #d12d00) 100%);
  }
}
.gift-card-container {
  @apply relative flex flex-col items-center py-10 px-16;

  .gift-close-btn {
    @apply absolute top-0 right-0;
  }

  .gift-length-circle {
    @apply absolute top-24 right-10 rounded-full flex items-center justify-center;
    font-family: Helvetica;
    font-weight: 700;
    font-size: 1rem;
    line-height: 1.125rem;
    width: 1.875rem;
    height: 1.875rem;
    background: #ff4242;
  }

  .gift-title {
    font-family: Helvetica;
    font-weight: 700;
    font-size: 2.25rem;
    line-height: 2.5625rem;
    margin-bottom: 1.25rem;
    color: var(--neutral-01, #ffffff);
  }

  .gift-img {
    width: 12.785rem;
  }

  .gift-confirm-btn {
    @apply mt-5 w-full p-[.625rem] min-h-[2.25rem];
    background: linear-gradient(90deg, #f26319 0%, #d12d00 100%);

    :deep(.q-btn__content) {
      font-family: NotoSans;
      font-weight: 700;
      font-size: 12px;
      line-height: 1rem;
      text-transform: capitalize;
      color: var(--btn-text-05, #ffffff);
    }
  }

  .no-bonus-title {
    font-family: Helvetica;
    font-weight: 700;
    font-size: 2.25rem;
    line-height: 2.5625rem;
    color: var(--neutral-01, #ffffff);
  }
}
</style>
