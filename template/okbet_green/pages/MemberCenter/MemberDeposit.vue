<template>
  <HeaderTitleBack v-if="$q.platform.is.mobile" titleI18n="member.deposit.title" variant="green-member">
    <q-form class="deposit-layout h5" :class="{ '!pb-[24rem]': isTelegramMiniApp }" @submit="handleDepositSubmit">
      <!-- currency -->
      <div v-if="showCurrencyArea" class="deposit-container">
        <div class="info-row">
          <div class="mt-2.5 info-title col-12">{{ $t("member.deposit.selectCurrency") }}</div>
          <div class="flex-row my-2.5 info-content currency col-12 col-sm-10">
            <q-btn
              color="primary"
              icon="fas fa-coins"
              :label="$t(formatterCurrency(item) as string)"
              :class="{ active: depositState.form.currency === item }"
              v-for="item in depositState.supportedCurrency"
              :key="item"
              @click="handleDepositCurrencyClick(item)"
            >
              <div class="triangle">
                <i class="fas fa-check inner-icon"></i>
              </div>
            </q-btn>
          </div>
        </div>
      </div>

      <!-- type -->
      <div class="deposit-container">
        <div class="info-row">
          <div class="mt-2.5 info-title col-12">{{ $t("member.deposit.type") }}</div>
          <div class="flex-row my-2.5 info-content currency col-12 col-sm-10">
            <q-btn
              color="primary"
              :label="typeI18n(item)"
              :class="{ active: depositState.usingFundType === item }"
              v-for="item in depositState.fundTypeList"
              :key="item"
              @click="handleDepositFundTypeClick(item)"
            >
              <div class="triangle">
                <i class="fas fa-check inner-icon"></i>
              </div>
            </q-btn>
          </div>
        </div>
      </div>

      <!-- 支付方式 -->
      <div class="deposit-container">
        <div class="info-row">
          <div class="mt-2.5 info-title col-12">{{ $t("member.deposit.selectMethod") }}</div>
          <div class="flex-row my-2.5 info-content currency col-12 col-sm-10">
            <q-btn
              color="primary"
              :class="{ active: String(item.id) === `${depositState.form.payment_gateway_id}` }"
              v-for="(item, key) in depositState.usingPaymentInfoList"
              :key="key"
              @click="handleDepositPaymentClick(item.id)"
            >
              <!-- <div :style="{ backgroundImage: `url('${item.imgUrl}')` }" class="h-full w-full" /> -->
              <img :src="item.imgUrl" class="h-full" />
              <div class="triangle">
                <i class="fas fa-check inner-icon"></i>
              </div>
            </q-btn>
          </div>
        </div>
      </div>

      <!-- amount -->
      <div class="deposit-container">
        <div class="info-row">
          <div class="info-title mt-2.5 col-12">{{ $t("member.deposit.depositAmount") }}</div>
          <div class="info-content flex-col normal col-12 col-sm-10 w-full">
            <div class="input-content deposit-input col-12 w-full">
              <q-input
                v-model="depositState.form.amount"
                :rules="[Rules.required()]"
                lazy-rules
                :placeholder="`${depositState.paymentDetail.deposit_min} ~ ${depositState.paymentDetail.deposit_max}`"
                type="tel"
              />
              <ul v-show="depositState.paymentDetail.usdt_rate">
                <li>
                  <span>{{ `${$t("member.withdrawal.rate")}: ` }}</span>
                  <span>{{ depositState.paymentDetail.usdt_rate }}</span>
                </li>
                <li>
                  <span>{{ `${$t("member.withdrawal.actualAmount")}: ` }}</span>
                  <span>{{ rateResult }}</span>
                </li>
              </ul>
            </div>
            <div class="input-content mb-2.5 col-12 w-full">
              <div class="flex justify-start gap-1">
                <q-btn
                  v-for="item in depositState.quickBtns"
                  :key="item"
                  color="quick"
                  text-color="black"
                  @click="handleDepositQuickBtnClick(item)"
                >
                  {{ item }}
                </q-btn>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="deposit-container" v-if="depositState.promotion_list.length > 0">
        <!-- type -->
        <div class="info-row">
          <div class="mt-2.5 info-title col-12">
            {{ $t("member.deposit.depositReward") }}
          </div>
          <div class="flex-row my-2.5 info-content currency col-12 col-sm-10">
            <div class="form-promo">
              <PromotionList
                v-for="item in depositState.promotion_list"
                :key="item.id"
                :item="item"
                :activeId="depositState.form.promotion_id"
                @click="handlePromotionClick(item.id)"
              ></PromotionList>
            </div>
          </div>
        </div>
      </div>

      <!-- 額外欄位 -->
      <div class="deposit-container" v-if="depositState.paymentDetail.extra_field_key">
        <div class="info-row">
          <div class="info-title my-2.5 col-12">{{ $t("bank_column.client_Info") }}</div>
          <div
            class="info-contentflex-col normal col-12 col-sm-10 w-full"
            v-for="(field, key) in depositState.paymentDetail.extra_field[depositState.paymentDetail.extra_field_key]"
            :key="key"
          >
            <!-- 文字輸入框 -->
            <ExtraInput
              v-if="field.type === FIELD_TYPE.Enums.Input"
              v-model="depositState.form[depositState.paymentDetail.extra_field_key][field.field_name]"
              :field="field"
              class="form-input"
            />

            <!-- 下拉選單類型 -->
            <ExtraSelect
              v-else-if="field.type === FIELD_TYPE.Enums.Select"
              v-model="depositState.form[depositState.paymentDetail.extra_field_key][field.field_name]"
              :field="field"
              optionStyle="default"
              class="form-input"
            />

            <!-- 其他 -->
            <ExtraInput
              v-else
              v-model="depositState.form[depositState.paymentDetail.extra_field_key][field.field_name]"
              :field="field"
              class="form-input"
            />
          </div>
        </div>
      </div>

      <!-- 支付資訊 -->
      <div class="deposit-container" v-if="depositState.usingFundType === 'BankTransfer'">
        <!-- bank account -->
        <div class="info-row read-only">
          <p class="mt-2.5 info-title">{{ $t("member.deposit.bankAccount") }}</p>
          <div class="flex-col w-full info-content normal col-12 col-sm-10">
            <div class="w-full input-content col-12">
              <ul class="bank-content col-12">
                <li class="w-full flex items-center !justify-between">
                  <span>{{ depositState.paymentDetail.bank_name }}</span>
                  <q-icon name="fa-solid fa-copy" @click="copyMessage(depositState.paymentDetail.bank_name)" />
                </li>
                <li class="w-full flex items-center !justify-between">
                  <span>{{ depositState.paymentDetail.bank_account }}</span>
                  <q-icon name="fa-solid fa-copy" @click="copyMessage(depositState.paymentDetail.bank_account)" />
                </li>
                <img
                  v-if="depositState.paymentDetail.qrcode_image_id !== 0"
                  :src="depositState.paymentDetail.imgUrl"
                  alt=""
                  class="w-full md:w-64"
                />
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="deposit-container" v-else-if="depositState.usingFundType === 'CryptoWallet'">
        <!-- deposit info -->
        <div class="info-row read-only">
          <p class="mt-2.5 info-title">{{ $t("member.deposit.depositInfo") }}</p>
          <div class="flex-col w-full info-content normal col-12 col-sm-10">
            <div class="w-full input-content col-12">
              <ul class="deposit-content col-12">
                <li>
                  <span class="title">{{ $t("member.deposit.currencyBrand") }}</span>
                  <!-- <span>{{ 'USDT' }}</span> -->
                  <span>{{ depositState.paymentDetail.currency_brand }}</span>
                </li>
                <li>
                  <span class="title">{{ $t("member.deposit.chain") }}</span>
                  <!-- <span>{{ 'TRX-20' }}</span> -->
                  <span>{{ depositState.paymentDetail.chain }}</span>
                </li>
                <li>
                  <span class="title">{{ $t("member.deposit.walletAddress") }}</span>
                  <!-- <span>{{ 'tx0123123' }}</span> -->
                  <span>{{
                    depositState.paymentDetail.wallet_address.length > 15
                      ? depositState.paymentDetail.wallet_address.substring(0, 15) + "..."
                      : depositState.paymentDetail.wallet_address
                  }}</span>
                  <q-icon name="fa-solid fa-copy" @click="copyMessage(depositState.paymentDetail.wallet_address)" />
                </li>
                <img
                  v-if="depositState.paymentDetail.qrcode_image_id !== 0"
                  :src="depositState.paymentDetail.imgUrl"
                  alt=""
                  class="w-full md:w-64"
                />
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="deposit-container" v-else-if="depositState.usingFundType === 'CryptoPayment'">
        <!-- deposit info -->
        <div class="info-row read-only">
          <p class="mt-2.5 info-title">{{ $t("member.deposit.depositInfo") }}</p>
          <div class="flex-col w-full info-content normal col-12 col-sm-10">
            <div class="w-full input-content col-12">
              <ul class="deposit-content col-12">
                <li>
                  <span class="title">{{ $t("member.deposit.currencyBrand") }}</span>
                  <!-- <span>{{ 'USDT' }}</span> -->
                  <span>{{ depositState.paymentDetail.currency_brand }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="deposit-container">
        <!-- fee -->
        <div
          v-if="hasFee(depositState.paymentDetail) && depositState.usingFundType === 'BankTransfer'"
          class="info-row read-only"
        >
          <p class="info-title mt-2.5">
            {{ $t("member.deposit.handlingFee") }}
            ：
            <span>
              {{
                depositState.paymentDetail.fee_type === FEE_TYPE.Enums.Amount
                  ? depositState.paymentDetail.fee_amount
                  : `${depositState.paymentDetail.fee_rate}%`
              }}
            </span>
          </p>
        </div>
      </div>

      <!-- 存款備註 -->
      <div
        class="deposit-container"
        v-if="depositState.paymentDetail.extra_remark && depositState.paymentDetail.extra_remark.length > 0"
      >
        <div class="info-row">
          <div class="mt-2.5 info-title col-12">{{ $t("member.deposit.remark") }}</div>
          <div class="flex-row my-2.5 info-content currency col-12 col-sm-10">
            <div class="form-remark">
              <div
                v-for="(item, index) in depositState.paymentDetail.extra_remark"
                :key="index"
                class="form-remark-item"
              >
                <div class="form-remark-title">{{ item.titles.find((lang) => lang.lang === nowLang)?.title }}</div>
                <div class="form-remark-input">
                  <q-input outlined dense v-model="item.content" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="deposit-container" v-if="depositState.uploadConfig.uploadSwitch">
        <!-- upload -->
        <div class="info-row row-center">
          <div class="mt-5 info-title col-12">
            {{ $t("tableHeader.uploadDetail") }}
          </div>
          <div class="flex justify-center flex-row my-5">
            <div class="uploaded">
              <div class="item" v-for="(item, index) in depositState.uploadConfig.images" :key="index">
                <img @click="showBiggerImage(item.image.base64)" :src="item.image.base64" alt="" />
                <q-btn
                  color="red"
                  rounded
                  dense
                  icon="delete"
                  class="delete-btn"
                  size="sm"
                  @click="handleDepositUploadImageDelete(index)"
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
        </div>
      </div>
      <div class="justify-center action-btns row">
        <q-btn
          text-color="white"
          color="primary"
          :label="$t('common.btn.submit')"
          class="submit-btn text-capitalize"
          type="submit"
        />
      </div>
    </q-form>
    <FooterNav />
  </HeaderTitleBack>
  <div v-else class="deposit-layout pc">
    <div class="deposit-header">
      <img :src="memberImg('deposit.png')" alt="profile" class="title-img" />
    </div>
    <div class="deposit-body">
      <!-- <PaymentNav /> -->
      <q-form @submit="handleDepositSubmit">
        <div class="profile-form column">
          <div class="form-content">
            <!-- currency -->
            <div v-if="showCurrencyArea" class="mb-5 form-item row">
              <div class="form-title label col-12">{{ $t("member.deposit.selectCurrency") }}</div>
              <div class="btn-content col-12 col-sm-10">
                <q-btn
                  color="primary"
                  icon="fas fa-coins"
                  :label="$t(formatterCurrency(item) as string)"
                  :class="{ active: depositState.form.currency === item }"
                  v-for="item in depositState.supportedCurrency"
                  :key="item"
                  @click="handleDepositCurrencyClick(item)"
                >
                  <div class="triangle">
                    <i class="fas fa-check inner-icon"></i>
                  </div>
                </q-btn>
              </div>
            </div>
            <!-- type -->
            <div class="mb-5 form-item row">
              <div class="form-title label col-12">{{ $t("member.deposit.type") }}</div>
              <div class="btn-content col-12 col-sm-10">
                <q-btn
                  color="primary"
                  :label="typeI18n(item)"
                  :class="{ active: depositState.usingFundType === item }"
                  v-for="item in depositState.fundTypeList"
                  :key="item"
                  @click="handleDepositFundTypeClick(item)"
                >
                  <div class="triangle">
                    <i class="fas fa-check inner-icon"></i>
                  </div>
                </q-btn>
              </div>
            </div>
            <!-- 支付方式 -->
            <div class="mb-5 form-item row">
              <div class="form-title label col-12">{{ $t("member.deposit.selectMethod") }}</div>
              <div class="form-methods">
                <div
                  v-for="(item, key) in depositState.usingPaymentInfoList"
                  :key="key"
                  class="method-item"
                  :class="{ active: String(item.id) === `${depositState.form.payment_gateway_id}` }"
                  @click="handleDepositPaymentClick(item.id)"
                >
                  <img :src="item.imgUrl" alt="" class="w-full h-full" />
                </div>
              </div>
            </div>
            <!-- 支付資訊 -->
            <div class="form-item row" v-if="depositState.usingFundType === 'BankTransfer'">
              <div class="col-12 col-sm-12 mr-16">
                <div class="form-title label col-12">{{ $t("member.deposit.depositInfo") }}</div>
                <ul class="bank-content col-12">
                  <li class="w-full flex items-center !justify-between">
                    <span>{{ depositState.paymentDetail.bank_name }}</span>
                    <q-icon name="fa-solid fa-copy" @click="copyMessage(depositState.paymentDetail.bank_name)" />
                  </li>
                  <li class="w-full flex items-center !justify-between">
                    <span>{{ depositState.paymentDetail.bank_account }}</span>
                    <q-icon name="fa-solid fa-copy" @click="copyMessage(depositState.paymentDetail.bank_account)" />
                  </li>
                  <img
                    v-if="depositState.paymentDetail.qrcode_image_id !== 0"
                    :src="depositState.paymentDetail.imgUrl"
                    alt=""
                    class="w-full md:w-64"
                  />
                </ul>
              </div>
              <div v-if="hasFee(depositState.paymentDetail)" class="col-12 col-sm-12 mr-16">
                <div class="form-title label col-12">
                  {{ $t("member.deposit.handlingFee") }}
                  ：
                  <span>
                    {{
                      depositState.paymentDetail.fee_type === FEE_TYPE.Enums.Amount
                        ? depositState.paymentDetail.fee_amount
                        : `${depositState.paymentDetail.fee_rate}%`
                    }}
                  </span>
                </div>
              </div>
            </div>
            <div class="form-item row" v-else-if="depositState.usingFundType === 'CryptoWallet'">
              <div class="col-12 col-sm-12 mr-16">
                <div class="form-title label col-12">{{ $t("member.deposit.depositInfo") }}</div>
                <ul class="deposit-content col-12">
                  <li>
                    <span class="title">{{ $t("member.deposit.currencyBrand") }}</span>
                    <!-- <span>{{ 'USDT' }}</span> -->
                    <span>{{ depositState.paymentDetail.currency_brand }}</span>
                  </li>
                  <li>
                    <span class="title">{{ $t("member.deposit.chain") }}</span>
                    <!-- <span>{{ 'TRX-20' }}</span> -->
                    <span>{{ depositState.paymentDetail.chain }}</span>
                  </li>
                  <li>
                    <span class="title">{{ $t("member.deposit.walletAddress") }}</span>
                    <!-- <span>{{ 'tx0123123' }}</span> -->
                    <span>{{
                      depositState.paymentDetail.wallet_address.length > 15
                        ? depositState.paymentDetail.wallet_address.substring(0, 15) + "..."
                        : depositState.paymentDetail.wallet_address
                    }}</span>
                    <q-icon name="fa-solid fa-copy" @click="copyMessage(depositState.paymentDetail.wallet_address)" />
                  </li>
                  <img
                    v-if="depositState.paymentDetail.qrcode_image_id !== 0"
                    :src="depositState.paymentDetail.imgUrl"
                    alt=""
                    class="w-full md:w-64"
                  />
                </ul>
              </div>
              <div v-if="hasFee(depositState.paymentDetail)" class="col-12 col-sm-12 mr-16">
                <div class="form-title label col-12">
                  {{ $t("member.deposit.handlingFee") }}
                  ：
                  <span>
                    {{
                      depositState.paymentDetail.fee_type === FEE_TYPE.Enums.Amount
                        ? depositState.paymentDetail.fee_amount
                        : `${depositState.paymentDetail.fee_rate}%`
                    }}
                  </span>
                </div>
              </div>
            </div>
            <div class="form-item row" v-else-if="depositState.usingFundType === 'CryptoPayment'">
              <div class="col-12 col-sm-12 mr-16">
                <div class="form-title label col-12">{{ $t("member.deposit.depositInfo") }}</div>
                <ul class="deposit-content col-12">
                  <li>
                    <span class="title">{{ $t("member.deposit.currencyBrand") }}</span>
                    <!-- <span>{{ 'USDT' }}</span> -->
                    <span>{{ depositState.paymentDetail.currency_brand }}</span>
                  </li>
                </ul>
              </div>
              <div v-if="hasFee(depositState.paymentDetail)" class="col-12 col-sm-12 mr-16">
                <div class="form-title label col-12">
                  {{ $t("member.deposit.handlingFee") }}
                  ：
                  <span>
                    {{
                      depositState.paymentDetail.fee_type === FEE_TYPE.Enums.Amount
                        ? depositState.paymentDetail.fee_amount
                        : `${depositState.paymentDetail.fee_rate}%`
                    }}
                  </span>
                </div>
              </div>
            </div>
            <!-- amount -->
            <div class="form-item row">
              <div class="row col-12">
                <div class="form-title label col-12">{{ $t("member.deposit.depositAmount") }}</div>
                <div class="input-content deposit-input col-12">
                  <q-input
                    v-model="depositState.form.amount"
                    :rules="[Rules.required()]"
                    @keypress="Rules.validatePositiveNumber"
                    lazy-rules
                    :placeholder="`${depositState.paymentDetail.deposit_min} ~ ${depositState.paymentDetail.deposit_max}`"
                  />
                  <ul v-show="depositState.paymentDetail.usdt_rate">
                    <li>
                      <span>{{ `${$t("member.withdrawal.rate")}: ` }}</span>
                      <span>{{ depositState.paymentDetail.usdt_rate }}</span>
                    </li>
                    <li>
                      <span>{{ `${$t("member.withdrawal.actualAmount")}: ` }}</span>
                      <span>{{ rateResult }}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="form-item mb-8">
              <div class="flex justify-start flex-wrap gap-3 px-2">
                <q-btn
                  v-for="item in depositState.quickBtns"
                  :key="item"
                  color="quick"
                  text-color="black"
                  class="quickBtns"
                  @click="handleDepositQuickBtnClick(item)"
                >
                  {{ item }}
                </q-btn>
              </div>
            </div>

            <!-- 額外欄位 -->
            <div class="form-item row" v-if="depositState.paymentDetail.extra_field_key">
              <div class="row col-12 col-sm-6">
                <div class="form-title label col-12">{{ $t("bank_column.client_Info") }}</div>
                <div
                  class="input-content col-12"
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
                    class="form-input"
                  ></ExtraInput>

                  <!-- 下拉選單類型 -->
                  <ExtraSelect
                    v-else-if="field.type === FIELD_TYPE.Enums.Select"
                    v-model="depositState.form[depositState.paymentDetail.extra_field_key][field.field_name]"
                    :field="field"
                    optionStyle="option-style"
                    class="form-input"
                  ></ExtraSelect>

                  <!-- 其他 -->
                  <ExtraInput
                    v-else
                    v-model="depositState.form[depositState.paymentDetail.extra_field_key][field.field_name]"
                    :field="field"
                    class="form-input"
                  ></ExtraInput>
                </div>
              </div>
            </div>

            <!-- 活動 -->
            <div class="mb-5 form-item row" v-if="depositState.promotion_list.length > 0">
              <div class="form-title label col-12">{{ $t("member.deposit.depositReward") }}</div>
              <div class="form-promo">
                <PromotionList
                  v-for="item in depositState.promotion_list"
                  :key="item.id"
                  :item="item"
                  :activeId="depositState.form.promotion_id"
                  @click="handlePromotionClick(item.id)"
                ></PromotionList>
              </div>
            </div>

            <!-- 存款備註 -->
            <div
              class="mb-5 form-item row"
              v-if="depositState.paymentDetail.extra_remark && depositState.paymentDetail.extra_remark.length > 0"
            >
              <div class="form-title label col-12">{{ $t("member.deposit.remark") }}</div>
              <div class="form-remark">
                <div
                  v-for="(item, index) in depositState.paymentDetail.extra_remark"
                  :key="index"
                  class="form-remark-item"
                >
                  <div class="form-remark-title">{{ item.titles.find((lang) => lang.lang === nowLang)?.title }}</div>
                  <div class="form-remark-input">
                    <q-input outlined dense v-model="item.content" />
                  </div>
                </div>
              </div>
            </div>

            <div class="form-item row" v-if="depositState.uploadConfig.uploadSwitch">
              <div class="form-title label col-12">{{ $t("tableHeader.uploadDetail") }}</div>
              <div class="uploaded">
                <div class="item" v-for="(item, index) in depositState.uploadConfig.images" :key="index">
                  <img @click="showBiggerImage(item.image.base64)" :src="item.image.base64" alt="" />
                  <q-btn
                    color="red"
                    rounded
                    dense
                    icon="delete"
                    class="delete-btn"
                    size="sm"
                    @click="handleDepositUploadImageDelete(index)"
                  ></q-btn>
                </div>
              </div>
            </div>
            <div class="form-item row" v-if="depositState.uploadConfig.uploadSwitch">
              <div class="upload-area" @click="openUploader()">
                <q-icon name="add" size="32px"></q-icon>
                <div class="warning">
                  {{ $t("member.deposit.depositDetailUploadWarning", { mb: maxSizeInMb }) }}
                </div>
              </div>
            </div>

            <div class="action-btns row justify-center">
              <q-btn
                color="primary"
                :label="$t('common.btn.confirm')"
                class="submit-btn text-capitalize"
                type="submit"
              />
            </div>
          </div>
        </div>
      </q-form>
    </div>
  </div>
  <q-dialog v-model="imageDialogOpen">
    <q-card>
      <q-card-section class="flex justify-center">
        <img :src="previewImage" class="preview-image max-w-full max-h-[80vh]" />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script lang="ts" setup>
import { useDebounceFn } from "@vueuse/core"
import { useSiteImg } from "app/template/okbet_green/hooks/useSiteImg"
import { useQuasar } from "quasar"
import ExtraInput from "src/common/components/ExtraInput/Index.vue"
import ExtraSelect from "src/common/components/ExtraInput/Select.vue"
import HeaderTitleBack from "src/common/components/modal/HeaderTitleBack.vue"
import { useBank } from "src/common/composables/useBank"
import { useLanguage } from "src/common/composables/useLanguage"
import { useTelegram } from "src/common/composables/useTelegramMiniApp"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useVip } from "src/common/composables/useVip"
import { useAuth } from "src/common/hooks/useAuth"
import { useAIHelperEvent } from "src/common/hooks/useAIHelperEvent"
import { useCommon } from "src/common/hooks/useCommon"
import { usePayment } from "src/common/hooks/usePayment"
import { useRule } from "src/common/hooks/useRule"
import { AI_HELPER_EVENT_ROUTES, FEE_TYPE, FIELD_TYPE } from "src/common/utils/constants"
import { computed, onMounted, onUnmounted, ref, watch } from "vue"
import { useI18n } from "vue-i18n"
import { useRouter } from "vue-router"
import FooterNav from "../../components/Footer/FooterNav.vue"
import PromotionList from "./components/PromotionList.vue"
import { useCommonImg } from "src/common/hooks/useCommonImg"

const { isTelegramMiniApp, listenPreventOverflow, removeListenPreventOverflow } = useTelegram()
const { userWalletMap, userInfo2, getUserInfo2, activeWalletCurrencyCode } = useUserInfo()
const { memberImg } = useSiteImg()
const { copyMessage, preciseMultiply, uploadImage } = useCommon()
const { userStatistics, handleUserStatistics } = useVip()
const $q = useQuasar()
const { t } = useI18n()
const Rules = useRule()
const {
  depositState,
  typeI18n,
  getPromotionList,
  getDepositPaymentList,
  handleDepositCurrencyClick,
  handleDepositFundTypeClick,
  handleDepositPaymentClick,
  handleDepositQuickBtnClick,
  handlePromotionClick,
  handleDepositUploadImageDelete,
  handleDepositSubmit: originalHandleDepositSubmit,
  formatterCurrency,
  currencyList
} = useBank()

const { auth } = useAuth()
const router = useRouter()
const { hasFee } = usePayment()
const { nowLang } = useLanguage()
const { handleAIHelperRouteEvent } = useAIHelperEvent()
const { openUploader, uploadInit, maxSizeInMb } = uploadImage()

const isFirstDeposit = ref(false)
const imageDialogOpen = ref(false)
const forbiddenDeposit = ref(false)
const previewImage = ref("")
const { commonResult } = useCommonImg()

const showBiggerImage = (base64: string) => {
  imageDialogOpen.value = true
  previewImage.value = base64
}

const rateResult = computed(
  () => `${preciseMultiply(Number(depositState.form.amount), Number(depositState.paymentDetail.usdt_rate))}`
)

const showCurrencyArea = computed(() => {
  const userWalletMapLength = Object.keys(userWalletMap.value).length
  return depositState.supportedCurrency.length > 1 || userWalletMapLength > 1
})

const handleDepositSubmit = async () => {
  await getUserInfo2()
  // 檢查是否正確選擇 payment gateway id
  if (depositState.form.payment_gateway_id == 0 || depositState.form.currency == "") {
    $q.notify({
      type: "negative",
      message: t("common.validate.verificationError"),
      position: "top",
      timeout: 1000
    })
    return
  }

  console.log(userInfo2.value.deposit_enabled)
  // 檢查是否可以入款
  if (!userInfo2.value.deposit_enabled) {
    $q.notify({
      type: "negative",
      message: t("common.validate.depositEnabled"),
      position: "top",
      timeout: 1000
    })
    return
  }

  // 檢查是否首存開關是否打開
  if (depositState.paymentDetail.enable_first_deposit_check) {
    // 檢查是否第一次存款, 並且首存金額小於最低金額
    if (
      isFirstDeposit.value &&
      Number(depositState.form.amount) < Number(depositState.paymentDetail.first_deposit_min)
    ) {
      $q.notify({
        type: "negative",
        message: t("common.validate.firstDepositMin", { min: depositState.paymentDetail.first_deposit_min }),
        position: "top",
        timeout: 1000
      })
      return
    }
  }
  depositState.form.images = depositState.uploadConfig.images.map((item) => item.image.base64)

  let { status } = await originalHandleDepositSubmit()
  depositState.form.amount = ""
  if (status) router.push({ name: "orders", query: { search_type: 1 } })
}

onMounted(async () => {
  $q.loading.show()
  uploadInit(depositState.uploadConfig.images, 5) // 上傳組件初始化config
  handleAIHelperRouteEvent(AI_HELPER_EVENT_ROUTES.Enums.DEPOSIT)
  await getDepositPaymentList()
  await listenPreventOverflow()
  await getPromotionList()

  console.log(userInfo2.value)

  $q.loading.hide()
})

onUnmounted(() => {
  removeListenPreventOverflow()
})

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

watch(
  () => depositState.form.currency,
  async () => {
    const currency_id = currencyList.value.find((e) => e.label === depositState.form.currency)?.value
    await handleUserStatistics(currency_id)
    isFirstDeposit.value = Number(userStatistics.value.total_deposit) === 0
    console.log(isFirstDeposit.value)
  }
)

defineExpose({
  showBiggerImage,
  imageDialogOpen,
  previewImage
})
</script>

<style lang="sass" scoped>
@import "src/common/css/_variable.sass"
@import "src/css/form.sass"
@import "app/template/okbet_green/assets/css/_variable.sass"
@import "app/template/okbet_green/assets/css/button.scss"
@import "app/template/okbet_green/assets/css/member.scss"

// common style
.option-style
  color: #000
// 上傳組件樣式
.preview-image
  width: 50vw
  height: auto
  +iphone-width
    width: 100vw
.uploaded
  @apply grid grid-cols-3 gap-4
  .item
    @apply relative
    @apply border border-black/20 rounded overflow-hidden
    width: 200px
    height: 200px
    img
      @apply w-full
    .delete-btn
      @apply p-2 absolute right-4 bottom-4
  +iphone-width
    @apply grid grid-cols-1 gap-4
    .item
      width: 300px
      height: auto
      margin: 0 auto

.upload-area
  color: #000
  margin: 1rem 0
  @apply aspect-video bg-black/5 rounded
  @apply flex flex-col gap-2 px-4 items-center justify-center cursor-pointer
  @apply hover:bg-black/15 border-dashed border border-black/50
  @apply break-all
  .warning
    @apply text-sm

// 表格樣式
.form-input
  @apply w-full
  +phone-width
    padding-bottom: 0.625rem
    margin-bottom: 0
  :deep(.q-icon)
    color: dimgrey
  :deep(.q-field__control)
    min-height: 45px
    height: 100%
    border-bottom: .0625rem solid #dee3f026
    border-radius: .5rem
    color: $primary-color
    .q-field__control-container
      padding: 0
    .q-field__native
      height: 100%
      color: dimgrey
      .q-field__input
        color: dimgrey
    .q-field__label
      height: 100%
      color: dimgrey
    .q-field__append
      height: 100%
      line-height: 100%
    &::after
      height: 100%
.input-content
  font-family: Helvetica
  ::v-deep(.q-field__control)
    border-radius: 0px
    border: 0px
    border-bottom: 2px solid $border-pale-gray-color
.triangle
  width: 0
  height: 0
  border-top: 0px solid transparent
  border-right: 0px solid transparent
  border-bottom: 25px solid $primary-color
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

.bg-quick
  color: #FFFFFF !important
  padding: .5rem
  min-width: 3.75rem !important
  width: auto !important
  border-radius: .5rem
  background: #4CAA60

// h5 mode
.deposit-layout.h5
  width: 100%
  display: inline-grid
  row-gap: 1rem
  overflow: hidden
  background-color: $background-pale-gray-color
  padding-bottom: 6rem
  @include phone-width
    row-gap: 0.5rem
  .action-btns
    margin: 0.5rem 0.5rem 1rem 0.5rem
    .submit-btn
      font-family: serif
      width: 100%
  .deposit-container
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
      flex-flow: wrap
      flex: 1 1 0%
      font-size: 1.75rem
      line-height: 2.5rem
      color: $text-steel-blue-color
      box-shadow: rgba($box-shadow-soft-blue-gray-color, 0.12) 0px 4rem 10rem, rgba($box-shadow-light-color, 0.8) 0rem 2rem 2rem inset
      &.row-center
        justify-content: center !important
      +phone-width
        padding-left: 0.6875rem
        padding-right: 0.6875rem
        min-height: 5rem
        height: auto
        font-size: 1rem
        line-height: 1.375rem
        width: 100vw
        &.read-only
          min-height: 5rem
      .info-title
        font-family: Helvetica
        width: 100%
        text-transform: capitalize
        border-bottom: 1px solid $border-pale-gray-color
        padding-bottom: 0.8rem
        +phone-width
          padding-bottom: 0.4rem

      .info-content
        font-family: Helvetica
        color: $text-sky-gray-color
        width: 100%
        overflow: hidden
        text-overflow: ellipsis
        white-space: nowrap
        display: flex
        flex-wrap: wrap
        align-items: center
        gap: 1.563vw
        &.normal
          ::v-deep(.q-btn)
            word-break: break-word
            overflow-wrap: break-word
            hyphens: auto
            text-transform: none
            display: flex
            -webkit-box-align: center
            align-items: center
            padding: 0px 10px
            position: relative
            width: calc(33.33% - 0.2rem)
            height: 20px
            font-size: 1rem
        &.currency
          ::v-deep(.q-btn)
            @apply whitespace-normal
            word-break: break-word
            overflow-wrap: break-word
            hyphens: auto
            text-transform: none
            display: flex
            -webkit-box-align: center
            align-items: center
            border: 2px solid $border-pale-gray-color !important
            border-radius: 10px
            padding: 0
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
            .q-btn__content
              width: 100%
              height: 100%
              div
                background-repeat: no-repeat
                background-position: center
                background-size: cover
        .deposit-content
          width: 100%
          max-width: 400px
          height: auto
          padding: 0.5rem
          list-style: none
          li
            @apply flex justify-start my-2 p-2
            align-items: center
            background: $background-light-color
            border: 2px solid $border-pale-gray-color
            border-radius: 0.2rem
            color: $primary-color
            i
              margin: 0 5px
              color: $text-danger-tertiary-color
              font-size: 1.2rem
              cursor: pointer
              padding: 0
            span
              font-family: Helvetica
              color: $text-dark-color
              font-size: 0.8rem
              &.title
                font-size: 1rem
                color: $primary-color
                margin-right: 0.5rem
          +phone-width
            padding: 0.5rem 0
        .bank-content
          width: 100%
          max-width: 400px
          height: auto
          padding: 0.625rem 0
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
              color: $primary-color
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

// pc mode
.deposit-layout.pc
  width: 55rem
  height: 100%
  padding: 4.375rem 3.125rem 1.875rem

  .deposit-header
    @apply w-full flex justify-between items-center
    .title-img
      width: 10.5625rem
      height: auto
  .deposit-body
    color: $text-light-color
    max-width: 62.5rem
    margin-top: 1.5625rem
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
      border: 2px solid #CADDC9
      border-radius: 14px
      +iphone-width
        margin-top: 0
        padding: 0
        background: $background-midnight-gray-color
      .form-content
        @apply w-full
        +iphone-width
          width: 100%
          margin: 1rem auto
          padding: 1rem 1.5rem
          background: $background-eclipse-gray-color
          border-radius: .5rem
        .form-item
          .form-title
            @apply p-0 my-4
            font-family: OpenSans
            font-size: 1.2rem
            font-weight: 400
            color: rgba(0, 0, 0, 0.8)
          .form-methods
            @apply flex flex-wrap justify-start gap-1
            padding-left: 0.5rem
            width: 100%
            +pad-width
              width: 100%
            +phone-width
              @apply grid-cols-3
            .method-item
              @apply relative w-auto flex justify-center items-center rounded-md p-0 cursor-pointer
              height: 90px
              // max-width: 45%
              margin-right: .5rem
              padding: 0.2rem
              border: 1px solid #50945B
              +pad-width
                height: 4rem
                max-width: fit-content
              +iphone-width
                width: 100%
                height: auto
              &.active
                background: #50945B
                color: $text-light-color
          .input-content
            padding-left: 0.75rem
            :deep(.q-field__control)
              font-family: Helvetica
              border: 0px !important
            :deep(.q-field--disabled)
              .q-field__control
                div
                  opacity: 1 !important
          .deposit-content
            width: 100%
            max-width: 400px
            height: auto
            list-style: none
            padding: 0.5rem
            li
              @apply flex justify-start my-2 p-2
              align-items: center
              background: $background-light-color
              border: 2px solid $border-pale-gray-color
              border-radius: 0.2rem
              color: $primary-color
              i
                margin: 0 5px
                color: $text-danger-tertiary-color
                font-size: 1.2rem
                cursor: pointer
              span
                font-family: Helvetica
                color: $text-dark-color
                font-size: 0.8rem
                &.title
                  font-size: 1rem
                  color: $primary-color
                  margin-right: 0.5rem
          .bank-content
            width: 100%
            max-width: 400px
            height: auto
            padding-left: 0.5rem
            list-style: none
            li
              @apply flex justify-start my-2 p-2
              align-items: center
              background: $background-light-color
              border: 2px solid $border-pale-gray-color
              border-radius: 0.2rem
              color: $text-dark-color
              span
                font-family: Helvetica
              i
                margin: 0 5px
                color: $primary-color
                font-size: 1.2rem
                cursor: pointer
          .btn-content
            @apply flex-wrap gap-3
            +setFlex(flex-start)
            flex-wrap: wrap
            padding-top: 1rem
            padding-left: .5rem
            gap: 1.563vw
            ::v-deep(.q-btn)
              word-break: break-word
              overflow-wrap: break-word
              hyphens: auto
              font-family: OpenSans
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
            +iphone-width
              flex-wrap: wrap
              padding-top: 1.125rem
              padding-left: .625rem
              gap: 1.25rem
          &.birth-content
            gap: 1.25rem
            +iphone-width
              gap: 0
              justify-content: space-between
            .month-day-content
              flex-wrap: nowrap
              gap: 1.25rem
              +iphone-width
                @apply grid grid-cols-2
        .action-btns
          .submit-btn
            font-family: Arial
            width: 100%

.quickBtns
  font-family: OpenSans

.form-promo
  @apply flex justify-between
  font-size: .75rem
  gap: .5625rem
  flex-wrap: wrap
  width: 85%
  +phone-width
    width: 100%

.form-remark
  @apply flex flex-col gap-4 pl-[0.5rem]
  color: $text-dark-color
  +phone-width
    @apply w-full pl-0
  .form-remark-item
    @apply flex items-center gap-2
    +phone-width
      @apply flex-col items-start w-full
    .form-remark-title
      @apply min-w-[100px]
      +phone-width
        @apply min-w-[250px]
    .form-remark-input
      +phone-width
        @apply w-full


.deposit-input
  width: 100%
  display: flex
  ul
    color: $text-dark-color
    width: 20rem
    display: flex
    margin: 1rem
    align-content: center
    flex-direction: column
    font-size: 0.8rem
  :deep(.q-field__native)
    font-family: Helvetica !important
    border-radius: 0
    border-bottom: 2px solid #CADDC9
  +phone-width
    :deep(.q-field--with-bottom)
      padding-bottom: 0.625rem
</style>
