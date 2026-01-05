<template>
  <div class="order-wrapper">
    <BackBtn />
    <div class="order-content">
      <div class="order-header">
        <h2 class="order-title">{{ $t("member.bank.withdrawalSettings") }}</h2>
        <div class="add-content row justify-end items-center">
          <q-btn borderless flat :to="{ name: 'memberBankAdd' }">
            <q-icon name="add_circle_outline" class="add-icon"></q-icon>
            <div class="add-text">{{ $t("common.btn.add") }}</div>
          </q-btn>
        </div>
      </div>
      <div class="card-container">
        <div v-for="item in bankCardState.list" :key="item.id" class="card">
          <div class="card-title">
            <div class="title-text">{{ item.name }}</div>
            <div class="more-container">
              <q-icon name="more_vert" class="more-icon"> </q-icon>
              <div class="more-content">
                <q-btn
                  icon="border_color"
                  flat
                  size="sm"
                  class="px-0 bg-[#6A6A6A] text-white"
                  :to="{ name: 'memberBankAdd', params: { id: item.id } }"
                />
                <q-btn
                  icon="delete"
                  flat
                  size="sm"
                  class="px-0 bg-[#6A6A6A] text-white"
                  @click="removeBankCard(item.id)"
                />
              </div>
            </div>
          </div>
          <div class="card-content">
            <div class="content-title">{{ $t("tableHeader.currency") }}</div>
            <div class="content-value">{{ item.currency_code }}</div>
          </div>
          <div class="card-content">
            <div class="content-title">{{ $t("member.bank.bankName") }}</div>
            <div class="content-value">
              {{
                item.bank_id === 0 ? item.bank_name : bankList.filter((bank) => bank.value === item.bank_id)[0]?.label
              }}
            </div>
          </div>
          <div class="card-content">
            <div class="content-title">{{ $t("member.bank.accountName") }}</div>
            <div class="content-value">{{ item.account_name }}</div>
          </div>
          <div class="card-content">
            <div class="content-title">{{ $t("member.bank.accountNumber") }}</div>
            <div class="content-value">{{ item.account_number }}</div>
          </div>
          <div class="card-content" v-if="item.payment_gateway_id">
            <div class="content-title">{{ $t("member.bank.withdrawalChannel") }}</div>
            <div class="content-value">
              {{
                item.payment_gateway_id
                  ? gatewayFilterList.filter((gatewayItem: any) => gatewayItem.value === item.payment_gateway_id)[0]
                      ?.label
                  : ""
              }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import BackBtn from "app/template/set_r016/components/Button/Back.vue"
import { useQuasar } from "quasar"
import { useBank } from "src/common/composables/useBank"
import { onMounted, onUnmounted } from "vue"
import { useI18n } from "vue-i18n"

const { t } = useI18n()
const $q = useQuasar()
const {
  gatewayFilterList,
  getGatewayList,
  bankCardState,
  getBankCardList,
  handleBankCardDelete,
  getBankList,
  bankList
} = useBank()

const removeBankCard = (bankCardId: number) => {
  $q.dialog({
    title: t("member.bank.deleteMessage"),
    // message: t("member.bank.deleteMessage"),
    cancel: true,
    persistent: true
  }).onOk(() => {
    handleBankCardDelete(bankCardId)
  })
}

onMounted(() => {
  getBankCardList()
  getBankList()
  getGatewayList()
})
</script>

<style lang="sass" scoped>
@import 'src/common/css/_variable.sass'
@import 'src/css/form.sass'
@import 'app/template/set_r016/assets/css/_variable.scss'

// layout style
.order-wrapper
  max-width: 75rem
  margin: 1.25rem auto
  +phone-width
    margin: 0
    padding: 0.625rem 0.375rem
  .order-content
    margin-top: 1.25rem
    padding: 3.75rem
    background-color: $primary07
    color: $neutral01
    border-radius: 0.625rem
    +phone-width
      margin-top: 0.625rem
      padding: 1.25rem
    .order-header
      display: block
      +iphone-width
        display: flex
        justify-content: space-between
        align-items: center
    .order-title
      +fontStyle(1.625rem)
      color: $secondary03
      +iphone-width
        display: inline-block
    .add-content
      cursor: pointer
      margin-bottom: 1.5rem
      color: #fff
      +iphone-width
        margin-bottom: 0rem
        display: inline-block
      &:hover
        color: #fff
      .add-icon
        font-size: 1.25rem
        margin-right: .25rem
        +iphone-width
          font-size: 1.25rem
          margin-right: .25rem
      .add-text
        font-size: 1.125rem
        +iphone-width
          font-size: 1.125rem
    .card-container
      @apply grid grid-cols-3 gap-5
      +pad-width
        @apply grid-cols-2
      +iphone-width
        @apply grid-cols-1
        width: 100%
        height: auto
        margin: 1rem auto
        // background-color: $primary-modal-bg
        padding: .75rem 0
        overflow: auto
        +hideScrollBar
      .card
        @apply font-['Century_Gothic']
        width: 100%
        +setFlex()
        flex-direction: column
        justify-content: space-between
        position: relative
        padding-bottom: 1.125rem
        border-radius: 8px
        border: 2px solid $primary05
        +iphone-width
          width: 100%
          margin: 0rem auto
        .card-title
          @apply mb-4
          +setFlex(space-between)
          +fontStyle(1rem)
          width: 100%
          padding-left: 1rem
          background: $primary05
          color: $neutral01
          +iphone-width
            padding-left: 1rem
          .title-text
            position: relative
          .more-container
            position: relative
            padding: 1rem
            +iphone-width
              padding: 1rem
            &:hover
              .more-content
                display: flex
            .more-icon
              font-size: 1.25rem
            .more-content
              background-color: $neutral09
              border-radius: 4px
              display: flex
              flex-direction: column
              padding: .75rem
              gap: 1.0625rem
              font-size: 1.25rem
              position: absolute
              left: -1%
              top: 2.2%
              display: none
              cursor: pointer
              +iphone-width
                font-size: 1.25rem
                left: 0
                top: 9%
        .card-content
          @apply px-4
          +setFlex()
          +fontStyle()
          gap: 1.75rem
          align-items: flex-start
          margin-top: .25rem
          width: 100%
          color: #FFFFFFB2
          +iphone-width
            margin-top: .75rem
            gap: 1.6875rem
            font-size: .875rem
          .content-title
            width: 50%
            text-align: right
          .content-value
            @apply grow max-w-[100px]
            word-wrap: break-word
            overflow-wrap: break-word
        .gateway-name
          padding: 10px
          position: absolute
          right: 0
          bottom: 0

:deep(.nav-content)
  +iphone-width
    background: $primary05 !important
</style>
