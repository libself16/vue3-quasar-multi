<template>
  <div class="tab-pane" id="withdraw">
    <q-form @submit="handleWithdralSubmit" autocomplete="new-password">
      <div class="top-short-wrap">
        <!-- 幣別 -->
        <div class="provider-menu--wrap">
          <div class="dep-label capitalize">{{ $t("member.deposit.selectCurrency") }}</div>
          <div class="currency-selection">
            <ul class="nav nav-tabs flex-wrap" id="myTab" role="tablist">
              <li
                v-for="item in withdrawState.supportedCurrency"
                :key="item"
                class="nav-item"
                @click="handleWithdralCurrencyClick(item)"
              >
                <q-btn :class="{ active: withdrawState.form.currency === item }" class="nav-link hide-hover">
                  {{ $t(item) }}
                </q-btn>
              </li>
            </ul>
          </div>
        </div>
        <div class="tab-content mt-3">
          <div class="tab-pane fade show active" id="myr1" role="tabpanel" aria-labelledby="myr-tab">
            <!-- 支付方式 -->
            <div class="payment-sel">
              <ul class="nav nav-tabs" role="tablist">
                <li
                  v-for="item in withdrawState.fundTypeList"
                  :key="item"
                  class="nav-item cursor-pointer"
                  role="presentation"
                  @click="handleWithdralFundTypeClick(item)"
                >
                  <a
                    class="nav-link keychainify-checked block"
                    :class="{ active: withdrawState.usingFundType === item }"
                  >
                    {{ $t(`member.bank.${item}`) }}
                  </a>
                </li>
              </ul>
            </div>
            <div class="af-tab">
              <div class="tab-content">
                <div class="tab-pane active" id="bank-1" role="tabpanel">
                  <div class="af-tab-in-content">
                    <!-- 支付渠道 -->
                    <div v-if="!withdrawState.gateWayHidden" class="af-row-wd">
                      <label class="cl-l af-txt-blu inline-block mb-2">
                        {{ $t("member.bank.withdrawalChannel") }}:
                      </label>
                      <div class="cl-r">
                        <div class="af-sel">
                          <div class="af-radio-tile-group">
                            <div
                              v-for="(item, key) in withdrawState.usingPaymentInfoList"
                              :key="key"
                              class="input-container"
                            >
                              <div
                                class="radio-tile cursor-pointer"
                                :class="{ active: String(item.id) === `${withdrawState.form.payment_gateway_id}` }"
                                @click="handleWithdralPaymentClick(item.type, item.id)"
                              >
                                <div class="icon"><img :src="item.imgUrl" alt="withdrawal-channel" /></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="af-bnk-wrap">
                      <BankCard
                        v-for="item in withdrawState.bankCards"
                        :key="item.id"
                        :card="item"
                        :activeId="withdrawState.form.bank_id"
                        :bankList="bankList"
                        :gatewayFilterList="gatewayFilterList"
                        @click="handleWithdralBankCardClick(item.id)"
                        @updateList="getWithdrawBankCardList"
                      />
                      <AddBankCard />
                    </div>
                  </div>
                  <div class="af-in-content af-in-content-btm">
                    <div class="af-in-content-all">
                      <div class="af-tab-in-content col-row">
                        <div class="af-row">
                          <label class="deposit-label">{{ $t("member.withdrawal.withdrawalAmmount") }}</label>
                          <div class="cl-r">
                            <q-input
                              v-if="withdrawState.gateWayHidden"
                              v-model="withdrawState.form.amount"
                              class="form-control inputDeposit withdrawal-amount"
                              dense
                              borderless
                              :placeholder="`${$t('member.deposit.withdrawAmount')}`"
                              lazy-rules
                              @keypress="Rules.validatePositiveNumber"
                              inputmode="decimal"
                              :rules="[Rules.required()]"
                              autocomplete="new-password"
                            />
                            <q-input
                              v-else
                              v-model="withdrawState.form.amount"
                              class="form-control inputDeposit withdrawal-amount"
                              dense
                              borderless
                              :placeholder="`${$t('member.deposit.withdrawAmount')}`"
                              lazy-rules
                              :rules="[Rules.requiredInt]"
                              autocomplete="new-password"
                            />
                          </div>
                        </div>
                        <div v-if="needWithdrawalPassword" class="af-row">
                          <label class="deposit-label">{{ $t("member.withdrawal.withdrawPassword") }}</label>
                          <div class="cl-r">
                            <q-input
                              v-model="withdrawState.form.withdrawal_password"
                              class="form-control inputDeposit"
                              dense
                              borderless
                              type="password"
                              autocomplete="new-password"
                              :rules="[Rules.required()]"
                              lazy-rules
                              :placeholder="`${$t('member.withdrawal.withdrawPassword')}`"
                            />
                          </div>
                        </div>
                        <div class="af-row">
                          <label class="deposit-label">{{ $t("member.withdrawal.withdrawalDetail") }}</label>
                          <div class="cl-r">
                            <table class="af-table">
                              <tbody>
                                <tr>
                                  <th>
                                    <strong>{{ $t("member.withdrawal.item") }}</strong>
                                  </th>
                                  <th>
                                    <strong>{{ $t("member.withdrawal.amount") }}</strong>
                                  </th>
                                </tr>
                                <tr>
                                  <td class="capitalize">{{ $t("member.deposit.withdrawAmount") }}</td>
                                  <td>{{ moneyFormat(withdrawState.form.amount) }}</td>
                                </tr>
                                <tr>
                                  <td>{{ $t("member.withdrawal.balance") }}</td>
                                  <td>{{ moneyFormat(withdrawState.form.balance) }}</td>
                                </tr>
                                <tr>
                                  <td>{{ $t("member.withdrawal.auditTurnover") }}</td>
                                  <td>{{ moneyFormat(withdrawState.form.remaining_turnover) }}</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>

                        <!-- 渠道動態欄位 -->
                        <div class="af-row" v-if="withdrawState.paymentDetail.extra_field_key">
                          <label class="deposit-label">{{ $t("bank_column.client_Info") }}</label>
                          <div class="cl-r">
                            <template
                              v-for="(field, key) in withdrawState.paymentDetail.extra_field[
                                withdrawState.paymentDetail.extra_field_key
                              ]"
                              :key="key"
                            >
                              <!-- 文字輸入框 -->
                              <ExtraInput
                                v-if="field.type === FIELD_TYPE.Enums.Input"
                                v-model="
                                  withdrawState.form[withdrawState.paymentDetail.extra_field_key][field.field_name]
                                "
                                :field="field"
                                class="form-control inputDeposit withdrawal-amount"
                              ></ExtraInput>

                              <!-- 下拉選單類型 -->
                              <ExtraSelect
                                v-else-if="field.type === FIELD_TYPE.Enums.Select"
                                v-model="
                                  withdrawState.form[withdrawState.paymentDetail.extra_field_key][field.field_name]
                                "
                                :field="field"
                                optionStyle="option-style"
                                class="form-control inputDeposit pb-5 withdrawal-amount"
                                popup-content-style="background-color: #081c4c; color: rgb(255, 255, 255);"
                              ></ExtraSelect>

                              <!-- 其他 -->
                              <ExtraInput
                                v-else
                                v-model="
                                  withdrawState.form[withdrawState.paymentDetail.extra_field_key][field.field_name]
                                "
                                :field="field"
                                class="form-control inputDeposit withdrawal-amount"
                              ></ExtraInput>
                            </template>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="sub_btn_wrap">
                    <button class="btn-modal-sub" type="submit">
                      {{ $t("common.btn.submit") }}
                    </button>
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
import { onMounted, watch } from "vue"
import { useBank } from "src/common/composables/useBank"
import { useRule } from "src/common/hooks/useRule"
import { FIELD_TYPE } from "src/common/utils/constants"
import { injectStrict } from "src/common/utils/injectTyped"
import { EventBusKey } from "src/symbols"
import { useCommon } from "src/common/hooks/useCommon"
import BankCard from "../../BankCard/Index.vue"
import AddBankCard from "../../BankCard/Add.vue"
import ExtraInput from "src/common/components/ExtraInput/Index.vue"
import ExtraSelect from "src/common/components/ExtraInput/Select.vue"
import { useUserInfo } from "src/common/composables/useUserInfo"

const Rules = useRule()
const eventbus = injectStrict(EventBusKey)
const { moneyFormat } = useCommon()
const { activeWalletCurrencyCode } = useUserInfo()

const {
  withdrawState,
  getBankCardList,
  getWithdralPaymentList,
  handleWithdralCurrencyClick,
  handleWithdralFundTypeClick,
  handleWithdralPaymentClick,
  handleWithdralBankCardClick,
  handleWithdralSubmit: originalHandleWithdralSubmit,
  needWithdrawalPassword,
  checkWithdrawalPassword,
  getWithdrawBankCardList,
  bankList,
  gatewayFilterList,
  getGatewayList,
  getBankList
} = useBank()

const handleWithdralSubmit = async () => {
  const res = await originalHandleWithdralSubmit()
  if (res) {
    withdrawState.form.amount = ""
    withdrawState.form.withdrawal_password = ""
  }
}

const checkWithdrawalPasswordCallback = () => {
  eventbus.emit("openSetWithdrawalPassword", true)
  eventbus.emit("openWithdraw", false)
}
onMounted(async () => {
  checkWithdrawalPassword({ cb: checkWithdrawalPasswordCallback })
  await getWithdralPaymentList()
  await getBankCardList()
  await getGatewayList()
  await getBankList()
  eventbus.on("updateWithdrawBankCardList", getWithdrawBankCardList)
})

// 監聽 activeWalletCurrencyCode 和 supportedCurrency，自動同步幣別選擇
watch(
  [() => activeWalletCurrencyCode.value, () => withdrawState.supportedCurrency],
  ([currencyCode, supportedCurrencies]) => {
    if (!supportedCurrencies || supportedCurrencies.length === 0) return

    // 檢查當前活躍錢包幣別是否在支持的幣別列表中
    if (currencyCode && supportedCurrencies.includes(currencyCode)) {
      // 如果支持該幣別且當前選擇的幣別不是該幣別，則切換
      if (withdrawState.form.currency !== currencyCode) {
        handleWithdralCurrencyClick(currencyCode)
      }
    } else {
      // 如果不支持或沒有活躍幣別，選擇第一個
      if (supportedCurrencies[0] && withdrawState.form.currency !== supportedCurrencies[0]) {
        handleWithdralCurrencyClick(supportedCurrencies[0])
      }
    }
  },
  { immediate: true }
)
</script>

<style lang="scss" scoped>
@import "src/css/button.scss";
@import "app/template/set_royalslot88/assets/css/deposit.css";
@import "app/template/set_royalslot88/assets/css/withdrawal.css";
@import "app/template/set_royalslot88/assets/css/form.scss";

.withdrawal-amount {
  margin-bottom: 0 !important;
}
</style>
