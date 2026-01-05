<template>
  <div class="tab-pane" id="deposit">
    <q-form @submit="handleSubmit">
      <div class="top-short-wrap">
        <!-- 幣別 -->
        <div class="provider-menu--wrap">
          <div class="dep-label capitalize">{{ $t("member.deposit.selectCurrency") }}</div>
          <div class="currency-selection">
            <ul class="nav nav-tabs flex-wrap" id="myTab" role="tablist">
              <li
                v-for="(item, key) in depositState.supportedCurrency"
                :key="key"
                class="nav-item"
                @click="handleDepositCurrencyClick(item)"
              >
                <q-btn :class="{ active: `${item}` === depositState.form.currency }" class="nav-link hide-hover">
                  {{ $t(item) }}
                </q-btn>
              </li>
            </ul>
          </div>
        </div>
        <div class="tab-content mt-3">
          <div class="tab-pane fade show active" id="myr">
            <!-- 支付方式 -->
            <div class="payment-sel">
              <ul class="nav nav-tabs" role="tablist">
                <li
                  v-for="item in depositState.fundTypeList"
                  :key="item"
                  class="nav-item cursor-pointer"
                  role="presentation"
                  @click="handleDepositFundTypeClick(item)"
                >
                  <a
                    class="nav-link keychainify-checked block"
                    :class="{ active: item === `${depositState.usingFundType}` }"
                  >
                    {{ $t(`member.bank.${item}`) }}</a
                  >
                </li>
              </ul>
            </div>
            <div class="af-tab">
              <div class="tab-content">
                <div class="tab-pane active" id="bank-1" role="tabpanel">
                  <div class="dep-label pt-4 pb-2">{{ $t("member.deposit.paymentOptions") }}</div>
                  <!-- 支付渠道圖片 -->
                  <div class="af-sel af-tab-sel">
                    <div class="af-radio-tile-group">
                      <div v-for="(item, key) in depositState.usingPaymentInfoList" :key="key" class="input-container">
                        <div
                          class="radio-tile cursor-pointer"
                          :class="{ active: String(item.id) === `${depositState.form.payment_gateway_id}` }"
                          @click="handleDepositPaymentClick(item.id)"
                        >
                          <div class="icon">
                            <img :src="item.imgUrl" alt="payment-option" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!-- 銀行帳號 / 存款資料 -->
                  <div
                    class="af-row"
                    v-if="depositState.usingFundType === FUND_METHOD_TYPE.BackendKeysEnums.BankTransfer"
                  >
                    <label class="deposit-label"> {{ $t("member.deposit.bankAccount") }}* :</label>
                    <div class="cl-r">
                      <div class="af-bnk-account">
                        <div class="bank_details_copy">
                          {{ depositState.paymentDetail.bank_name }}
                          <i
                            class="far fa-file-alt ml-2 cursor-pointer"
                            @click="copyMessage(depositState.paymentDetail.bank_name)"
                          ></i>
                        </div>
                        <div class="bank_details_copy mt-1">
                          {{ depositState.paymentDetail.bank_account }}
                          <i
                            class="far fa-file-alt ml-2 cursor-pointer"
                            @click="copyMessage(depositState.paymentDetail.bank_account)"
                          ></i>
                        </div>
                        <div class="bank_details_copy mt-1">
                          <img
                            v-if="depositState.paymentDetail.qrcode_image_id !== 0"
                            :src="depositState.paymentDetail.imgUrl"
                            alt=""
                            class="w-20 h-20"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    class="af-row"
                    v-if="depositState.usingFundType === FUND_METHOD_TYPE.BackendKeysEnums.CryptoWallet"
                  >
                    <label class="deposit-label"> {{ $t("member.deposit.depositInfo") }}* :</label>
                    <div class="cl-r">
                      <div class="af-bnk-account">
                        <div class="bank_details_copy">
                          {{ depositState.paymentDetail.currency_brand }}
                          <i
                            class="far fa-file-alt ml-2 cursor-pointer"
                            @click="copyMessage(depositState.paymentDetail.currency_brand)"
                          ></i>
                        </div>
                        <div class="bank_details_copy mt-1">
                          {{ depositState.paymentDetail.chain }}
                          <i
                            class="far fa-file-alt ml-2 cursor-pointer"
                            @click="copyMessage(depositState.paymentDetail.chain)"
                          ></i>
                        </div>
                        <div class="bank_details_copy mt-1">
                          {{
                            depositState.paymentDetail.wallet_address.length > 15
                              ? depositState.paymentDetail.wallet_address.substring(0, 15) + "..."
                              : depositState.paymentDetail.wallet_address
                          }}
                          <i
                            class="far fa-file-alt ml-2 cursor-pointer"
                            @click="copyMessage(depositState.paymentDetail.wallet_address)"
                          ></i>
                        </div>
                        <div class="bank_details_copy mt-1">
                          <img
                            v-if="depositState.paymentDetail.qrcode_image_id !== 0"
                            :src="depositState.paymentDetail.imgUrl"
                            alt=""
                            class="w-20 h-20"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    class="af-row"
                    v-if="depositState.usingFundType === FUND_METHOD_TYPE.BackendKeysEnums.CryptoPayment"
                  >
                    <label class="deposit-label"> {{ $t("member.deposit.depositInfo") }}* :</label>
                    <div class="cl-r">
                      <div class="af-bnk-account">
                        <div class="bank_details_copy">
                          {{ depositState.paymentDetail.currency_brand }}
                          <i
                            class="far fa-file-alt ml-2 cursor-pointer"
                            @click="copyMessage(depositState.paymentDetail.currency_brand)"
                          ></i>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!-- 手續費 -->
                  <div
                    v-if="
                      hasFee(depositState.paymentDetail) &&
                      depositState.usingFundType === FUND_METHOD_TYPE.BackendKeysEnums.BankTransfer
                    "
                    class="af-row"
                  >
                    <label class="deposit-label"> {{ $t("member.deposit.handlingFee") }}: </label>
                    <span>
                      {{
                        depositState.paymentDetail.fee_type === FEE_TYPE.Enums.Amount
                          ? depositState.paymentDetail.fee_amount
                          : `${depositState.paymentDetail.fee_rate}%`
                      }}
                    </span>
                  </div>
                  <div class="af-row">
                    <label class="deposit-label"> {{ $t("member.deposit.depositAmount") }}*: </label>
                    <div class="cl-r">
                      <q-input
                        v-model.trim="depositState.form.amount"
                        class="form-control inputDeposit"
                        dense
                        borderless
                        :placeholder="minMaxText"
                        lazy-rules
                        @keypress="Rules.validatePositiveNumber"
                        inputmode="decimal"
                        :rules="[
                          Rules.requiredInt,
                          (val: string) =>
                            Rules.depositAmount({
                              min: depositState.paymentDetail.deposit_min,
                              max: depositState.paymentDetail.deposit_max,
                              val
                            })
                        ]"
                      />
                      <ul class="ml-2" v-show="depositState.paymentDetail.usdt_rate">
                        <li>
                          <span>{{ `${$t("member.withdrawal.rate")}: ` }}</span>
                          <span>{{ depositState.paymentDetail.usdt_rate }}</span>
                        </li>
                        <li>
                          <span>{{ `${$t("member.withdrawal.actualAmount")}: ` }}</span>
                          <span>{{ rateResult }}</span>
                        </li>
                      </ul>
                      <div class="af-min"><i class="fas fa-exclamation mr-2"></i>{{ minMaxText }}</div>
                      <div class="af-amt-wrap">
                        <button
                          v-for="item in depositState.quickBtns"
                          :key="item"
                          class="depositBtn"
                          type="button"
                          @click="handleDepositQuickBtnClick(item)"
                        >
                          {{ moneyFormat(item) }}
                        </button>
                      </div>
                    </div>
                  </div>
                  <!-- 額外欄位 -->
                  <div class="af-row" v-if="depositState.paymentDetail.extra_field_key">
                    <label class="deposit-label"> {{ $t("bank_column.client_Info") }}*: </label>
                    <div class="cl-r">
                      <div
                        class="mb-1"
                        v-for="(field, key) in depositState.paymentDetail.extra_field[
                          depositState.paymentDetail.extra_field_key
                        ]"
                        :key="key"
                      >
                        <!-- 文字輸入框 -->
                        <ExtraInput
                          v-if="field.type === FIELD_TYPE.Enums.Input"
                          v-model="depositState.form[depositState.paymentDetail.extra_field_key][field.field_name]"
                          :field="field"
                          class="form-control inputDeposit"
                        ></ExtraInput>

                        <!-- 下拉選單類型 -->
                        <ExtraSelect
                          v-else-if="field.type === FIELD_TYPE.Enums.Select"
                          v-model="depositState.form[depositState.paymentDetail.extra_field_key][field.field_name]"
                          :field="field"
                          class="pb-5 form-control inputDeposit"
                          popup-content-style="background-color: #081c4c; color: rgb(255, 255, 255);"
                        ></ExtraSelect>

                        <!-- 其他 -->
                        <ExtraInput
                          v-else
                          v-model="depositState.form[depositState.paymentDetail.extra_field_key][field.field_name]"
                          :field="field"
                          class="form-control inputDeposit"
                        ></ExtraInput>
                      </div>
                    </div>
                  </div>
                  <!-- 備註欄位 -->
                  <div
                    class="af-row"
                    v-if="depositState.paymentDetail.extra_remark && depositState.paymentDetail.extra_remark.length > 0"
                  >
                    <label class="deposit-label"> {{ $t("member.deposit.remark") }}*: </label>
                    <div class="cl-r">
                      <div v-for="(item, index) in depositState.paymentDetail.extra_remark" :key="index" class="mb-1">
                        <q-input
                          class="form-control inputDeposit"
                          outlined
                          dense
                          v-model="item.content"
                          :placeholder="item.titles.find((lang) => lang.lang === nowLang)?.title"
                        />
                      </div>
                    </div>
                  </div>
                  <!--活動-->
                  <div v-if="depositState.promotion_list.length" class="dep-label pt-4 pb-2">
                    {{ $t("member.deposit.depositReward") }}
                  </div>
                  <!-- 支付渠道圖片 -->
                  <div class="af-sel af-tab-sel depo-promotion">
                    <PromotionList
                      v-for="item in depositState.promotion_list"
                      :key="item.id"
                      :item="item"
                      :activeId="depositState.form.promotion_id"
                      @click="handlePromotionClick(item.id)"
                    ></PromotionList>
                  </div>
                  <div class="sub_btn_wrap">
                    <button class="btn-modal-sub" type="submit">{{ $t("common.btn.submit") }}</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </q-form>
  </div>
</template>

<script setup lang="ts">
import { useDebounceFn } from "@vueuse/core"
import ExtraInput from "src/common/components/ExtraInput/Index.vue"
import ExtraSelect from "src/common/components/ExtraInput/Select.vue"
import { useBank } from "src/common/composables/useBank"
import { useLanguage } from "src/common/composables/useLanguage"
import { useCommon } from "src/common/hooks/useCommon"
import { usePayment } from "src/common/hooks/usePayment"
import { useRule } from "src/common/hooks/useRule"
import { FEE_TYPE, FIELD_TYPE, FUND_METHOD_TYPE } from "src/common/utils/constants"
import { injectStrict } from "src/common/utils/injectTyped"
import { EventBusKey } from "src/symbols"
import { computed, onMounted, watch } from "vue"
import { useI18n } from "vue-i18n"
import PromotionList from "./components/PromotionList.vue"
import { useUserInfo } from "src/common/composables/useUserInfo"
const { nowLang } = useLanguage()

const { t } = useI18n()
const { copyMessage, moneyFormat, preciseMultiply } = useCommon()
const Rules = useRule()
const { activeWalletCurrencyCode } = useUserInfo()
const {
  depositState,
  getPromotionList,
  getDepositPaymentList,
  handleDepositCurrencyClick,
  handleDepositFundTypeClick,
  handleDepositPaymentClick,
  handleDepositQuickBtnClick,
  handlePromotionClick,
  handleDepositSubmit
} = useBank()
const eventbus = injectStrict(EventBusKey)
const { hasFee } = usePayment()

const rateResult = computed(
  () => `${preciseMultiply(Number(depositState.form.amount), Number(depositState.paymentDetail.usdt_rate))}`
)

const minMaxText = computed(
  () =>
    `${t("member.deposit.mixMaxLimit")}: ${moneyFormat(depositState.paymentDetail.deposit_min)} / ${moneyFormat(
      depositState.paymentDetail.deposit_max
    )}`
)

const handleSubmit = async () => {
  let { status } = await handleDepositSubmit()
  if (status) eventbus.emit("openOrder", true)
}

// 監聽 amount
const debounceFn = useDebounceFn(() => getPromotionList(), 500)
watch(
  () => depositState.form.amount,
  () => debounceFn()
)

// 監聽 activeWalletCurrencyCode 和 supportedCurrency，自動同步幣別選擇
watch(
  [() => activeWalletCurrencyCode.value, () => depositState.supportedCurrency],
  ([currencyCode, supportedCurrencies]) => {
    if (!supportedCurrencies || supportedCurrencies.length === 0) return

    // 檢查當前活躍錢包幣別是否在支持的幣別列表中
    if (currencyCode && supportedCurrencies.includes(currencyCode)) {
      // 如果支持該幣別且當前選擇的幣別不是該幣別，則切換
      if (depositState.form.currency !== currencyCode) {
        handleDepositCurrencyClick(currencyCode)
      }
    } else {
      // 如果不支持或沒有活躍幣別，選擇第一個
      if (supportedCurrencies[0] && depositState.form.currency !== supportedCurrencies[0]) {
        handleDepositCurrencyClick(supportedCurrencies[0])
      }
    }
  },
  { immediate: true }
)

onMounted(async () => {
  await getDepositPaymentList()
  await getPromotionList()
})
</script>

<style lang="scss" scoped>
@import "src/css/button.scss";
@import "app/template/set_royalslot88/assets/css/deposit.css";
@import "app/template/set_royalslot88/assets/css/form.scss";
@import "src/common/css/_variable.sass";

.form-remark {
  @apply text-black;
  @apply flex flex-col gap-4;
  width: 100%;
  @include phone-width {
    @apply w-full pl-0;
  }
  .form-remark-item {
    width: 100%;
    @apply flex items-center gap-2;
    @include phone-width {
      @apply flex-col items-start w-full;
    }
    .form-remark-title {
      color: #fff;
      min-width: 100px;
      width: 26%;
      @include phone-width {
        min-width: 250px;
      }
    }
    .form-remark-input {
      height: 40px;
      width: 100%;
      height: auto;
      background: #fff;
      border: 0.0625rem solid #dee3f026;
      border-radius: 0.5rem;
      @include phone-width {
        @apply w-full;
      }
    }
  }
}
</style>
