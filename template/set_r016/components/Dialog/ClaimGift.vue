<template>
  <q-dialog
    v-model="show"
    transition-show="fade"
    transition-hide="fade"
    :transition-duration="$q.platform.is.mobile ? '0' : '300'"
    :maximized="$q.platform.is.mobile"
    :no-backdrop-dismiss="true"
  >
    <q-card
      v-if="giftsList.length > 0"
      class="bg-transparent shadow-none flex justify-center items-center w-full relative !max-w-[800px]"
    >
      <canvas ref="coinCanvas" class="absolute top-0 left-0 w-full h-full pointer-events-none z-10"></canvas>
      <div class="gift-card-container">
        <q-btn class="gift-close-btn" icon="close" flat round dense v-close-popup @click="closeDialog" />
        <q-badge class="absolute top-24 right-8 text-lg" rounded color="red" :label="giftsList.length" />
        <span class="gift-title">{{ t("promotion.pick_and_win") }}</span>
        <q-img width="200px" :src="claimGiftImg('giftBox.png')" loading="lazy" />
        <q-btn
          class="gift-confirm-btn mt-10 text-lg px-16 md:px-24"
          unelevated
          dense
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
    <q-card v-if="giftsList.length" class="claim-gift-card p-5 !rounded-xl" style="width: 600px">
      <q-card-section class="flex justify-between items-center p-0">
        <div v-if="giftsList[0].options.length > 1" class="text-bold text-2xl title">
          {{ t("promotion.select_currency") }}
        </div>
        <div v-else class="text-bold text-2xl title">{{ t("promotion.congratulations") }}</div>
        <q-btn
          class="absolute top-0 right-0 claim-gift-card-close-btn"
          icon="close"
          flat
          round
          dense
          v-close-popup
          @click="closeDialog"
        />
      </q-card-section>
      <q-card-section
        v-if="giftsList[0].options.length > 1"
        class="q-pa-none flex flex-col justify-center items-center claim-select-muti"
      >
        <q-btn-dropdown
          class="currency-selectl-wrap"
          :label="currencyIdMap?.[giftsList[0].options[selectedIndex].currency_id]?.code"
        >
          <q-list class="currency-select-list">
            <q-item
              v-for="(option, index) in giftsList[0].options"
              :value="index"
              :key="option.currency_code"
              clickable
              v-close-popup
              class="currency-select text-bold"
              active-class="currency-selected"
              :active="selectedIndex === index"
              @click="selectedIndex = index"
            >
              <q-item-section>
                <q-item-label>{{
                  isCNYToUSDT && option.currency_code === "CNY"
                    ? "USDT"
                    : isIDRToEUR && option.currency_code === "IDR"
                    ? "EUR"
                    : option.currency_code
                }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
        <div class="gift-amount-wrapper w-full">
          {{ t("member.withdrawal.amount") }}
          <div class="flex items-center justify-between gift-amount-content w-full px-3 py-3 rounded-xl">
            <span class="gift-amount">{{ moneyFormat(giftsList[0].options[selectedIndex].amount) }}</span>
            <span class="currency">{{ currencyIdMap?.[giftsList[0].options[selectedIndex].currency_id]?.code }}</span>
          </div>
        </div>
      </q-card-section>
      <q-card-section v-else class="q-pt-none flex justify-start items-start mt-[1.875rem] mb-4 p-0 min-h-[6.375rem]">
        <span class="gift-amount-wrapper">
          {{ t("promotion.you_get") }}
          <span class="gift-amount text-3xl">{{ moneyFormat(giftsList[0].options[selectedIndex].amount) }}</span>
          {{ currencyIdMap?.[giftsList[0].options[selectedIndex].currency_id]?.code }}
        </span>
      </q-card-section>
      <q-card-actions align="center" class="p-0">
        <q-btn
          class="w-full text-lg confirm-btn"
          unelevated
          dense
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
import { useQuasar } from "quasar"
import { ref, computed, watch, nextTick, onMounted } from "vue"
import { useI18n } from "vue-i18n"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useSiteImg } from "app/template/set_r016/hooks/useSiteImg"
import { useCoinsAnimation } from "src/common/composables/useClaimGift"
import { useGiftStore } from "src/stores/giftStore"
import { useBank } from "src/common/composables/useBank"
import { useClaimGift } from "src/common/hooks/useClaimGift"
import { useCommon } from "src/common/hooks/useCommon"
import { injectStrict } from "src/common/utils/injectTyped"
import { EventBusKey } from "src/symbols"
import { useAgentCode } from "src/common/hooks/useAgentCode"

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
@import "app/template/set_r016/assets/css/_variable.scss";

.claim-gift-dialog {
  .gift-amount-wrapper {
    @include fontStyle();
    color: $neutral09;
  }
  .claim-gift-card {
    background: $neutral03;
    .claim-gift-card-close-btn {
      color: $primary04;
    }
    .title {
      color: $primary04;
    }

    .confirm-btn {
      background: linear-gradient(180deg, $primary04 0%, $primary05 100%);
      color: $primary01;
      border-radius: 0.625rem;
      height: 2.25rem;
      margin-bottom: 2.75rem;
    }

    .claim-select-muti {
      .gift-amount-wrapper {
        color: $neutral10;
        .currency {
          color: $neutral06;
        }
        .gift-amount-content {
          background: $neutral01;
          box-shadow: 0px 4px 4px 0px #0000001a;
        }
      }
    }
  }
  .claim-select-wrapper {
    background: $primary01;
  }
  // .claim-gift-select {
  //   color: $primary01;
  //   background: $primary01;
  // }
}
.gift-card-container {
  @apply relative flex flex-col items-center py-10 px-16;

  .gift-close-btn {
    @apply absolute top-0 right-0;
    color: $primary01;
  }

  .gift-title {
    @apply text-3xl text-white font-bold mb-2;
  }

  .gift-confirm-btn {
    background: linear-gradient(180deg, $primary04 0%, $primary05 100%);

    color: $primary01;
  }

  .no-bonus-title {
    @apply text-3xl text-transparent font-bold;
    color: $primary01 !important;
  }
}

.currency-selectl-wrap {
  width: 100px;
  height: 40px;
  box-shadow: 0px 4px 4px 0px #0000001a;
  @apply rounded-md flex items-center justify-between px-3 cursor-pointer;

  :deep(.q-icon) {
    color: $neutral06;
  }
}

.currency-select-list {
  .currency-select {
    background: $primary01;
    color: black;
  }
  .currency-selected {
    background: $primary02;
  }
}
</style>
