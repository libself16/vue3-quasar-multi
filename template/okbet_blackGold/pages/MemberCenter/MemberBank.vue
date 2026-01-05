<template>
  <HeaderTitleBack v-if="$q.platform.is.mobile" titleI18n="member.bank.title" variant="blackGold">
    <q-form class="bank-layout h5">
      <div class="bank-container">
        <!-- card -->
        <div class="info-row">
          <div class="info-content normal flex-row col-12 col-sm-10">
            <div class="card-container">
              <div class="add-content row justify-end items-center">
                <q-btn
                  v-if="envInfo.member_bank_edit === MEMBER_BANK_EDIT.Enums.OPEN"
                  borderless flat
                  :to="{ name: 'memberBankAdd' }"
                >
                  <q-icon name="add_circle_outline" class="add-icon"></q-icon>
                  <div class="add-text">{{ $t("common.btn.add") }}</div>
                </q-btn>
              </div>
              <BankCard
                v-for="(item, key) in bankCardState.list"
                :key="key"
                :card="item"
                :activeId="0"
                :bankList="bankList"
                :gatewayFilterList="gatewayFilterList"
                @updateList="getBankCardList"
              />
              <!-- <div v-for="item in bankCardState.list" :key="item.id" class="card">
                <div class="card-title">
                  <div class="title-text">{{ item.name }}</div>
                  <div class="more-container">
                    <q-icon name="more_vert" class="more-icon" @click="handleOpen"> </q-icon>
                    <div class="more-content" :class="{ active: isOpen }">
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
                  <div class="content-value">{{ item.bank_name }}</div>
                </div>
                <div class="card-content">
                  <div class="content-title">{{ $t("member.bank.accountName") }}</div>
                  <div class="content-value">{{ item.account_name }}</div>
                </div>
                <div class="card-content">
                  <div class="content-title">{{ $t("member.bank.accountNumber") }}</div>
                  <div class="content-value">{{ item.account_number }}</div>
                </div>
              </div> -->
            </div>
          </div>
        </div>
      </div>
    </q-form>
  </HeaderTitleBack>
  <div v-else class="bank-layout pc">
    <div class="bank-container">
      <div class="bank-header">
        <p class="bank-header-title">{{ $t("menu.bank") }}</p>
      </div>
      <div class="bank-body column">
        <div class="profile-form column">
          <div class="add-content row justify-end items-center">
            <q-btn
              v-if="envInfo.member_bank_edit === MEMBER_BANK_EDIT.Enums.OPEN"
              borderless
              flat
              :to="{ name: 'memberBankAdd' }"
            >
              <q-icon name="add_circle_outline" class="add-icon"></q-icon>
              <div class="add-text">{{ $t("common.btn.add") }}</div>
            </q-btn>
          </div>
          <div class="card-container">
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
import { useSiteImg } from "app/template/okbet_blackGold/hooks/useSiteImg"
import { useQuasar } from "quasar"
import HeaderTitleBack from "src/common/components/modal/HeaderTitleBack.vue"
import { useBank } from "src/common/composables/useBank"
import { MEMBER_BANK_EDIT } from "src/common/utils/constants"
import { onMounted, ref } from "vue"
import { useI18n } from "vue-i18n"
import { useEnvInfoStore } from "src/stores/envStore"
import BankCard from "./components/BankCard.vue"

// import MemberNav from "./components/MemberNav.vue"

const { memberImg } = useSiteImg()
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
@import 'src/common/css/_variable.sass'
@import "app/template/okbet_blackGold/assets/css/_variable.sass"
@import 'src/css/form.sass'

// h5 mode
.bank-layout.h5
  width: 100%
  display: inline-grid
  row-gap: 1rem
  overflow: hidden
  background-color: $quaternary-black-color
  @include phone-width
    height: calc(100dvh - 2.875rem)
    background-color: #fff
    row-gap: 0.5rem
  .action-btns
    margin: 0.5rem 0.5rem 1rem 0.5rem
    .submit-btn
      width: 100%
  .bank-container
    width: 100%
    list-style: none
    background: $quaternary-black-color
    box-sizing: border-box
    overflow: auto
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
      color: rgb(108, 123, 168)
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
        border-bottom: 1px solid rgb(227, 232, 238)
        padding-bottom: 0.8rem
      .info-content
        color: rgb(167, 178, 196)
        width: 100%
        overflow: hidden
        text-overflow: ellipsis
        white-space: nowrap
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
            border: 2px solid rgb(231, 234, 241) !important
            border-radius: 10px
            padding: 0px 12px
            position: relative
            width: 110px
            height: 75px
            font-size: 1rem
            background: #fff !important
            color: rgb(68, 78, 87) !important
            overflow: hidden
            &.active
              border: 2px solid rgb(2, 91, 232) !important
              color: rgb(2, 91, 232) !important
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
            background: #fff
            border: 2px solid rgb(231, 234, 241)
            border-radius: 0.2rem
            color: #000
            i
              margin: 0 5px
              color: #d50c14
              font-size: 1.2rem
              cursor: pointer
              padding: 0
        .q-icon
          margin-left: 1.25rem
          margin-right: 0.625rem
          +phone-width
            margin-left: 0.6875rem
            margin-right: 0.375rem
            +setFlex(flex-start)
    .q-separator
      margin-left: 1.75rem
      margin-right: 1.75rem
      height: 1px
      background-color: rgb(227, 232, 238)
      @include phone-width
        margin-left: 14px
        margin-right: 14px

// pc mode
.bank-layout.pc
  // padding-top: 6vw
  +iphone-width
    padding-top: 0
  .bank-container
    width: 55rem
    height: 100%
    padding: 4.375rem 3.125rem 1.875rem
    .bank-header
      @apply w-full flex justify-between items-center
      .bank-header-title
        @apply font-extrabold text-[3.125rem]
        color: $primary-white-color
        font-family: "NotoSansTC"
    .bank-body
      color: white
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
        border: 1px solid rgba(146, 146, 146, 0.57)
        border-radius: 14px
        +iphone-width
          // width: 100%
          margin-top: 0
          padding: 0
          background: #24262B
.add-content
  cursor: pointer
  margin-bottom: 1.5rem
  color: rgb(2, 91, 232)
  +iphone-width
    margin-right: 1.875rem
    margin-bottom: 0rem
    width: 100%
  .add-icon
    font-size: 1.25rem
    margin-right: .25rem
    color: $secondary-gold-color
    +iphone-width
      font-size: 1.25rem
      margin-right: .25rem
  .add-text
    font-size: 1.125rem
    color: $secondary-gold-color
    +iphone-width
      font-size: 1.125rem
.card-container
  color: rgb(68, 78, 87)
  width: 100%
  padding: 1rem 0.5rem
  @apply grid grid-cols-2 gap-5
  +pad-width
    @apply grid-cols-2
  +iphone-width
    @apply flex flex-col items-start
    width: 100%
    margin: 1rem auto
    padding: .75rem 0
    overflow: auto
    +hideScrollBar
</style>
