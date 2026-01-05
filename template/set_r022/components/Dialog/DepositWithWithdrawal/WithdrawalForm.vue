<template>
  <section class="withdraw-wrapper">
    <q-form @submit="handleSubmit">
      <div class="pay-area money-background">
        <div class="pay-area-title">{{ $t("tableHeader.currentBalance") }}</div>
        <div class="wallet-balance" v-if="inUseWallet">
          <span class="balance-label">{{ activeWalletLabel }}</span>
          <span class="balance-amount">{{ moneyFormat(inUseWallet[WALLET_TYPE.Enums.Cash].balance) }}</span>
          <span class="wallet-dropdown-icon" @click.stop.prevent="getBalance">
            <i :class="{ 'fas fa-sync-alt': !isSpinning, 'fas fa-sync-alt fa-spin': isSpinning }"></i>
          </span>
        </div>
      </div>

      <slot name="tab" />

      <!-- 幣別選擇 -->
      <div class="pay-area">
        <div class="pay-area-title">{{ $t("member.deposit.selectCurrency") }}</div>
        <div class="pay-btn-wrapper">
          <span
            v-for="(withdraw, key) in withdrawState.supportedCurrency"
            @click="handleWithdralCurrencyClick(withdraw)"
            :key="key"
            :class="{ active: `${withdraw}` === withdrawState.form.currency }"
            class="pay-btn"
          >
            <q-icon name="fas fa-coins" class="field-icon" />
            {{ $t(withdraw) }}
          </span>
        </div>
      </div>
      <!-- 支付類型選擇 -->
      <div class="pay-area" v-if="withdrawState.fundTypeList.length">
        <div class="pay-area-title">{{ $t("member.deposit.type") }}</div>
        <ul class="pay-btn-wrapper">
          <li
            v-for="fundType in withdrawState.fundTypeList"
            :key="fundType"
            :class="{ active: fundType === `${withdrawState.usingFundType}` }"
            class="pay-btn"
            @click="handleWithdralFundTypeClick(fundType)"
          >
            {{ $t(`member.bank.${fundType}`) }}
          </li>
        </ul>
      </div>
      <div v-if="withdrawState.usingPaymentInfoList.length > 0 && !withdrawState.gateWayHidden" class="pay-area">
        <div class="field-input flex flex-col">
          <span class="pay-area-title">{{ $t("modal.gateway") }}</span>
          <ul class="pay-btn-wrapper">
            <li
              v-for="(item, key) in withdrawState.usingPaymentInfoList"
              :key="key"
              class="pay-btn limit-height"
              :class="{ active: String(item.id) === `${withdrawState.form.payment_gateway_id}` }"
              @click="handleWithdralPaymentClick(item.type, item.id)"
            >
              <img class="h-full" :src="item.imgUrl" />
            </li>
          </ul>
        </div>
      </div>
      <!-- Bank Card List -->
      <div class="pay-area">
        <div class="card-container">
          <AddBankCard @click="openAddBankCard()" />
          <BankCard
            v-for="bankCard in withdrawState.bankCards"
            :key="bankCard.id"
            :card="bankCard"
            :activeId="withdrawState.form.bank_id"
            :bankList="bankList"
            :gatewayFilterList="gatewayFilterList"
            @edit="openAddBankCard(bankCard.id)"
            @updateList="getWithdrawBankCardList"
            @click="handleWithdralBankCardClick(bankCard.id, bankCard.crypto_rate)"
          />
        </div>
      </div>

      <div class="pay-area">
        <div class="field-input flex flex-col">
          <span class="form-title">{{ $t("member.withdrawal.withdrawalAmmount") }}</span>
          <q-input
            v-if="withdrawState.gateWayHidden"
            v-model.trim="withdrawState.form.amount"
            class="form-input"
            outlined
            :placeholder="`${$t('member.deposit.withdrawAmount')}`"
            lazy-rules
            @keypress="Rules.validatePositiveNumber"
            inputmode="decimal"
            :rules="[Rules.requiredInt]"
          >
          </q-input>
          <q-input
            v-else
            v-model.trim="withdrawState.form.amount"
            class="form-input"
            outlined
            :placeholder="`${$t('member.deposit.withdrawAmount')}`"
            lazy-rules
            :rules="[Rules.requiredInt]"
          >
          </q-input>
          <ul v-show="withdrawState.form.crypto_rate">
            <li>
              <span>{{ `${$t("member.withdrawal.rate")}: ` }}</span>
              <span>{{ withdrawState.form.crypto_rate ? withdrawState.form.crypto_rate : " -" }}</span>
            </li>
            <li>
              <span>{{ `${$t("member.withdrawal.receivePay")}: ` }}</span>
              <span>{{ Number(withdrawState.form.amount) * Number(withdrawState.form.crypto_rate) }}</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="pay-area">
        <div class="wrap">
          <table>
            <tr>
              <th>{{ $t("tableHeader.title") }}</th>
              <th>{{ $t("tableHeader.content") }}</th>
            </tr>
            <tr>
              <td>{{ $t("member.withdrawal.balance") }}</td>
              <td>{{ withdrawState.form.balance }}</td>
            </tr>
            <tr>
              <td>{{ $t("member.withdrawal.auditTurnover") }}</td>
              <td>{{ withdrawState.form.remaining_turnover }}</td>
            </tr>
          </table>
        </div>
      </div>
      <div v-if="needWithdrawalPassword" class="pay-area">
        <div class="form-title">{{ $t("member.withdrawal.withdrawPassword") }}</div>
        <div class="field-input flex flex-col pt-[10px]">
          <q-input
            v-model="withdrawState.form.withdrawal_password"
            class="form-input"
            outlined
            type="password"
            :placeholder="`${$t('member.withdrawal.withdrawPassword')}`"
            lazy-rules
            :rules="[Rules.requiredInt]"
          >
          </q-input>
        </div>
      </div>
      <div v-if="withdrawState.uploadConfig.uploadSwitch" class="pay-area">
        <div class="form-title label col-12">{{ $t("tableHeader.uploadDetail") }}</div>
        <div class="uploaded">
          <div class="item" v-for="(item, index) in withdrawState.uploadConfig.images" :key="index">
            <img @click="showBiggerImage(item.image.base64)" :src="item.image.base64" alt="" />
            <q-btn
              color="red"
              rounded
              dense
              icon="delete"
              class="delete-btn"
              size="sm"
              @click="handleWithdralUploadImageDelete(index)"
            ></q-btn>
          </div>
        </div>
        <div class="upload-area" @click="openUploader()">
          <q-icon name="add" size="32px"></q-icon>
          <div class="warning">
            {{ $t("member.deposit.depositDetailUploadWarning", { mb: maxSizeInMb }) }}
          </div>
        </div>
      </div>
      <div>
        <q-btn class="btn-submit" type="submit" :loading="isLoading" :disabled="!withdrawStatus">
          {{ $t("common.btn.submit") }}
        </q-btn>
      </div>
    </q-form>
  </section>
  <q-dialog v-model="imageDialogOpen">
    <q-card>
      <q-card-section class="flex justify-center">
        <img :src="previewImage" class="preview-image max-w-full max-h-[80vh]" />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { useBank } from "src/common/composables/useBank"
import { useAuth } from "src/common/hooks/useAuth"
import { useRule } from "src/common/hooks/useRule"
import { injectStrict } from "src/common/utils/injectTyped"
import { EventBusKey } from "src/symbols"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { onMounted, ref } from "vue"
import { useCommon } from "src/common/hooks/useCommon"
import AddBankCard from "../BankDetails/AddBankCard.vue"
import BankCard from "../BankDetails/BankCard.vue"
import { WALLET_TYPE } from "src/common/utils/constants"
import { useEnvInfoStore } from "src/stores/envStore"

const eventbus = injectStrict(EventBusKey)
const { moneyFormat, uploadImage } = useCommon()
const { accountInfo, inUseWallet, activeWalletLabel, getUserWalletList } = useUserInfo()
const { openUploader, uploadInit, maxSizeInMb } = uploadImage()

const imageDialogOpen = ref(false)
const previewImage = ref("")
const isSpinning = ref(false)

const showBiggerImage = (base64: string) => {
  imageDialogOpen.value = true
  previewImage.value = base64
}

const Rules = useRule()
const {
  handleWithdralUploadImageDelete,
  needWithdrawalPassword,
  withdrawState,
  bankList,
  gatewayFilterList,
  getBankList,
  getWithdrawBankCardList,
  getGatewayList,
  getWithdralPaymentList,
  handleWithdralCurrencyClick,
  handleWithdralFundTypeClick,
  handleWithdralBankCardClick,
  handleWithdralPaymentClick,
  handleWithdralSubmit,
  getPaymentTypeList
} = useBank()
const { isLoading } = useAuth()
const { envInfo } = useEnvInfoStore()

const withdrawStatus = ref(true)

const openAddBankCard = (id: number) => {
  eventbus.emit("openAddBankCard", true, id)
  eventbus.emit("openDepositWithWithdrawal", false)
}

const getBalance = () => {
  isSpinning.value = true
  setTimeout(() => {
    getUserWalletList()
    isSpinning.value = false
  }, 1000)
}

const handleSubmit = async () => {
  // 上傳圖片帶入Form
  withdrawState.form.images = withdrawState.uploadConfig.images.map((item) => item.image.base64)
  let { status } = await handleWithdralSubmit()
  if (status) {
    eventbus.emit("openDepositWithWithdrawal", false)
  }
}

onMounted(async () => {
  if (!accountInfo.value.approval_status && envInfo.withdraw_kyc_verify === 1) {
    withdrawStatus.value = false
  }

  uploadInit(withdrawState.uploadConfig.images, 5) // 上傳組件初始化config
  await getWithdralPaymentList()
  getBankList()
  getGatewayList()
  await getPaymentTypeList(withdrawState.form.currency)
})
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_r022/assets/css/_variable.scss";

// common
// 上傳組件
.preview-image {
  width: 50vw;
  height: auto;

  @include iphone-width {
    width: 100vw;
  }
}

.uploaded {
  @apply grid grid-cols-3 gap-4;

  .item {
    @apply relative border border-black/20 rounded overflow-hidden;
    width: 200px;
    height: 200px;

    img {
      @apply w-full;
    }

    .delete-btn {
      @apply p-2 absolute right-4 bottom-4;
    }
  }

  @include iphone-width {
    @apply grid grid-cols-1 gap-4;

    .item {
      width: 300px;
      height: auto;
      margin: 0 auto;
    }
  }
}

.upload-area {
  color: var(--secondary-01);
  border-color: var(--secondary-01);
  margin: 1rem 0;

  @apply aspect-video rounded flex flex-col gap-2 px-4 items-center justify-center cursor-pointer hover:bg-black/15 border-dashed border break-all;

  .warning {
    @apply text-sm;
  }
}

.wrap {
  overflow: hidden;

  // @include iphone-width {
  //   padding: 1rem;
  // }

  table {
    font-family: "Oswald", sans-serif;
    border-collapse: collapse;
    width: 100%;

    th {
      font-family: OpenSans;
      background: var(--primary-01) !important;
      border: 1px solid var(--primary-01);
      color: var(--text-01);
      width: 25vw;
      height: 50px;

      @include iphone-width {
        font-family: Helvetica;
        height: 8vw;
      }
    }

    td {
      font-family: OpenSans;
      background-color: transparent;
      border: 1px solid var(--primary-01) !important;
      color: var(--primary-01) !important;
      width: 25vw;
      height: 50px;
      text-align: center;
      transition: all 0.3s ease-in-out;

      @include iphone-width {
        font-family: Helvetica;
        height: 8vw;
      }
    }

    tr {
      border-bottom: 1px solid var(--primary-01);

      &:last-of-type {
        border-bottom: none;
      }

      // td {
      //   &:first-child {
      //     color: rgba($text-turquoise-blue-color, 0.6);
      //     transition: all 0.3s ease-in-out;
      //   }
      // }
    }
  }

  ::v-deep(.q-field__control) {
    border-radius: 0px;
  }
}

.form-input {
  :deep(.q-field__inner) {
    @apply w-full;
    min-height: 40px;
    height: 100%;
    background: var(--neutral-01);
    border-radius: 0.5rem;
    .q-field__control {
      height: 44px;
      border-radius: 8px;

      &::before {
        border-color: var(--neutral-03);
      }
    }
    .q-field__control-container {
      padding: 0;
    }
    .q-field__native {
      min-height: 44px;
      color: var(--neutral-10);

      &::placeholder {
        color: var(--primary-08);
      }
    }
    .q-field__label {
      min-height: 3.125rem;
    }
    .q-field__append {
      height: 3.125rem;
      line-height: 3.125rem;
    }
    &::after {
      height: 100%;
    }
  }
}

.card-container {
  color: var(--neutral-09);
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.25rem; // 等於 Tailwind 的 gap-5

  @include pc-width {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1.25rem;
  }

  @include iphone-width {
    grid-template-columns: repeat(1, minmax(0, 1fr));
    gap: 1.5rem; // 等於 Tailwind 的 gap-6
    width: 100%;
    height: auto;
    margin: 0 auto;
    padding: 0;

    @include hideScrollBar;
  }
}

.pay-area {
  @apply p-4 rounded-[.625rem];
  margin-bottom: 0.9375rem;
  background: var(--neutral-01);

  @include pad-large-width {
    border-radius: 0;
  }

  &.money-background {
    border-radius: 12px;
    background: linear-gradient(0deg, var(--neutral-01, #143241) 39.9%, var(--neutral-03, #215a78) 100%);

    @include pad-large-width {
      margin: 1rem;
    }
  }

  .pay-area-title {
    @apply font-semibold pb-3;
    color: var(--secondary-01);
    font-family: "Segoe UI";
    font-size: 14px;
    font-style: normal;
    font-weight: 600;
    line-height: 22px; /* 157.143% */
  }

  .wallet-balance {
    .balance-label {
      color: var(--secondary-01);
      font-family: OpenSans;
      font-size: 20px;
      font-style: normal;
      font-weight: 600;
      line-height: 22px;
    }
    .balance-amount {
      margin: 0 1rem;
      color: var(--primary-01, #2d7eff);
      font-family: OpenSans;
      font-size: 20px;
      font-weight: 600;
      line-height: 22px; /* 157.15% */
    }
    .wallet-dropdown-icon {
      cursor: pointer;
    }
  }

  .pay-btn-wrapper {
    @apply grid justify-between gap-3;
    grid-template-columns: repeat(3, 1fr);

    @include iphone-width {
      @apply grid-cols-2;
    }
  }

  .pay-btn {
    @apply flex items-center justify-center text-[.875rem] cursor-pointer rounded-[.625rem] p-[.625rem];
    border-radius: 9.51px;
    border: 0.951px solid var(--neutral-07);
    background: var(--neutral-01);
    color: var(--secondary-01);

    &.limit-height {
      width: auto;
      height: 90px;
      padding: 0 !important;
    }

    &:hover {
      border: 0.951px solid var(--primary-01);
    }

    &.active {
      border: 0.951px solid var(--primary-01);
      background: var(--primary-04);
    }
    .field-icon {
      color: var(--secondary-01);
      text-align: center;
      font-family: "Font Awesome 5 Free";
      font-size: 1.6rem;
      margin-right: 0.6875rem;
      font-style: normal;
      font-weight: 900;
      line-height: 26.095px; /* 100.146% */
    }

    @include iphone-width {
      @apply text-sm;
    }
  }
}

// .balance-wrapper {
//   ::v-deep(.q-field--disabled) {
//     opacity: 0.6;
//   }
// }

.form-title {
  padding-bottom: 0.75rem;
  color: var(--secondary-01);
  font-family: "Segoe UI";
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: 22px;
}

.withdraw-wrapper {
  @include pad-large-width {
    padding-bottom: 30vh;
  }

  .card-layout {
    @apply grid gap-[.625rem];
    grid-template-columns: repeat(2, 1fr);

    @include pad-large-width {
      @apply flex flex-col gap-[.625rem];
    }
  }

  .btn-submit {
    @apply w-full mb-0;
    height: 2.75rem;
    margin-bottom: 3.75rem;
    border-radius: 8px;
    background: var(--primary-09);
    display: flex;
    justify-content: center;
    color: var(--text-01);

    @include pad-large-width {
      margin: 0 auto;
      width: 82vw;
    }
  }
}

.form-methods {
  @apply grid gap-[.1875rem];
  grid-template-columns: repeat(3, 1fr);

  .method-item {
    @apply flex flex-col items-center justify-center p-[.625rem] relative;
    @apply cursor-pointer text-black;
    // background: $pink-shadow-color;
    border-radius: 0.25rem;
    border-color: #becaec;
    transition: all 0.3s ease;

    img {
      @apply w-[6.75rem] h-[1.875rem];
    }

    span {
      margin-top: 0.125rem;
      font-size: 0.75rem;
    }

    &.active {
      &::after {
        @apply absolute right-[1px] bottom-[1px] w-[25px] h-[25px];
        content: "";
        background: url("../../../assets/images/svg/checked.svg");
        background-repeat: no-repeat;
        background-size: contain;
      }

      span {
        @apply font-bold;
        color: #fff;
      }
    }
  }
}
</style>
