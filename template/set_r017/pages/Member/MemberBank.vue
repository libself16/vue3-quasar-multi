<template>
  <div class="bank-layout">
    <div class="bank-container">
      <div class="bank-header">
        <span>{{ $t("member.deposit.bankAccount") }}</span>
        <div class="add-content row justify-end items-center">
          <q-btn
            class="add-button"
            v-if="envInfo.member_bank_edit === MEMBER_BANK_EDIT.Enums.OPEN"
            borderless
            flat
            :to="{ name: 'memberBankAdd' }"
          >
            <p class="add-text">{{ $t("common.btn.add") }}</p>
          </q-btn>
        </div>
      </div>
      <div class="bank-body column">
        <div class="profile-form column">
          <div v-if="bankCardState.list.length === 0" class="no-data-container">
            <img :src="orderImg('no-data.svg')" alt="no-data" class="no-data-img" />

            <span>{{ $t("tableHeader.noData") }}</span>
          </div>
          <div v-else class="card-container">
            <BankCard
              v-for="(item, key) in bankCardState.list"
              :key="key"
              :card="item"
              :activeId="0"
              :bankList="bankList"
              :gatewayFilterList="gatewayFilterList"
              @updateList="getBankCardList"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useQuasar } from "quasar"
import HeaderTitleBack from "src/common/components/modal/HeaderTitleBack.vue"
import { useBank } from "src/common/composables/useBank"
import { useSiteImg } from "src/common/hooks/useSiteImg"
import { onMounted, ref } from "vue"
import { useI18n } from "vue-i18n"
import BankCard from "./components/BankCard.vue"
import { MEMBER_BANK_EDIT } from "src/common/utils/constants"
import { useEnvInfoStore } from "src/stores/envStore"

// import MemberNav from "./components/MemberNav.vue"

const { orderImg } = useSiteImg()
const { t } = useI18n()
const { envInfo } = useEnvInfoStore()
const $q = useQuasar()
const {
  bankCardState,
  getBankCardList,
  handleBankCardDelete,
  bankList,
  gatewayFilterList,
  getBankList,
  getGatewayList
} = useBank()

const isOpen = ref(false)

const handleOpen = () => {
  isOpen.value = !isOpen.value
}

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

onMounted(async () => {
  await getGatewayList()
  await getBankList()
  getBankCardList()
})
</script>

<style lang="sass" scoped>
@import "src/common/css/_variable.sass"
@import "app/template/set_r017/assets/css/_variable.scss"

.no-data-container
  @apply w-full flex flex-col justify-center items-center py-40
  span
    color: var(--text-03)
    margin-top: 1.25rem
    font-size: 0.875rem
    font-weight: 700

  .no-data-img
    width: 10rem

.bank-layout
  width: 100%
  height: 100%
  min-height: 600px
  border-radius: 12px
  background: var(--bg-11)
  padding: 20px
  gap: 10px
  flex: 1 0 0
  +phone-width
    background: transparent
    padding: 0
  .bank-container
    +setFlex
    flex-direction: column
    // width: 55rem
    // height: 100%
    .bank-header
      @apply w-full flex justify-between items-center
      span
        color: $neutral01
        font-family: "Noto Sans"
        font-size: 1.2rem
        font-style: normal
        font-weight: 700
        line-height: normal
        text-transform: capitalize
    .bank-body
      color: $neutral01
      width: 100%
      max-width: 560px
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
        border-radius: 14px
.add-content
  cursor: pointer
  color: $emotional07
  .add-icon
    font-size: 1.25rem
    margin-right: .25rem
    +iphone-width
      font-size: 1.25rem
      margin-right: .25rem
  .add-button
    +setFlex
    height: 36px
    padding: 10px
    gap: 4px
    border-radius: 4px
    background: linear-gradient(90deg, var(--btn-bg-01) 0%, var(--btn-bg-02) 100%)
    color: var(--btn-text-01, #FFF)
  .add-text
    font-size: 12px
.card-container
  color: $neutral07
  padding-top: 0.5rem
  width: 100%
  @apply grid grid-cols-2 gap-2
  +pc-width
    @apply grid-cols-2
  +iphone-width
    @apply grid-cols-1
    width: 100%
    height: auto
    margin: 0 auto
    padding: 0
    +hideScrollBar
  // .card
  //   width: 100%
  //   padding-bottom: 1.125rem
  //   border-radius: 8px
  //   border: 2px solid $neutral02
  //   +iphone-width
  //     width: 100%
  //     margin: 0rem auto
  //   .card-title
  //     +setFlex(space-between)
  //     width: 100%
  //     padding-left: 1rem
  //     background: $emotional07
  //     border-top-left-radius: 6px
  //     border-top-right-radius: 6px
  //     +iphone-width
  //       padding-left: 1rem
  //     .title-text
  //       color: $neutral01
  //       font-size: 1rem
  //       font-weight: 700
  //       position: relative
  //       +iphone-width
  //         font-size: 1rem
  //     .more-container
  //       position: relative
  //       padding: 1rem
  //       +iphone-width
  //         padding: 1rem
  //       .more-icon
  //         font-size: 1.25rem
  //         color: $neutral01
  //       .more-content
  //         background-color: $neutral01
  //         border-radius: 4px
  //         color: $neutral03
  //         display: none
  //         flex-direction: column
  //         padding: .75rem
  //         gap: 1.0625rem
  //         font-size: 1.25rem
  //         position: absolute
  //         left: 0%
  //         top: 100%
  //         display: none
  //         cursor: pointer
  //         &.active
  //           display: flex
  //         +iphone-width
  //           font-size: 1.25rem
  //           left: 0
  //           top: 100%
  //   .card-content
  //     +setFlex()
  //     gap: 1.75rem
  //     margin-top: .75rem
  //     width: 100%
  //     font-size: .875rem
  //     +iphone-width
  //       margin-top: .75rem
  //       gap: 1.6875rem
  //       font-size: .875rem
  //     .content-title
  //       width: 50%
  //       text-align: right
  //     .content-value
  //       width: 50%
  //       word-wrap: break-word
  //       overflow-wrap: break-word
</style>
