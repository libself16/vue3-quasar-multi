<template>
  <HeaderTitleBack v-if="$q.platform.is.mobile" :titleI18n="bankCardId ? 'common.btn.edit' : 'common.btn.add'">
    <q-form class="bank-add-layout h5" :class="{ '!pb-[24rem]': isTelegramMiniApp }" @submit="handleSubmit">
      <div class="withdraw-container">
        <!-- currency -->
        <div class="info-row">
          <div class="info-title mt-5 col-12">{{ $t("member.deposit.selectCurrency") }}</div>
          <div class="info-content currency flex-row col-12 my-5 col-sm-10">
            <q-btn
              color="primary"
              icon="fas fa-coins"
              :label="$t(formatterCurrency(item.code) as string)"
              :class="{ active: bankCardState.form.currency === item.code }"
              v-for="item in availCurrencyList"
              :key="item.code"
              @click="handleBankCardCurrencyClick(item.code)"
            >
              <div class="triangle">
                <i class="fas fa-check inner-icon"></i>
              </div>
            </q-btn>
          </div>
        </div>
      </div>
      <div class="withdraw-container">
        <!-- type -->
        <div class="info-row">
          <div class="info-title mt-5 col-12">{{ $t("member.withdrawal.type") }}</div>
          <div class="info-content currency flex-row col-12 my-5 col-sm-10">
            <q-btn
              color="primary"
              :label="$t(item.label as string)"
              :class="{ active: bankCardState.form.payment_type_id === +item.value }"
              v-for="item in paymentTypeList"
              :key="item.value"
              @click="handleBankCardPaymentTypeClick(item.value)"
            >
              <div class="triangle">
                <i class="fas fa-check inner-icon"></i>
              </div>
            </q-btn>
          </div>
        </div>
      </div>
      <div class="withdraw-container" v-if="showGateway(bankCardState.form.payment_type_id)">
        <!-- gateway id -->
        <div class="info-row">
          <div class="info-title mt-5 col-12">{{ $t("member.withdrawal.selectMethod") }}</div>
          <div class="radio-content col-12 q-mb-md radio-content-type">
            <q-radio
              v-for="item in paymentGatewayList"
              :key="item.value"
              dense
              color="primary"
              class="my-1"
              v-model="bankCardState.form.payment_gateway_id"
              :val="item.value"
              :label="$t(item.label)"
              checked-icon="circle"
            />
          </div>
        </div>
      </div>
      <!-- 底下的Type特定欄位 -->
      <div class="withdraw-container">
        <template v-if="bankCardState.form.payment_type_id === FUND_METHOD_TYPE.Enums.BankTransfer">
          <div class="form-item row input-row p-5">
            <!-- bank branch -->
            <div class="row col-12 col-sm-5">
              <div class="form-title label col-12">{{ $t("member.bank.bankName") }}</div>
              <div class="input-content col-12">
                <q-input
                  v-model="bankCardState.form.bank_name"
                  :placeholder="$t('member.bank.bankName')"
                  lazy-rules
                  :rules="[Rules.required()]"
                />
              </div>
            </div>
            <!-- name -->
            <div class="row col-12 col-sm-5">
              <div class="form-title label col-12">{{ $t("member.bank.name") }}</div>
              <div class="input-content col-12">
                <q-input
                  v-model="bankCardState.form.name"
                  :placeholder="$t('member.bank.name')"
                  lazy-rules
                  :rules="[Rules.required()]"
                />
              </div>
            </div>
            <!-- account name -->
            <div class="row col-12 col-sm-5">
              <div class="form-title label col-12">{{ $t("member.bank.accountName") }}</div>
              <div class="input-content col-12">
                <q-input
                  v-model="bankCardState.form.account_name"
                  :placeholder="$t('member.bank.accountName')"
                  lazy-rules
                  :rules="[Rules.required()]"
                />
              </div>
            </div>
            <!-- account number -->
            <div class="row col-12 col-sm-5">
              <div class="form-title label col-12">{{ $t("member.bank.accountNumber") }}</div>
              <div class="input-content col-12">
                <q-input
                  v-model="bankCardState.form.account_number"
                  :placeholder="$t('member.bank.accountNumber')"
                  lazy-rules
                  :rules="[Rules.required()]"
                  @update:model-value="validateAlphanumeric"
                />
              </div>
            </div>
          </div>
        </template>
        <template v-if="bankCardState.form.payment_type_id === FUND_METHOD_TYPE.Enums.EWallet">
          <div class="form-item row input-row p-5">
            <!-- bank branch -->
            <div class="row col-12 col-sm-5">
              <div class="form-title label col-12">{{ $t("member.bank.bankName") }}</div>
              <div class="input-content col-12">
                <q-select
                  v-model="bankCardState.form.bank_id"
                  :options="bankList"
                  :label="$t('member.bank.bankName')"
                  emit-value
                  map-options
                  bg-color="white"
                  lazy-rules
                  :rules="[Rules.requiredInt]"
                />
              </div>
            </div>
            <!-- name -->
            <div class="row col-12 col-sm-5">
              <div class="form-title label col-12">{{ $t("member.bank.name") }}</div>
              <div class="input-content col-12">
                <q-input
                  v-model="bankCardState.form.name"
                  :placeholder="$t('member.bank.name')"
                  lazy-rules
                  :rules="[Rules.required()]"
                />
              </div>
            </div>
            <!-- account name -->
            <div class="row col-12 col-sm-5">
              <div class="form-title label col-12">{{ $t("member.bank.accountName") }}</div>
              <div class="input-content col-12">
                <q-input
                  v-model="bankCardState.form.account_name"
                  :placeholder="$t('member.bank.accountName')"
                  lazy-rules
                  :rules="[Rules.required()]"
                />
              </div>
            </div>
            <!-- account number -->
            <div class="row col-12 col-sm-5">
              <div class="form-title label col-12">{{ $t("member.bank.accountNumber") }}</div>
              <div class="input-content col-12">
                <q-input
                  v-model="bankCardState.form.account_number"
                  :placeholder="$t('member.bank.accountNumber')"
                  lazy-rules
                  :rules="[Rules.required()]"
                  @update:model-value="validateAlphanumeric"
                />
              </div>
            </div>
          </div>
        </template>
        <template v-if="bankCardState.form.payment_type_id === FUND_METHOD_TYPE.Enums.CryptoWallet">
          <div class="form-item row input-row p-5">
            <!-- name -->
            <div class="row col-12 col-sm-5">
              <div class="form-title label col-12">{{ $t("member.bank.name") }}</div>
              <div class="input-content col-12">
                <q-input
                  v-model="bankCardState.form.name"
                  :placeholder="$t('member.bank.name')"
                  lazy-rules
                  :rules="[Rules.required()]"
                />
              </div>
            </div>
            <!-- bank branch -->
            <div class="row col-12 col-sm-5">
              <div class="form-title label col-12">{{ $t("member.deposit.currencyBrand") }}</div>
              <div class="input-content col-12">
                <q-select
                  v-model="bankCardState.form.crypto_id"
                  :options="cryptoList"
                  emit-value
                  :label="$t('member.deposit.currencyBrand')"
                  map-options
                  bg-color="white"
                  lazy-rules
                  :rules="[Rules.requiredInt]"
                />
              </div>
            </div>
            <!-- chain -->
            <div class="row col-12 col-sm-5">
              <div class="form-title label col-12">{{ $t("member.deposit.chain") }}</div>
              <div class="input-content col-12">
                <q-select
                  v-model="bankCardState.form.bank_id"
                  :options="bankList"
                  emit-value
                  :label="$t('member.deposit.chain')"
                  map-options
                  bg-color="white"
                  lazy-rules
                  :rules="[Rules.requiredInt]"
                />
              </div>
            </div>
            <!-- wallet address -->
            <div class="row col-12 col-sm-5">
              <div class="form-title label col-12">{{ $t("member.deposit.walletAddress") }}</div>
              <div class="input-content col-12">
                <q-input
                  v-model="bankCardState.form.wallet_address"
                  :placeholder="$t('member.deposit.walletAddress')"
                  lazy-rules
                  :rules="[Rules.required()]"
                />
              </div>
            </div>
          </div>
        </template>
        <template v-if="bankCardState.form.payment_type_id === FUND_METHOD_TYPE.Enums.CryptoPayment">
          <div class="form-item row input-row p-5">
            <!-- name -->
            <div class="row col-12 col-sm-5">
              <div class="form-title label col-12">{{ $t("member.bank.name") }}</div>
              <div class="input-content col-12">
                <q-input
                  v-model="bankCardState.form.name"
                  :placeholder="$t('member.bank.name')"
                  lazy-rules
                  :rules="[Rules.required()]"
                />
              </div>
            </div>
            <!-- bank branch -->
            <div class="row col-12 col-sm-5">
              <div class="form-title label col-12">{{ $t("member.deposit.currencyBrand") }}</div>
              <div class="input-content col-12">
                <q-select
                  v-model="bankCardState.form.crypto_id"
                  :options="cryptoList"
                  emit-value
                  :label="$t('member.deposit.currencyBrand')"
                  map-options
                  bg-color="white"
                  lazy-rules
                  :rules="[Rules.requiredInt]"
                />
              </div>
            </div>
            <!-- chain -->
            <div class="row col-12 col-sm-5">
              <div class="form-title label col-12">{{ $t("member.deposit.chain") }}</div>
              <div class="input-content col-12">
                <q-select
                  v-model="bankCardState.form.bank_id"
                  :options="bankList"
                  emit-value
                  :label="$t('member.deposit.chain')"
                  map-options
                  bg-color="white"
                  lazy-rules
                  :rules="[Rules.requiredInt]"
                />
              </div>
            </div>
            <!-- wallet address -->
            <div class="row col-12 col-sm-5">
              <div class="form-title label col-12">{{ $t("member.deposit.walletAddress") }}</div>
              <div class="input-content col-12">
                <q-input
                  v-model="bankCardState.form.wallet_address"
                  :placeholder="$t('member.deposit.walletAddress')"
                  lazy-rules
                  :rules="[Rules.required()]"
                />
              </div>
            </div>
            <!-- rate -->
            <!-- <div class="row col-12 col-sm-5">
              <div class="form-title label col-12">{{ $t("member.deposit.rate") }}</div>
              <div class="input-content col-12">
                <p>{{ $t("member.deposit.rate") }}</p>
                <q-input
                  v-model="cryptoRate"
                  :placeholder="$t('member.deposit.rate')"
                  lazy-rules
                  :rules="[Rules.required()]"
                />
              </div>
            </div> -->
          </div>
        </template>
      </div>
      <div class="action-btns row justify-center">
        <q-btn text-color="white" color="primary" label="Confirm" class="submit-btn" type="submit" />
      </div>
    </q-form>
  </HeaderTitleBack>
  <div v-else class="bank-add-layout pc">
    <div class="bank-add-container">
      <div class="bank-header">
        <img :src="memberImg('bank-detail.png')" alt="bank-detail" class="title-img" />
      </div>
      <div class="bank-body column">
        <div class="profile-form column">
          <div class="form-title-content">
            <div class="color-label"></div>
            <div class="title">{{ bankCardId ? $t("common.btn.edit") : $t("common.btn.add") }}</div>
          </div>
          <q-form class="form-content" @submit="handleSubmit">
            <!-- currency -->
            <div class="form-item row">
              <div class="form-title label col-12">{{ $t("member.bank.selectCurrency") }}</div>
              <div class="btn-content col-12 col-sm-10">
                <q-btn
                  color="primary"
                  icon="fas fa-coins"
                  :label="$t(formatterCurrency(item.code) as string)"
                  :class="{ active: bankCardState.form.currency === item.code }"
                  v-for="item in availCurrencyList"
                  :key="item.code"
                  @click="handleBankCardCurrencyClick(item.code)"
                >
                  <div class="triangle">
                    <i class="fas fa-check inner-icon"></i>
                  </div>
                </q-btn>
              </div>
            </div>
            <!-- payment type -->
            <div class="form-item row">
              <div class="form-title label col-12">{{ $t("modal.type") }}</div>
              <div class="btn-content col-12 col-sm-10">
                <q-btn
                  color="primary"
                  :label="$t(item.label as string)"
                  :class="{ active: bankCardState.form.payment_type_id === +item.value }"
                  v-for="item in paymentTypeList"
                  :key="item.value"
                  @click="handleBankCardPaymentTypeClick(item.value)"
                >
                  <div class="triangle">
                    <i class="fas fa-check inner-icon"></i>
                  </div>
                </q-btn>
              </div>
            </div>
            <!-- payment gateway -->
            <div class="form-item row" v-if="showGateway(bankCardState.form.payment_type_id)">
              <div class="form-title label col-12">{{ $t("modal.gateway") }}</div>
              <div class="radio-content col-12 q-mb-md radio-content-type">
                <q-radio
                  v-for="item in paymentGatewayList"
                  :key="item.value"
                  dense
                  color="primary"
                  v-model="bankCardState.form.payment_gateway_id"
                  :val="item.value"
                  :label="$t(item.label)"
                  checked-icon="circle"
                />
              </div>
            </div>
            <!-- 底下的Type特定欄位-->
            <template v-if="bankCardState.form.payment_type_id === FUND_METHOD_TYPE.Enums.CryptoWallet">
              <div class="form-item row input-row">
                <!-- name -->
                <div class="row col-10 col-sm-5">
                  <div class="form-title label col-12">{{ $t("member.bank.name") }}</div>
                  <div class="input-content col-12">
                    <q-input
                      v-model="bankCardState.form.name"
                      :placeholder="$t('member.bank.name')"
                      lazy-rules
                      :rules="[Rules.required()]"
                    />
                  </div>
                </div>
                <!-- currencyBrand -->
                <div class="row col-10 col-sm-5">
                  <div class="form-title label col-12">{{ $t("member.deposit.currencyBrand") }}</div>
                  <div class="input-content col-12">
                    <q-select
                      v-model="bankCardState.form.crypto_id"
                      :options="cryptoList"
                      emit-value
                      map-options
                      bg-color="white"
                      lazy-rules
                      :rules="[Rules.requiredInt]"
                    />
                  </div>
                </div>
              </div>
              <div class="form-item row input-row">
                <!-- chain -->
                <div class="row col-10 col-sm-5">
                  <div class="form-title label col-12">{{ $t("member.deposit.chain") }}</div>
                  <div class="input-content col-12">
                    <q-select
                      v-model="bankCardState.form.bank_id"
                      :options="bankList"
                      emit-value
                      map-options
                      bg-color="white"
                      lazy-rules
                      :rules="[Rules.requiredInt]"
                    />
                  </div>
                </div>
                <!-- wallet address -->
                <div class="row col-10 col-sm-5">
                  <div class="form-title label col-12">{{ $t("member.deposit.walletAddress") }}</div>
                  <div class="input-content col-12">
                    <q-input
                      v-model="bankCardState.form.wallet_address"
                      :placeholder="$t('member.deposit.walletAddress')"
                      lazy-rules
                      :rules="[Rules.required()]"
                    />
                  </div>
                </div>
                <!-- rate -->
                <!-- <div class="row col-10 col-sm-5">
                  <div class="form-title label col-12">{{ $t("member.deposit.rate") }}</div>
                  <div class="input-content col-12">
                    <p>{{ cryptoRate }}</p>
                  </div>
                </div> -->
              </div>
            </template>
            <template v-if="bankCardState.form.payment_type_id === FUND_METHOD_TYPE.Enums.CryptoPayment">
              <div class="form-item row input-row">
                <!-- name -->
                <div class="row col-10 col-sm-5">
                  <div class="form-title label col-12">{{ $t("member.bank.name") }}</div>
                  <div class="input-content col-12">
                    <q-input
                      v-model="bankCardState.form.name"
                      :placeholder="$t('member.bank.name')"
                      lazy-rules
                      :rules="[Rules.required()]"
                    />
                  </div>
                </div>
                <!-- currencyBrand -->
                <div class="row col-10 col-sm-5">
                  <div class="form-title label col-12">{{ $t("member.deposit.currencyBrand") }}</div>
                  <div class="input-content col-12">
                    <q-select
                      v-model="bankCardState.form.crypto_id"
                      :options="cryptoList"
                      emit-value
                      map-options
                      bg-color="white"
                      lazy-rules
                      :rules="[Rules.requiredInt]"
                    />
                  </div>
                </div>
              </div>
              <div class="form-item row input-row">
                <!-- chain -->
                <div class="row col-10 col-sm-5">
                  <div class="form-title label col-12">{{ $t("member.deposit.chain") }}</div>
                  <div class="input-content col-12">
                    <q-select
                      v-model="bankCardState.form.bank_id"
                      :options="bankList"
                      :disable="!bankCardState.form.payment_gateway_id"
                      emit-value
                      map-options
                      bg-color="white"
                      lazy-rules
                      :rules="[Rules.requiredInt]"
                    />
                  </div>
                </div>
                <!-- wallet address -->
                <div class="row col-10 col-sm-5">
                  <div class="form-title label col-12">{{ $t("member.deposit.walletAddress") }}</div>
                  <div class="input-content col-12">
                    <q-input
                      v-model="bankCardState.form.wallet_address"
                      :placeholder="$t('member.deposit.walletAddress')"
                      lazy-rules
                      :rules="[Rules.required()]"
                    />
                  </div>
                </div>
                <!-- rate -->
                <!-- <div class="row col-10 col-sm-5">
                  <div class="form-title label col-12">{{ $t("member.deposit.rate") }}</div>
                  <div class="input-content col-12">
                    <p>{{ cryptoRate }}</p>
                  </div>
                </div> -->
              </div>
            </template>
            <template v-if="bankCardState.form.payment_type_id === FUND_METHOD_TYPE.Enums.BankTransfer">
              <div class="form-item row input-row">
                <!-- bank branch -->
                <div class="row col-10 col-sm-5">
                  <div class="form-title label col-12">{{ $t("member.bank.bankName") }}</div>
                  <div class="input-content col-12">
                    <q-input
                      v-model="bankCardState.form.bank_name"
                      :placeholder="$t('member.bank.bankName')"
                      lazy-rules
                      :rules="[Rules.required()]"
                    />
                  </div>
                </div>
                <!-- name -->
                <div class="row col-10 col-sm-5">
                  <div class="form-title label col-12">{{ $t("member.bank.name") }}</div>
                  <div class="input-content col-12">
                    <q-input
                      v-model="bankCardState.form.name"
                      :placeholder="$t('member.bank.name')"
                      lazy-rules
                      :rules="[Rules.required()]"
                    />
                  </div>
                </div>
              </div>
              <div class="form-item row input-row">
                <!-- account name -->
                <div class="row col-10 col-sm-5">
                  <div class="form-title label col-12">{{ $t("member.bank.accountName") }}</div>
                  <div class="input-content col-12">
                    <q-input
                      v-model="bankCardState.form.account_name"
                      :placeholder="$t('member.bank.accountName')"
                      lazy-rules
                      :rules="[Rules.required()]"
                    />
                  </div>
                </div>
                <!-- account number -->
                <div class="row col-10 col-sm-5">
                  <div class="form-title label col-12">{{ $t("member.bank.accountNumber") }}</div>
                  <div class="input-content col-12">
                    <q-input
                      v-model="bankCardState.form.account_number"
                      :placeholder="$t('member.bank.accountNumber')"
                      lazy-rules
                      :rules="[Rules.required()]"
                      @update:model-value="validateAlphanumeric"
                    />
                  </div>
                </div>
              </div>
            </template>
            <template v-if="bankCardState.form.payment_type_id === FUND_METHOD_TYPE.Enums.EWallet">
              <div class="form-item row input-row">
                <!-- bank branch -->
                <div class="row col-10 col-sm-5">
                  <div class="form-title label col-12">{{ $t("member.bank.bankName") }}</div>
                  <div class="input-content col-12">
                    <q-select
                      v-model="bankCardState.form.bank_id"
                      :options="bankList"
                      :disable="!bankCardState.form.payment_gateway_id"
                      emit-value
                      map-options
                      bg-color="white"
                      lazy-rules
                      :rules="[Rules.requiredInt]"
                    />
                  </div>
                </div>
                <!-- name -->
                <div class="row col-10 col-sm-5">
                  <div class="form-title label col-12">{{ $t("member.bank.name") }}</div>
                  <div class="input-content col-12">
                    <q-input
                      v-model="bankCardState.form.name"
                      :placeholder="$t('member.bank.name')"
                      lazy-rules
                      :rules="[Rules.required()]"
                    />
                  </div>
                </div>
              </div>
              <div class="form-item row input-row">
                <!-- account name -->
                <div class="row col-10 col-sm-5">
                  <div class="form-title label col-12">{{ $t("member.bank.accountName") }}</div>
                  <div class="input-content col-12">
                    <q-input
                      v-model="bankCardState.form.account_name"
                      :placeholder="$t('member.bank.accountName')"
                      lazy-rules
                      :rules="[Rules.required()]"
                    />
                  </div>
                </div>
                <!-- account number -->
                <div class="row col-10 col-sm-5">
                  <div class="form-title label col-12">{{ $t("member.bank.accountNumber") }}</div>
                  <div class="input-content col-12">
                    <q-input
                      v-model="bankCardState.form.account_number"
                      :placeholder="$t('member.bank.accountNumber')"
                      lazy-rules
                      :rules="[Rules.required()]"
                      @update:model-value="validateAlphanumeric"
                    />
                  </div>
                </div>
              </div>
            </template>

            <div class="action-btns multi-btns row justify-center no-wrap">
              <q-btn text-color="white" label="Cancel" class="cancle-btn" @click="goMemberBank" />
              <q-btn text-color="black" label="SUBMIT" color="primary" class="submit-btn" type="submit" />
            </div>
          </q-form>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useSiteImg } from "app/template/bmm_set_obtd/hooks/useSiteImg"
import { useQuasar } from "quasar"
import HeaderTitleBack from "src/common/components/modal/HeaderTitleBack.vue"
import { useBank } from "src/common/composables/useBank"
import { useTelegram } from "src/common/composables/useTelegramMiniApp"
import { useRule } from "src/common/hooks/useRule"
import { FUND_METHOD_TYPE } from "src/common/utils/constants"
import { computed, onMounted, onUnmounted, watch } from "vue"
import { useRoute, useRouter } from "vue-router"

const { isTelegramMiniApp, listenPreventOverflow, removeListenPreventOverflow } = useTelegram()
const { memberImg } = useSiteImg()
const $q = useQuasar()
const router = useRouter()
const route = useRoute()
const Rules = useRule()
const {
  showGateway,
  availCurrencyList,
  getAvailCurrencyList,
  paymentGatewayList,
  bankCardState,
  validateNumeric,
  validateAlphanumeric,
  paymentTypeList,
  currencyList,
  bankList,
  getBankList,
  cryptoList,
  getCryptoList,
  cryptoRate,
  getWithdrawCryptoRate,
  getPaymentTypeList,
  handleBankCardAdd,
  handleBankCardEdit,
  handleBankCardCurrencyClick,
  handleBankCardPaymentTypeClick,
  resetBankCardForm,
  getBankCardInfo,
  formatterCurrency
} = useBank()

// const showRate = computed(() => {
//   const { crypto_id } = bankCardState.form
//   if (crypto_id) return true

//   return false
// })

const bankCardId = computed(() => {
  if (route.params.id) {
    return parseInt(route.params.id as string)
  }
  return 0
})

const goMemberBank = () => {
  resetBankCardForm()
  router.push({ name: "memberBank" })
}
const handleSubmit = async () => {
  const submitFunction = bankCardId.value ? handleBankCardEdit : handleBankCardAdd
  const isSuccess = await submitFunction()
  if (isSuccess) {
    goMemberBank()
  }
}

watch(
  () => bankCardState.form.payment_gateway_id,
  (newId) => {
    getBankList(newId)
  }
)

// watch(
//   () => showRate.value,
//   (status) => {
//     if(status) getWithdrawCryptoRate(bankCardState.form)
//   }
// )

onMounted(async () => {
  getCryptoList()
  await getAvailCurrencyList()
  await getPaymentTypeList(bankCardState.form.currency)
  if (bankCardId.value) {
    await getBankCardInfo({ id: bankCardId.value })
    getBankList()
  } else {
    handleBankCardPaymentTypeClick(paymentTypeList.value[0].value)
    getBankList()
  }

  if (isTelegramMiniApp.value) {
    listenPreventOverflow()
  }
})

onUnmounted(() => {
  if (isTelegramMiniApp.value) {
    removeListenPreventOverflow()
  }
})
</script>

<style lang="sass" scoped>
@import "src/common/css/_variable.sass"
@import "src/css/form.sass"
@import "app/template/bmm_set_obtd/assets/css/_variable.sass"

.input-content
  ::v-deep(.q-field__control)
    border-radius: 0px
    border: 0px
    border-bottom: 2px solid $border-pale-gray-color
    .q-field__label
      font-family: "Noto Sans CJK TC" !important
      font-weight: bold
  ::v-deep(.q-field--with-bottom)
    padding-bottom: 0
  p
    color: $text-dark-color

.radio-content
  width: 100%
  +setFlex(flex-start)
  flex-wrap: wrap
  ::v-deep(.q-radio)
    .q-radio__inner
      margin-left: .625rem
      margin-right: .625rem
      color: $primary-color !important
      background-color: $background-light-color !important
      border-color: $primary-color !important
      .q-radio__icon-container
        border-radius: 50%
        border: 2px solid $primary-color !important
    .q-icon
      font-size: .625rem
      color: $primary-color
    .q-radio__label
      color: $text-charcoal-gray-color !important

.triangle
  width: 0
  height: 0
  border-top: 0px solid transparent
  border-right: 0px solid transparent
  border-bottom: 25px solid $border-medium-bright-blue-color
  border-left: 25px solid transparent
  position: absolute
  display: none
  right: 0
  bottom: 0
  i
    position: absolute
    right: 2px
    bottom: -25px
    color: $text-light-color
    font-size: 0.8rem

// h5 mode
.bank-add-layout.h5
  width: 100%
  display: inline-grid
  row-gap: 1rem
  overflow: hidden
  background: $background-pale-silver-color
  @include phone-width
    row-gap: 0.5rem
  .action-btns
    margin: 0.5rem 0.5rem 1rem 0.5rem
    .submit-btn
      width: 100%
  .withdraw-container
    width: 100%
    list-style: none
    background: $background-light-color
    box-shadow: rgba($box-shadow-soft-blue-gray-color, 0.12) 0px 4rem 10rem, rgba($box-shadow-light-color, 0.8) 0rem 2rem 2rem inset
    box-sizing: border-box
    .info-row
      display: flex
      align-items: center
      justify-content: space-between
      flex-flow: row
      padding-left: 1.875rem
      padding-right: 1.25rem
      height: 6.25rem
      flex-flow: wrap
      flex: 1 1 0%
      font-size: 1.75rem
      line-height: 2.5rem
      color: $text-steel-blue-color
      box-shadow: rgba($box-shadow-soft-blue-gray-color, 0.12) 0px 4rem 10rem, rgba($box-shadow-light-color, 0.8) 0rem 2rem 2rem inset
      +phone-width
        padding-left: 1rem
        padding-right: 0.6875rem
        min-height: 10rem
        height: auto
        font-size: 1rem
        line-height: 1.375rem
        &.read-only
          min-height: 5rem
      .info-title
        width: 100%
        text-transform: capitalize
        border-bottom: 1px solid $border-pale-gray-color
        padding-bottom: 0.8rem
      .info-content
        color: $text-sky-gray-color
        width: 100%
        overflow: hidden
        text-overflow: ellipsis
        white-space: normal
        max-width: 400px
        display: flex
        flex-wrap: wrap
        align-items: center
        gap: 1.563vw
        &.normal
          ::v-deep(.q-btn)
            text-transform: none
            display: flex
            -webkit-box-align: center
            align-items: center
            padding: 0px 15px
            position: relative
            width: calc(33.33% - 0.2rem)
            height: 20px
            font-size: 1rem
        &.currency
          ::v-deep(.q-btn)
            text-transform: none
            display: flex
            -webkit-box-align: center
            align-items: center
            border: 2px solid $border-pale-gray-color !important
            border-radius: 10px
            padding: 0px 12px
            position: relative
            width: 48%
            height: 75px
            font-size: 1rem
            background: $background-light-color !important
            color: $text-charcoal-gray-color !important
            overflow: hidden
            &.active
              border: 2px solid $primary-color !important
              color: $primary-color !important
              .triangle
                display: block
        .bank-content
          width: 100%
          max-width: 400px
          height: auto
          padding: 10px
          list-style: none
          li
            @apply flex justify-start my-2 p-2
            align-items: center
            background: $background-light-color
            border: 2px solid $border-pale-gray-color
            border-radius: 0.2rem
            color: $text-dark-color
            i
              margin: 0 5px
              color: $text-danger-tertiary-color
              font-size: 1.2rem
              cursor: pointer
              padding: 0
        .q-icon
          margin-left: 1.25rem
          margin-right: 0.625rem
          @include phone-width
            margin-left: 0.6875rem
            margin-right: 0.375rem
            +setFlex(flex-start)
            padding-top: 1rem
            padding-left: .75rem
    .q-separator
      margin-left: 1.75rem
      margin-right: 1.75rem
      height: 1px
      background-color: $background-pale-gray-color
      @include phone-width
        margin-left: 14px
        margin-right: 14px

.edit-dialog
  .dialog-card
    width: 100%
    height: 500px
    background-color: $background-light-color

    .dialog-header
      height: 5.5rem
      font-size: 2rem
      padding: 1.25rem 1.75rem
      border-bottom: 1px solid rgba($border-pale-gray-color, 0.5)
      display: flex
      align-items: center
      justify-content: space-between
      .q-btn
        font-size: 2rem
        text-transform: capitalize
        font-weight: 400
        padding: 0
        min-height: auto
      .btn-cancel
        color: $text-sky-gray-color
      .title
        font-weight: bold
        max-width: 20rem
        overflow: hidden
        text-overflow: ellipsis
        white-space: nowrap
        font-weight: 700
    .dialog-body
      .dialog-form-row
        width: 100%
        padding: 20px
        height: 134px
        :deep(.q-field__control)
          color: $text-pale-gray-color !important
        .dialog-form-title
          font-weight: 400
          line-height: 2.87
          letter-spacing: 0.00938em
          position: relative
          display: block
          transform-origin: left top
          text-overflow: ellipsis
          max-width: 100%
          font-family: "PingFang SC"
          color: $text-charcoal-gray-color-light
          font-size: 1.75rem
          padding: 0px
          white-space: nowrap
          overflow: hidden
          transition: color 200ms cubic-bezier(0, 0, 0.2, 1), transform 200ms cubic-bezier(0, 0, 0.2, 1), max-width 200ms cubic-bezier(0, 0, 0.2, 1)
        .dialog-form-input
          font-size: 1.75rem
          font-weight: 400
          :deep(.q-icon)
            font-size: 1.875rem !important
      .select-container
        height: 25.75rem
        overflow-y: scroll
        .select-row
          width: 100%
          height: 96px
          list-style: none
          color: $text-charcoal-gray-color-light
          font-size: 1.75rem
          padding: 0px 1.75rem
          display: flex
          align-items: center
          justify-content: space-between
          .check-img
            display: none
          &.active
            color: $text-charcoal-gray-color
            font-weight: bold
            background: rgba($background-pale-blue-color, 0.5)
            .check-img
              display: block
              width: 2.5rem
              height: 2.5rem
    @include phone-width
      height: 350px
      .dialog-header
        height: 2.9375rem
        font-size: 16px
        padding: 10px 14px
        .q-btn
          font-size: 1rem
        .title
          max-width: 160px
          font-size: 1.125rem
      .dialog-body
        .dialog-form-row
          .dialog-form-title
            font-size: 0.875rem
          .dialog-form-input
            font-size: 0.875rem
        .select-container
          height: 12.875rem
          .select-row
            height: 3rem
            font-size: 0.875rem
            padding: 0px 0.875rem
            &.active
              .check-img
                width: 1.375rem
                height: 1.375rem

.bank-add-layout.pc
  // padding-top: 6rem
  +iphone-width
    padding-top: 0
  .bank-add-container
    width: 55rem
    height: 100%
    padding: 4.375rem 3.125rem 1.875rem
    .bank-header
      @apply w-full flex justify-between items-center
      .title-img
        width: 13rem
        height: auto
    .bank-body
      color: $text-light-color
      max-width: 62.5rem
      margin-top: 1.5625rem
      // padding: 6vw 0
      overflow: hidden
      +iphone-width
        padding: 0
      .profile-form
        width: 100%
        display: flex
        flex-direction: column
        -webkit-box-pack: start
        justify-content: flex-start
        padding: 30px
        border: 2px solid $border-pale-gray-color
        border-radius: 14px
        +iphone-width
          margin-top: 0
          padding: 0
          background: $background-midnight-gray-color
        .form-title-content
          width: 100%
          .color-label
            background-color: $primary-color !important
          .title
            color: $primary-color
        .form-content
          width: 100%
          +iphone-width
            width: 100%
            padding: 1rem 1.5rem
            background: transparent
            border-radius: .5rem
          .form-item
            +setFlex(flex-start)
            &.input-row
              gap: 1.875rem
              +iphone-width
                gap: 0
                justify-content: center
            .form-title
              font-size: 1.2rem
              font-weight: 590
              color: $primary-color
            .btn-content
              +setFlex(flex-start)
              flex-wrap: wrap
              padding-top: 1rem
              padding-left: .75rem
              gap: 1.563vw
              ::v-deep(.q-btn)
                text-transform: none
                display: flex
                -webkit-box-align: center
                align-items: center
                border: 2px solid $border-pale-gray-color !important
                border-radius: 10px
                padding: 0px 15px
                position: relative
                width: 150px
                height: 60px
                font-size: 1rem
                background: $background-light-color !important
                color: $text-charcoal-gray-color !important
                overflow: hidden
                &.active
                  border: 2px solid $primary-color !important
                  color: $primary-color !important
                  .triangle
                    display: block
            .label
              +iphone-width
                margin-top: 1.6875rem
            .input-content
              margin: .5rem .5rem 0 0.8rem
              padding: 0
            .radio-content
              // +setFlex(flex-start)
              padding-top: 1.75rem
              padding-left: .75rem
              gap: 1.875rem
              +iphone-width
                padding-top: 1.125rem
                padding-left: .625rem
                gap: 1.25rem
            .btn-toggle-content
              +setFlex(flex-start)
              padding-top: 1.75rem
              padding-left: .75rem
              gap: 1.875rem
              +iphone-width
                padding-top: 1.125rem
                padding-left: .625rem
                gap: 1.25rem
      .action-btns
        .cancle-btn
          background-color: $background-light-color !important
          color: $text-charcoal-gray-color !important
        .submit-btn
          width: 100%
          color: $text-light-color !important
</style>
