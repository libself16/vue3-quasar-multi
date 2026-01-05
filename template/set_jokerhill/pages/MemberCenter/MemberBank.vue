<template>
  <BannerMember />
  <div class="bank-layout">
    <div class="bank-container">
      <MemberNav />
      <div class="form-title-content">
        <img :src="svgIcon('member-title-icon')" />
        <div class="title">{{ $t("member.bank.withdrawalSettings") }}</div>
      </div>
      <div class="bank-content column">
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
              <div class="more-container">
                <q-icon name="more_vert" class="more-icon"> </q-icon>
                <div class="more-content">
                  <q-btn
                    icon="border_color"
                    flat
                    size="sm"
                    class="px-0"
                    :to="{ name: 'memberBankAdd', params: { id: item.id } }"
                  ></q-btn>
                  <q-btn icon="delete" flat size="sm" class="px-0" @click="removeBankCard(item.id)"></q-btn>
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
                    ? gatewayFilterList.filter((gateway: any) => gateway.value === item.payment_gateway_id)[0]?.label
                    : ""
                }}
              </div>
            </div>
            <!-- <span class="gateway-name">{{
              item.payment_gateway_id
                ? gatewayFilterList.filter((gatewayItem: any) => gatewayItem.value === item.payment_gateway_id)[0]
                    ?.label
                : ""
            }}</span> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import BannerMember from "app/template/set_jokerhill/components/BannerMember.vue"
import { useSiteImg } from "app/template/set_jokerhill/hooks/useSiteImg"
import { useQuasar } from "quasar"
import { useBank } from "src/common/composables/useBank"
import { onMounted } from "vue"
import { useI18n } from "vue-i18n"
import MemberNav from "../../components/MemberNav.vue"

const { t } = useI18n()
const { svgIcon } = useSiteImg()
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
@import "../../assets/css/form.sass"
// layout style
.bank-layout
  padding-top: 6vw
  +iphone-width
    padding-top: 0
  .bank-container
    color: #6288D2
    overflow: hidden
    max-width: 68rem
    margin: 0 auto
    +iphone-width
      padding: 0
    .bank-content
      width: 100%
      border-radius: 8px
      background: #fff
      padding: 2rem 2.5rem
      +iphone-width
        margin-top: 0
        padding: 0
        background: #fff
      .add-content
        margin-bottom: 1.5rem
        color: #fff
        :deep(.q-btn)
          cursor: pointer
          border-radius: 24px
          background: #6288D2
          &:hover
            color: $white-7
        +iphone-width
          margin: 1.5rem 1.875rem 0 0
          padding-bottom: 0.5rem
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
          height: 43.125rem
          margin: 0rem auto
          background-color: #fff
          padding: .75rem 0
          overflow: auto
          +hideScrollBar
        .card
          width: 100%
          +setFlex()
          flex-direction: column
          justify-content: space-between
          position: relative
          padding-bottom: 1.125rem
          border-radius: 8px
          border: 2px solid #A2B3D6
          +iphone-width
            width: 80%
            margin: 1rem auto
            max-height: 260px
          .card-title
            +setFlex(space-between)
            width: 100%
            padding-left: 1rem
            background: #A2B3D6
            +iphone-width
              padding-left: 1rem
            .title-text
              color: rgba(255, 255, 255, 0.70)
              font-size: 1rem
              font-weight: 700
              position: relative
              +iphone-width
                font-size: 1rem
            .more-container
              position: relative
              padding: 1rem
              color: #fff
              +iphone-width
                padding: 1rem
              &:hover
                .more-content
                  display: flex
              .more-icon
                font-size: 1.25rem
              .more-content
                background-color: #f2f2f2
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
            +setFlex()
            gap: 1.75rem
            // margin-top: .75rem
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
              width: 50%
              word-wrap: break-word
              overflow-wrap: break-word
          .gateway-name
            padding: 10px
            position: absolute
            right: 0
            bottom: 0
</style>
