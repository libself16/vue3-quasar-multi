<template>
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
        <q-btn class="gift-close-btn" icon="close" flat round dense v-close-popup @click="closeDialog" />
        <q-badge class="gift-length-circle" rounded color="primary" :label="giftsList.length" />
        <span class="gift-title">{{ t("promotion.pick_and_win") }}</span>
        <q-img :src="claimGiftImg('giftBox.png')" class="gift-img" loading="lazy" />
        <q-btn
          class="gift-confirm-btn"
          unelevated
          rounded
          :label="t('promotion.pick_now')"
          @click="claimDialog = true"
        />
      </div>
    </q-card>
    <q-card v-else class="bg-transparent shadow-none flex justify-center items-center w-full relative !max-w-[800px]">
      <div class="gift-card-container">
        <q-btn class="gift-close-btn" icon="close" flat round dense v-close-popup @click="closeDialog" />
        <span class="no-bonus-title">{{ t("promotion.no_bonus") }}</span>
        <q-img width="200px" :src="claimGiftImg('giftBox_disabled.png')" loading="lazy" />
        <q-btn class="mt-10" unelevated rounded color="grey-13" disable :label="t('promotion.pick_now')" />
      </div>
    </q-card>
  </q-dialog>

  <q-dialog v-model="claimDialog" persistent transition-show="scale" transition-hide="scale" class="claim-gift-dialog">
    <q-card v-if="giftsList.length" class="claim-gift-card p-4 !rounded-xl" style="width: 600px">
      <q-card-section class="flex justify-between items-center">
        <div v-if="giftsList[0].options.length > 1" class="claim-gift-title">
          {{ t("promotion.select_currency") }}
        </div>
        <div v-else class="claim-gift-title">{{ t("promotion.congratulations") }}</div>
        <q-btn class="absolute top-0 right-0" icon="close" flat round dense v-close-popup @click="closeDialog" />
      </q-card-section>
      <q-card-section
        v-if="giftsList[0].options.length > 1"
        class="q-pa-none flex flex-col justify-center items-center"
      >
        <div class="claim-select-wrapper">
          <select v-model="selectedIndex" class="claim-gift-select">
            <option v-for="(option, index) in giftsList[0].options" :value="index" :key="option.currency_code">
              {{
                isCNYToUSDT && option.currency_code === "CNY"
                  ? "USDT"
                  : isIDRToEUR && option.currency_code === "IDR"
                  ? "EUR"
                  : option.currency_code
              }}
            </option>
          </select>
        </div>
      </q-card-section>
      <q-card-section class="q-pt-none flex justify-center items-center text-2xl mt-4">
        <div class="gift-amount-wrapper">
          <span>{{ t("promotion.you_get") }}</span>
          <span class="gift-amount">{{ moneyFormat(giftsList[0].options[selectedIndex].amount) }}</span>
          <span class="font-bold">{{ currencyIdMap?.[giftsList[0].options[selectedIndex].currency_id]?.code }}</span>
        </div>
      </q-card-section>
      <q-card-actions align="center">
        <q-btn
          class="claim-gift-btn"
          unelevated
          rounded
          color="primary"
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
import { useSiteImg } from "app/template/okbet/hooks/useSiteImg"
import { useCoinsAnimation } from "src/common/composables/useClaimGift"
import { useGiftStore } from "src/stores/giftStore"
import { useBank } from "src/common/composables/useBank"
import { useClaimGift } from "src/common/hooks/useClaimGift"
import { useCommon } from "src/common/hooks/useCommon"
import { injectStrict } from "src/common/utils/injectTyped"
import { EventBusKey } from "src/symbols"
import { useAgentCode } from "src/common/hooks/useAgentCode"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"

const { isDown } = useMediaQuery()
const isMobile = toRef(isDown, "padXl")

const { isCNYToUSDT, isIDRToEUR } = useAgentCode()
const eventbus = injectStrict(EventBusKey)
const { currencyIdMap } = useBank()
const { moneyFormat } = useCommon()
const giftStore = useGiftStore()
const giftsList = computed(() => giftStore.giftState.list)
const { t } = useI18n()
const $q = useQuasar()
const { coinCanvas, startCoinAnimation, stopAnimation } = useCoinsAnimation()
const { ClaimGift } = useClaimGift()
const { getUserWalletList } = useUserInfo()
const { claimGiftImg } = useSiteImg()

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

<style scoped lang="scss">
@import "src/common/css/_variable.sass";
@import "app/template/okbet/assets/css/_variable.sass";

.claim-gift-dialog {
  .gift-amount-wrapper {
    color: $text-dark-color;
    font-size: 1.75rem;

    @include phone-width {
      font-size: 1rem;
    }
  }
  .gift-amount {
    color: $text-primary-color;
    margin: 1.5rem;
    font-size: 2.25rem;

    @include phone-width {
      font-size: 1.5rem;
    }
  }
  .claim-gift-card {
    background: $background-light-color;
  }
  .claim-gift-title {
    @apply text-2xl font-bold;

    @include phone-width {
      font-size: 1rem;
    }
  }
  .claim-select-wrapper {
    @apply rounded-full px-5 py-1 mb-2 flex items-center justify-center;
    background: $background-quaternary-color;
  }
  .claim-gift-select {
    @apply w-full focus:outline-none text-xl;
    color: $text-light-color;
    background: $background-quaternary-color;
  }
  .claim-gift-btn {
    @apply my-4 text-xl;
    width: 13.5625rem;
    min-height: 2.5rem;
    font-size: 1.25rem;

    @include phone-width {
      width: 9.3125rem;
      font-size: 0.875rem;
    }
  }
}
.gift-card-container {
  @apply relative flex flex-col items-center py-10 px-16;

  .gift-close-btn {
    @apply absolute top-0 right-0;
    color: $text-light-color;
  }

  .gift-length-circle {
    @apply absolute top-24 right-8 text-lg rounded-full flex items-center justify-center;
    width: 2.5rem;
    height: 2.5rem;

    @include phone-width {
      width: 1.75rem;
      height: 1.75rem;
    }
  }

  .gift-title {
    @apply bg-gradient-to-r bg-clip-text text-3xl text-transparent font-bold;
    font-size: 2.5rem;
    margin-bottom: 0.8125rem;
    background-image: linear-gradient(to right, $background-light-warm-gold, $background-dark-warm-gold);

    @include phone-width {
      font-size: 1.5rem;
      margin-bottom: 2.0625rem;
    }
  }

  .gift-img {
    width: 18.75rem;

    @include phone-width {
      width: 11.8125rem;
    }
  }

  .gift-confirm-btn {
    @apply mt-10 text-lg;
    min-width: 12.875rem;
    background: $primary-color;
    color: $text-light-color;
  }

  .no-bonus-title {
    @apply text-3xl text-transparent font-bold;
    color: $text-light-color !important;
  }
}
</style>
