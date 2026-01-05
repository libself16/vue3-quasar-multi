<template>
  <ModalBase v-model="modalShow" modal-class="modal_share_custom" use-title :title="$t('member.bank.addBank')">
    <q-form @submit="submitForm()">
      <div class="provider-menu-wrap2">
        <!-- 幣別 -->
        <div class="provider-menu--wrap">
          <div class="af-swp-ttl">{{ $t("member.bank.selectCurrency") }}</div>
          <div class="currency-selection">
            <ul class="nav nav-tabs flex-wrap" id="myTab" role="tablist">
              <li
                v-for="item in availCurrencyList"
                :key="item.id"
                class="nav-item"
                @click="handleBankCardCurrencyClick(item.code)"
              >
                <q-btn :class="{ active: `${item.code}` === bankCardState.form.currency }" class="nav-link hide-hover">
                  {{ $t(item.code) }}
                </q-btn>
              </li>
            </ul>
          </div>
        </div>

        <div class="tab-content" id="v-pills-tabContent">
          <div class="tab-pane fade active show" id="myr2" role="tabpanel" aria-labelledby="tab">
            <div class="af-in-box">
              <div class="af-in-content-box">
                <!-- 支付方式 -->
                <div class="payment-sel">
                  <ul class="nav nav-tabs" role="tablist">
                    <li
                      v-for="item in paymentTypeList"
                      :key="item.value"
                      class="nav-item cursor-pointer"
                      role="presentation"
                      @click="handleBankCardPaymentTypeClick(item.value)"
                    >
                      <a
                        class="nav-link keychainify-checked block"
                        :class="{ active: String(item.value) === `${bankCardState.form.payment_type_id}` }"
                      >
                        {{ $t(item.label) }}
                      </a>
                    </li>
                  </ul>
                </div>
                <div class="af-tab">
                  <div class="tab-content">
                    <div class="tab-pane active" id="popbank-1" role="tabpanel">
                      <div class="af-tab-in-content">
                        <div class="af-tab-in-content col-row">
                          <!-- gateway id -->
                          <template v-if="showGateway(bankCardState.form.payment_type_id)">
                            <div class="af-row">
                              <label class="deposit-label">{{ $t("modal.gateway") }}</label>
                              <div class="cl-r">
                                <q-select
                                  v-model="bankCardState.form.payment_gateway_id"
                                  :options="paymentGatewayList"
                                  emit-value
                                  map-options
                                  bg-color="transparent"
                                  color="white"
                                  options-dark
                                  outlined
                                  lazy-rules
                                  :rules="[Rules.requiredInt]"
                                  class="form-control inputDeposit p-0"
                                />
                              </div>
                            </div>
                          </template>

                          <!-- BankTransfer -->
                          <template v-if="bankCardState.form.payment_type_id === FUND_METHOD_TYPE.Enums.BankTransfer">
                            <!-- bank_name -->
                            <div class="af-row">
                              <label class="deposit-label">{{ $t("member.bank.withdrawalBank") }}</label>
                              <div class="cl-r">
                                <q-input
                                  v-model="bankCardState.form.bank_name"
                                  class="form-control inputDeposit"
                                  dense
                                  borderless
                                  :placeholder="$t('member.bank.withdrawalBank')"
                                  lazy-rules
                                  :rules="[Rules.required()]"
                                />
                              </div>
                            </div>
                            <!-- name -->
                            <div class="af-row">
                              <label class="deposit-label">{{ $t("member.bank.name") }}</label>
                              <div class="cl-r">
                                <q-input
                                  v-model="bankCardState.form.name"
                                  class="form-control inputDeposit"
                                  dense
                                  borderless
                                  :placeholder="$t('member.bank.name')"
                                  lazy-rules
                                  :rules="[Rules.required()]"
                                />
                              </div>
                            </div>
                            <!-- accountName -->
                            <div class="af-row">
                              <label class="deposit-label">{{ $t("member.bank.accountName") }}</label>
                              <div class="cl-r">
                                <q-input
                                  v-model="bankCardState.form.account_name"
                                  class="form-control inputDeposit"
                                  dense
                                  borderless
                                  :placeholder="$t('member.bank.accountName')"
                                  lazy-rules
                                  :rules="[Rules.required()]"
                                />
                              </div>
                            </div>
                            <!-- accountNumber -->
                            <div class="af-row">
                              <label class="deposit-label">{{ $t("member.bank.accountNumber") }}</label>
                              <div class="cl-r">
                                <q-input
                                  v-model="bankCardState.form.account_number"
                                  class="form-control inputDeposit"
                                  dense
                                  borderless
                                  :placeholder="$t('member.bank.accountNumber')"
                                  lazy-rules
                                  :rules="[Rules.required()]"
                                  @update:model-value="validateAlphanumeric"
                                />
                              </div>
                            </div>
                          </template>

                          <!-- EWallet -->
                          <template v-if="bankCardState.form.payment_type_id === FUND_METHOD_TYPE.Enums.EWallet">
                            <!-- bank id -->
                            <div class="af-row">
                              <label class="deposit-label">{{ $t("member.bank.withdrawalBank") }}</label>
                              <div class="cl-r">
                                <q-select
                                  v-model="bankCardState.form.bank_id"
                                  :options="bankList"
                                  :disable="!bankCardState.form.payment_gateway_id"
                                  emit-value
                                  map-options
                                  bg-color="transparent"
                                  color="white"
                                  options-dark
                                  outlined
                                  lazy-rules
                                  :rules="[Rules.requiredInt]"
                                  class="form-control inputDeposit p-0"
                                />
                              </div>
                            </div>
                            <!-- name -->
                            <div class="af-row">
                              <label class="deposit-label">{{ $t("member.bank.name") }}</label>
                              <div class="cl-r">
                                <q-input
                                  v-model="bankCardState.form.name"
                                  class="form-control inputDeposit"
                                  dense
                                  borderless
                                  :placeholder="$t('member.bank.name')"
                                  lazy-rules
                                  :rules="[Rules.required()]"
                                />
                              </div>
                            </div>
                            <!-- accountName -->
                            <div class="af-row">
                              <label class="deposit-label">{{ $t("member.bank.accountName") }}</label>
                              <div class="cl-r">
                                <q-input
                                  v-model="bankCardState.form.account_name"
                                  class="form-control inputDeposit"
                                  dense
                                  borderless
                                  :placeholder="$t('member.bank.accountName')"
                                  lazy-rules
                                  :rules="[Rules.required()]"
                                />
                              </div>
                            </div>
                            <!-- accountNumber -->
                            <div class="af-row">
                              <label class="deposit-label">{{ $t("member.bank.accountNumber") }}</label>
                              <div class="cl-r">
                                <q-input
                                  v-model="bankCardState.form.account_number"
                                  class="form-control inputDeposit"
                                  dense
                                  borderless
                                  :placeholder="$t('member.bank.accountNumber')"
                                  lazy-rules
                                  :rules="[Rules.required()]"
                                  @update:model-value="validateAlphanumeric"
                                />
                              </div>
                            </div>
                          </template>

                          <!-- CryptoWallet -->
                          <template v-if="bankCardState.form.payment_type_id === FUND_METHOD_TYPE.Enums.CryptoWallet">
                            <!-- name -->
                            <div class="af-row">
                              <label class="deposit-label">{{ $t("member.bank.name") }}</label>
                              <div class="cl-r">
                                <q-input
                                  v-model="bankCardState.form.name"
                                  class="form-control inputDeposit"
                                  dense
                                  borderless
                                  :placeholder="$t('member.bank.name')"
                                  lazy-rules
                                  :rules="[Rules.required()]"
                                />
                              </div>
                            </div>
                            <!-- currencyBrand -->
                            <div class="af-row">
                              <label class="deposit-label">{{ $t("member.deposit.currencyBrand") }}</label>
                              <div class="cl-r">
                                <q-select
                                  v-model="bankCardState.form.crypto_id"
                                  :options="cryptoList"
                                  emit-value
                                  map-options
                                  bg-color="transparent"
                                  color="white"
                                  options-dark
                                  outlined
                                  lazy-rules
                                  :rules="[Rules.requiredInt]"
                                  class="form-control inputDeposit p-0"
                                />
                              </div>
                            </div>
                            <!-- chain -->
                            <div class="af-row">
                              <label class="deposit-label">{{ $t("member.deposit.chain") }}</label>
                              <div class="cl-r">
                                <q-select
                                  v-model="bankCardState.form.bank_id"
                                  :options="bankList"
                                  emit-value
                                  map-options
                                  bg-color="transparent"
                                  color="white"
                                  options-dark
                                  outlined
                                  lazy-rules
                                  :rules="[Rules.requiredInt]"
                                  class="form-control inputDeposit p-0"
                                />
                              </div>
                            </div>
                            <!-- walletAddress -->
                            <div class="af-row">
                              <label class="deposit-label">{{ $t("member.deposit.walletAddress") }}</label>
                              <div class="cl-r">
                                <q-input
                                  v-model="bankCardState.form.wallet_address"
                                  class="form-control inputDeposit"
                                  dense
                                  borderless
                                  :placeholder="$t('member.deposit.walletAddress')"
                                  lazy-rules
                                  :rules="[Rules.required()]"
                                />
                              </div>
                            </div>
                          </template>

                          <!-- CryptoPayment -->
                          <template v-if="bankCardState.form.payment_type_id === FUND_METHOD_TYPE.Enums.CryptoPayment">
                            <!-- name -->
                            <div class="af-row">
                              <label class="deposit-label">{{ $t("member.bank.name") }}</label>
                              <div class="cl-r">
                                <q-input
                                  v-model="bankCardState.form.name"
                                  class="form-control inputDeposit"
                                  dense
                                  borderless
                                  :placeholder="$t('member.bank.name')"
                                  lazy-rules
                                  :rules="[Rules.required()]"
                                />
                              </div>
                            </div>
                            <!-- currencyBrand -->
                            <div class="af-row">
                              <label class="deposit-label">{{ $t("member.deposit.currencyBrand") }}</label>
                              <div class="cl-r">
                                <q-select
                                  v-model="bankCardState.form.crypto_id"
                                  :options="cryptoList"
                                  emit-value
                                  map-options
                                  bg-color="transparent"
                                  color="white"
                                  options-dark
                                  outlined
                                  lazy-rules
                                  :rules="[Rules.requiredInt]"
                                  class="form-control inputDeposit p-0"
                                />
                              </div>
                            </div>
                            <!-- chain -->
                            <div class="af-row">
                              <label class="deposit-label">{{ $t("member.deposit.chain") }}</label>
                              <div class="cl-r">
                                <q-select
                                  v-model="bankCardState.form.bank_id"
                                  :options="bankList"
                                  :disable="!bankCardState.form.payment_gateway_id"
                                  emit-value
                                  map-options
                                  bg-color="transparent"
                                  color="white"
                                  options-dark
                                  outlined
                                  lazy-rules
                                  :rules="[Rules.requiredInt]"
                                  class="form-control inputDeposit p-0"
                                />
                              </div>
                            </div>
                            <!-- walletAddress -->
                            <div class="af-row">
                              <label class="deposit-label">{{ $t("member.deposit.walletAddress") }}</label>
                              <div class="cl-r">
                                <q-input
                                  v-model="bankCardState.form.wallet_address"
                                  class="form-control inputDeposit"
                                  dense
                                  borderless
                                  :placeholder="$t('member.deposit.walletAddress')"
                                  lazy-rules
                                  :rules="[Rules.required()]"
                                />
                              </div>
                            </div>
                          </template>

                          <div class="af-btn">
                            <button class="cancel_btn" @click="modalShow = false">{{ $t("common.btn.cancel") }}</button>
                            <button class="submit_btn" type="submit">{{ $t("common.btn.submit") }}</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </q-form>
  </ModalBase>
</template>

<script setup lang="ts">
import { useBank } from "src/common/composables/useBank"
import { useRule } from "src/common/hooks/useRule"
import { FUND_METHOD_TYPE } from "src/common/utils/constants"
import { injectStrict } from "src/common/utils/injectTyped"
import { EventBusKey } from "src/symbols"
import { onMounted, ref, watch } from "vue"

import ModalBase from "./modalBase.vue"

const Rules = useRule()
const {
  showGateway,
  availCurrencyList,
  getAvailCurrencyList,
  bankCardState,
  validateAlphanumeric,
  getBankCardInfo,
  getBankCardList,
  getPaymentTypeList,
  paymentGatewayList,
  paymentTypeList,
  currencyList,
  handleBankCardCurrencyClick,
  handleBankCardPaymentTypeClick,
  bankList,
  getBankList,
  cryptoList,
  getCryptoList,
  getGatewayList,
  handleBankCardEdit,
  handleBankCardAdd,
  resetBankCardForm
} = useBank()

const eventbus = injectStrict(EventBusKey)
const modalShow = ref(false)
const editBankCardId = ref(0)

const submitForm = async () => {
  const submitFunc = editBankCardId.value ? handleBankCardEdit : handleBankCardAdd
  const isSuccess = await submitFunc()
  if (isSuccess) {
    await getBankCardList()
    modalShow.value = false
    resetBankCardForm()
    eventbus.emit("updateWithdrawBankCardList")
    eventbus.emit("updateBankCardList")
  }
}

watch(
  () => bankCardState.form.payment_gateway_id,
  async (gatewayId) => {
    await getBankList(gatewayId)
  }
)

onMounted(() => {
  eventbus.on("openAddBankCard", async (show: boolean, bankCardId?: number) => {
    modalShow.value = show
    editBankCardId.value = bankCardId ? bankCardId : 0

    if (show) {
      getCryptoList()
      getGatewayList()
      await getAvailCurrencyList()

      // 编辑模式：先获取银行卡信息（包含正确的币别），再获取支付类型列表
      if (bankCardId) {
        await getBankCardInfo({ id: editBankCardId.value })
        await getPaymentTypeList(bankCardState.form.currency) // 使用从后端获取的正确币别
        // 编辑模式不需要重置表单，因为要保留获取到的数据
      } else {
        // 新增模式：先重置表单，再获取支付类型列表，最后设置默认值
        resetBankCardForm()
        await getPaymentTypeList(bankCardState.form.currency)
        // 设置默认的支付类型，这会自动设置 payment_gateway_id
        if (paymentTypeList.value.length > 0) {
          handleBankCardPaymentTypeClick(paymentTypeList.value[0].value)
        }
      }

      // 根据 payment_gateway_id 获取银行列表（如果有的话）
      if (bankCardState.form.payment_gateway_id) {
        await getBankList(bankCardState.form.payment_gateway_id)
      }
    }
  })
})
</script>

<style scoped lang="scss">
@import "src/css/button.scss";
@import "app/template/set_royalslot88/assets/css/deposit.css";
@import "app/template/set_royalslot88/assets/css/withdrawal.css";
@import "app/template/set_royalslot88/assets/css/bank.css";
@import "app/template/set_royalslot88/assets/css/form.scss";
</style>
