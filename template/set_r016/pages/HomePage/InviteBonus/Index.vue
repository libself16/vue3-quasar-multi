<template>
  <div class="invite-bonus">
    <template v-if="!loading && referralSignupOverview">
      <InviteBonusHeader :translation="referralSignupOverview.translation" />
      <InviteBonusBody
        :metrics="referralSignupOverview.metrics"
        :onOpenClaim="openClaimDialog"
        :claimable="giftData.currency !== 0 && giftData.gift_id !== 0"
      />
      <InviteBonusFooter
        :rewards="referralSignupOverview.rewards"
        :onOpenClaim="openClaimDialog"
        :claimable="giftData.currency !== 0 && giftData.gift_id !== 0"
      />
    </template>
  </div>

  <q-dialog v-model="isClaimDialogOpen" persistent transition-show="rotate" transition-hide="rotate">
    <q-card class="dialog-card">
      <q-card-section class="dialog-header">
        <p class="dialog-title">{{ $t("invite_bonus.congrats") }}</p>
        <q-icon class="dialog-close-icon" name="close" @click="isClaimDialogOpen = false" />
      </q-card-section>
      <q-card-section class="dialog-body">
        <ChangeCurrency :onChangeCurrency="onChangeCurrency" />
        <q-input
          class="dialog-input"
          outlined
          v-model="giftData.amount"
          :dark="false"
          :placeholder="$t('invite_bonus.amount')"
          :key="giftData.currency"
        >
          <template v-slot:append>
            <p class="dialog-input-currency" v-if="currencyIdMap">{{ currencyIdMap[giftData.currency]?.code }}</p>
          </template>
        </q-input>
        <q-btn
          class="claim-btn"
          :disabled="!giftData.amount"
          @click="onClaim()"
          :label="$t('invite_bonus.claim')"
        ></q-btn>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_r016/assets/css/_variable.scss";
@import "app/template/set_r016/assets/css/button.scss";

.invite-bonus {
  @apply flex flex-col gap-[1.25rem];
}

.dialog-card {
  @apply w-[500px] rounded-[10px];
  background-color: $neutral03;
  .dialog-header {
    @apply flex items-center justify-between;
    color: $primary04;
    .dialog-title {
      @apply text-[1.5rem] font-bold;
    }
    .dialog-close-icon {
      @apply text-[1.5rem] cursor-pointer;
    }
  }

  .dialog-body {
    @apply flex flex-col items-center gap-[1.25rem];

    .dialog-input {
      @apply w-full max-h-[2.5rem] bg-white rounded-[.625rem];

      :deep(.q-field__control) {
        @apply max-h-[2.5rem] rounded-[.625rem];
        color: $neutral06 !important;
      }

      :deep(.q-field__control-container),
      :deep(.q-field__marginal) {
        @apply max-h-[2.5rem];
      }

      .dialog-input-currency {
        @apply text-[1rem];
      }
    }

    .claim-btn {
      @apply w-full rounded-xl;
      background: $gradient01;
      color: #fff;
    }

    :deep(.q-field--outlined .q-field__control:after) {
      @apply max-h-[2.5rem];
      border-color: white;
    }
  }

  @include phone-width() {
    @apply min-w-[300px];
  }
}
</style>

<script setup lang="ts">
import InviteBonusHeader from "app/template/set_r016/pages/HomePage/InviteBonus/Components/Header.vue"
import InviteBonusBody from "app/template/set_r016/pages/HomePage/InviteBonus/Components/Body.vue"
import InviteBonusFooter from "app/template/set_r016/pages/HomePage/InviteBonus/Components/Footer.vue"

import { onMounted, reactive, ref, watch } from "vue"
import { useReferral } from "src/common/composables/useReferral"
import { useClaimGift } from "src/common/hooks/useClaimGift"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useBank } from "src/common/composables/useBank"
import { useQuasar } from "quasar"

import type * as Response from "src/api/response.type"
import type * as Request from "src/api/request.type"

import ChangeCurrency from "./Components/ChangeCurrency.vue"

const loading = ref(true)
const isClaimDialogOpen = ref(false)

const $q = useQuasar()
const { ClaimGift, getGiftsList, giftState } = useClaimGift()
const { currencyIdMap } = useBank()
const { activeWalletCurrencyId } = useUserInfo()
const { fetchReferralSignupOverview, referralSignupOverview } = useReferral()

type WalletDropItem = {
  label: string
  value: string
}

interface GiftData {
  gift_id: number
  amount: number
  currency: number
  max_amount: number
}

const giftData = ref<GiftData>({
  gift_id: 0,
  amount: 0,
  currency: 0,
  max_amount: 0
})

watch(activeWalletCurrencyId, async () => {
  giftData.value.currency = activeWalletCurrencyId.value

  $q.loading.show()
  await getGift()
  $q.loading.hide()
})

const openClaimDialog = async () => {
  isClaimDialogOpen.value = true
}

const getGift = async () => {
  giftData.value.gift_id = 0
  giftData.value.amount = 0
  giftData.value.max_amount = 0

  await getGiftsList()
  if (!giftState.value.list.length) return

  let currencyId = giftData.value.currency != 0 ? giftData.value.currency : activeWalletCurrencyId.value

  const preClaimGift: Response.Gift = giftState.value.list[0]
  const preClaimGiftOpt = preClaimGift.options.find((item) => item.currency_id === currencyId)

  if (!preClaimGiftOpt) return

  giftData.value.gift_id = preClaimGift.id
  giftData.value.amount = parseInt(preClaimGiftOpt.amount)
  giftData.value.max_amount = parseInt(preClaimGiftOpt.amount)
}

const onChangeCurrency = async (item: WalletDropItem) => {
  $q.loading.show()
  giftData.value.currency = parseInt(item.value)
  await getGift()
  $q.loading.hide()
}

const onClaim = async () => {
  if (giftData.value.amount <= 0) return

  $q.loading.show()
  const status = await ClaimGift(giftData.value)

  if (status) {
    $q.notify({
      type: "positive",
      message: $t("common.alarm.successfullyClaimed"),
      position: "top"
    })
  }

  await fetchReferralSignupOverview()
  await getGift()
  $q.loading.hide()
  isClaimDialogOpen.value = false
}

onMounted(async () => {
  $q.loading.show()
  await fetchReferralSignupOverview()
  await getGift()
  giftData.value.currency = activeWalletCurrencyId.value
  loading.value = false
  $q.loading.hide()
})
</script>
