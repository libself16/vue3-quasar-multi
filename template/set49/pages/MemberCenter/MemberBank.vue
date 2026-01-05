<template>
  <BannerMember />
  <div class="bank-layout">
    <div class="bank-container">
      <MemberNav />
      <div class="bank-content column">
        <div class="form-title-content">
          <div class="color-label"></div>
          <div class="title">{{ $t("member.bank.withdrawalSettings") }}</div>
        </div>
        <div class="add-content row justify-end items-center">
          <q-btn borderless flat :to="{ name: 'memberBankAdd' }">
            <q-icon name="add_circle_outline" class="add-icon"></q-icon>
            <div class="add-text">{{ $t("common.btn.add") }}</div>
          </q-btn>
        </div>
        <div class="card-container">
          <div v-for="item in bankCardState.list" :key="item.id" class="card">
            <div class="card-title">
              <div class="title-text">{{ item.name }}</div>
              <div class="more-container ">
                <q-icon name="more_vert" class="more-icon"> </q-icon>
                <div class="more-content bg-[#650E0E]">
                  <q-btn
                    icon="border_color"
                    flat
                    size="sm"
                    class="px-0 bg-[#650E0E] text-white"
                    :to="{ name: 'memberBankAdd', params: { id: item.id } }"
                  ></q-btn>
                  <q-btn icon="delete" flat size="sm" class="px-0 bg-[#650E0E] text-white" @click="removeBankCard(item.id)"></q-btn>
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
  </div>
</template>
<script lang="ts" setup>
import BannerMember from "app/template/set49/components/BannerMember.vue"
import { useQuasar } from "quasar"
import MemberNav from "src/common/components/MemberNav.vue"
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
  $q.dark.set(true)
})

onUnmounted(() => {
  $q.dark.set(false)
})
</script>

<style lang="sass" scoped>
@import 'src/common/css/_variable.sass'
@import 'src/css/form.sass'
@import 'app/template/set49/assets/css/_variable.scss'

// layout style
.bank-layout
  @apply pt-12
  +iphone-width
    padding-top: 0
  .bank-container
    color: white
    overflow: hidden
    max-width: 62.5rem
    margin: 0 auto
    +iphone-width
      padding: 0
    .bank-content
      width: 100%
      border-radius: 8px
      background: $primary-modal-bg
      padding: 3rem
      +iphone-width
        margin-top: 0
        padding: 0
        .form-title-content
          .title
            @apply whitespace-nowrap text-[1rem]
      .add-content
        cursor: pointer
        margin-bottom: 1.5rem
        color: $white-7
        &:hover
          color: #fff
        +iphone-width
          margin-right: 1.875rem
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
          background-color: $primary-modal-bg
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
          border: 2px solid $primary-btn-bg
          +iphone-width
            width: 80%
            margin: 1rem auto
          .card-title
            @apply mb-4
            +setFlex(space-between)
            width: 100%
            padding-left: 1rem
            background: $primary-btn-bg
            +iphone-width
              padding-left: 1rem
            .title-text
              color: $white-7
              font-family: "Century Gothic"
              font-size: 1rem
              font-weight: 700
              position: relative
              +iphone-width
                font-size: 1rem
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
                background-color: #650E0E
                border-radius: 4px
                color: #828282
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
            gap: 1.75rem
            align-items: flex-start
            margin-top: .25rem
            width: 100%
            font-size: .875rem
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
    background: $primary-btn-bg!important
</style>
