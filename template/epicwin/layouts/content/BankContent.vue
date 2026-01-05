<template>
  <div class="bank-container">
    <MemberNav />
    <div class="bank-content column">
      <div class="form-title-content">
        <div class="color-label"></div>
        <div class="title">出款設定</div>
      </div>
      <div class="add-content row justify-end items-center" @click="addBankCard">
        <q-icon name="add_circle_outline" class="add-icon"></q-icon>
        <div class="add-text">新增</div>
      </div>
      <div class="card-container">
        <div v-for="item in cards" :key="item.id" class="card">
          <div class="card-title">
            <div class="title-text">{{ item.name }}</div>
            <div class="more-container">
              <q-icon name="more_vert" class="more-icon"> </q-icon>
              <div class="more-content">
                <q-icon name="border_color" @click="editBankCard"></q-icon>
                <q-icon name="delete" @click="removeBankCard"></q-icon>
              </div>
            </div>
          </div>
          <div class="card-content">
            <div class="content-title">銀行支行</div>
            <div class="content-value">{{ item.currency }}</div>
          </div>
          <div class="card-content">
            <div class="content-title">名稱</div>
            <div class="content-value">{{ item.bank }}</div>
          </div>
          <div class="card-content">
            <div class="content-title">銀行帳號名稱</div>
            <div class="content-value">{{ item.accountName }}</div>
          </div>
          <div class="card-content">
            <div class="content-title">銀行帳戶號碼</div>
            <div class="content-value">{{ item.accountNumber }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, onMounted } from "vue"
import { useRouter } from "vue-router"
import MemberNav from "src/common/components/MemberNav.vue"
import "vue3-carousel/dist/carousel.css"

const router = useRouter()

type BankCard = {
  id: number
  currency: string
  transferTypeId: number
  channelId: number
  bank: string
  name: string
  accountName: string
  accountNumber: string
}

let cards = reactive<BankCard[]>([])

const addBankCard = () => {
  router.push({ name: "memberBankAdd" })
}

const editBankCard = () => {
  console.log("edit")
}

const removeBankCard = () => {
  console.log("remove")
}

const initCards = () => {
  const fakeData = {
    id: 1,
    currency: "MYR",
    transferTypeId: 1,
    channelId: 1,
    bank: "Bangsar, WP",
    name: "ACCOUNT 01",
    accountName: "John D",
    accountNumber: "10810810876"
  }
  for (let i = 1; i < 10; i++) {
    const card = { ...fakeData }
    card.id = i
    cards.push(card)
  }
}

onMounted(() => {
  initCards()
})
</script>

<style lang="sass" scoped>
@import 'src/common/css/_variable.sass'
@import 'src/css/form.sass'
// layout style
.bank-container
  color: white
  padding: 5vw 0 3.698vw 12.604vw
  overflow: hidden
  +iphone-width
    padding: 0
  .bank-content
    margin-top: 2.5vw
    width: 52.083vw
    border-radius: 8px
    background: #1C1E22
    padding: 1.667vw 2.24vw
    +iphone-width
      width: 100vw
      margin-top: 0
      padding: 0
      background: #24262B
    .add-content
      cursor: pointer
      margin-bottom: 1.25vw
      color: $white-7
      &:hover
        color: #fff
      +iphone-width
        margin-right: 7.692vw
      .add-icon
        font-size: 1.042vw
        margin-right: 0.208vw
        +iphone-width
          font-size: 5.128vw
          margin-right: 1.026vw
      .add-text
        font-size: 0.938vw
        +iphone-width
          font-size: 4.615vw
    .card-container
      +setFlex(space-evenly)
      gap: 1.563vw
      flex-wrap: wrap
      +iphone-width
        width: 82.051vw
        height: 184.103vw
        margin: 4.103vw auto
        background-color: #1C1E22
        padding: 3.077vw 0
        overflow: auto
        +hideScrollBar
      .card
        width: 13.49vw
        +setFlex()
        flex-direction: column
        padding-bottom: 0.938vw
        border-radius: 8px
        border: 2px solid #4F4F4F
        +iphone-width
          width: 66.41vw
          margin: 16px auto 0
        .card-title
          +setFlex(space-between)
          width: 100%
          padding-left: 0.833vw
          background: #4F4F4F
          +iphone-width
            padding-left: 4.103vw
          .title-text
            color: rgba(255, 255, 255, 0.70)
            font-family: "Century Gothic"
            font-size: 0.833vw
            font-weight: 700
            position: relative
            +iphone-width
              font-size: 4.103vw
          .more-container
            position: relative
            padding: 0.833vw
            +iphone-width
              padding: 4.103vw
            &:hover
              .more-content
                display: flex
            .more-icon
              font-size: 1.042vw
              +iphone-width
                font-size: 5.128vw
            .more-content
              background-color: #f2f2f2
              border-radius: 4px
              color: #828282
              display: flex
              flex-direction: column
              padding: 0.625vw
              gap: 0.885vw
              font-size: 1.042vw
              position: absolute
              left: -1vw
              top: 2.2vw
              display: none
              cursor: pointer
              +iphone-width
                font-size: 5.128vw
                left: 0
                top: 9vw
        .card-content
          +setFlex()
          gap: 1.458vw
          margin-top: 0.625vw
          width: 100%
          font-size: 0.729vw
          +iphone-width
            margin-top: 3.077vw
            gap: 7.179vw
            font-size: 3.59vw
          .content-title
            width: 50%
            text-align: right
          .content-value
            width: 50%
            word-wrap: break-word
            overflow-wrap: break-word
</style>
