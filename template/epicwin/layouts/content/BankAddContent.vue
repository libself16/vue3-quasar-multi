<template>
  <div class="bank-add-content">
    <MemberNav />
    <div class="bank-add-form column">
      <div class="form-title-content">
        <div class="color-label"></div>
        <div class="title">新增編輯</div>
      </div>
      <div class="form-content">
        <div class="form-item row">
          <div class="label col-12">SELECT CURRENCY</div>
          <div class="radio-content col-12">
            <q-radio
              v-for="item in currencyList"
              :key="item"
              dense
              v-model="form.currency"
              :val="item"
              :label="item"
              checked-icon="circle"
            />
          </div>
          <div class="btn-toggle-content col-12">
            <q-btn-toggle
              v-model="form.transferTypeId"
              toggle-color="main"
              toggle-text-color="white-7"
              :options="transferTypes"
            />
          </div>
        </div>
        <div class="form-item row">
          <div class="label col-12">選擇存款方式</div>
          <div class="radio-content col-12 q-mb-md">
            <q-radio
              v-for="item in channels"
              :key="item.id"
              dense
              v-model="form.channelId"
              :val="item.id"
              :label="item.label"
              checked-icon="circle"
            />
          </div>
        </div>
        <div class="form-item row input-row">
          <div class="row col-10 col-sm-5">
            <div class="label col-12">Bank Branch</div>
            <div class="input-content col-12">
              <q-input standout v-model="form.bank" placeholder="Bank Branch" rounded outlined dense borderless />
            </div>
          </div>
          <div class="row col-10 col-sm-5">
            <div class="label col-12">Name</div>
            <div class="input-content col-12">
              <q-input standout v-model="form.name" placeholder="Name" rounded outlined dense borderless />
            </div>
          </div>
        </div>
        <div class="form-item row input-row">
          <div class="row col-10 col-sm-5">
            <div class="label col-12">Bank Account Name</div>
            <div class="input-content col-12">
              <q-input
                standout
                v-model="form.accountName"
                placeholder="Bank Account Name"
                rounded
                outlined
                dense
                borderless
              />
            </div>
          </div>
          <div class="row col-10 col-sm-5">
            <div class="label col-12">Bank Account Number</div>
            <div class="input-content col-12">
              <q-input
                standout
                v-model="form.accountNumber"
                placeholder="Bank Account Number"
                rounded
                outlined
                dense
                borderless
              />
            </div>
          </div>
        </div>

        <div class="action-btns multi-btns row justify-center no-wrap">
          <q-btn text-color="white" label="Cancel" class="cancle-btn" @click="goMemberBank" />
          <q-btn text-color="black" label="SUBMIT" class="submit-btn" @click="addBankCard" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from "vue"
import { useQuasar } from "quasar"
import { useRouter } from "vue-router"
import MemberNav from "src/common/components/MemberNav.vue"
import "vue3-carousel/dist/carousel.css"

const router = useRouter()
const $q = useQuasar()

const form = reactive({
  userName: "",
  firstName: "",
  lastame: "",
  email: "",
  contact: "",
  gender: 0,
  currency: "MYR",
  transferTypeId: 1,
  channelId: 1,
  bank: "",
  name: "",
  accountName: "",
  accountNumber: ""
})

const currencyList = ["MYR", "SGD", "BRL", "PHP"]
const transferTypes = [
  { label: "Bank Transfer", value: 1 },
  { label: "QR Code", value: 2 },
  { label: "E-Wallet", value: 3 },
  { label: "Bitcoin", value: 4 },
  { label: "Apple Pay", value: 5 }
]
const channels = [
  {
    id: 1,
    label: "777pay"
  },
  {
    id: 2,
    label: "Eezie Pay"
  },
  {
    id: 3,
    label: "ONEWALLET"
  },
  {
    id: 4,
    label: "PayTrust 88"
  },
  {
    id: 5,
    label: "WealthPay"
  }
]

const goMemberBank = () => {
  router.push({ name: "memberBankDetail" })
}
const addBankCard = async () => {
  $q.notify({
    color: "green",
    textColor: "white",
    icon: "check",
    message: "新增成功",
    badgeStyle: "opacity: 0"
  })
  router.push({ name: "memberBankAdd" })
}
</script>

<style lang="sass" scoped>
@import 'src/common/css/_variable.sass'
@import 'src/css/form.sass'
// layout style
.bank-add-content
  color: white
  padding: 5vw 0 5vw 12.865vw
  overflow: hidden
  +iphone-width
    padding: 0
  .bank-add-form
    margin-top: 2.083vw
    width: 52.083vw
    border-radius: 8px
    background: #1C1E22
    padding: 1.667vw 2.24vw
    +iphone-width
      width: 100vw
      margin-top: 0
      padding: 0
      background: #24262B
    .form-content
      +iphone-width
        width: 100%
        padding: 4.103vw 6.154vw
        background: transparent
        border-radius: 2.051vw
      .form-item
        &.input-row
          gap: 1.563vw
          +iphone-width
            gap: 0
            justify-content: center
        .label
          +iphone-width
            margin-top: 7.179vw
        .input-content
          margin-top: 0.417vw
          padding: 0
        .radio-content
          +setFlex(flex-start)
          padding-top: 1.458vw
          padding-left: 0.625vw
          gap: 1.563vw
          +iphone-width
            padding-top: 4.615vw
            padding-left: 2.564vw
            gap: 5.128vw
        .btn-toggle-content
          +setFlex(flex-start)
          padding-top: 1.458vw
          padding-left: 0.625vw
          gap: 1.563vw
          +iphone-width
            padding-top: 4.615vw
            padding-left: 2.564vw
            gap: 5.128vw
</style>
