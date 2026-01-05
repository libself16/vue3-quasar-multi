<template>
  <div class="bank-card-content">
    <div class="bank-wrap">
      <div
        class="bank-wrap-box"
        :class="{ active: activeBankId === card.id }"
        v-for="card in props.cardList"
        @click="changeBank(card.id)"
        :key="card.id"
      >
        <div class="wrap-box-title">{{ card.account_name }}</div>
        <div class="wrap-box-detail">
          <div class="wrap-box-detail-column">
            <div class="af-bnk-l">
              <span class="af-bnk-icon">
                <i class="fas fa-money-bill"></i>
              </span>
              <label class="af-bnk-info">{{ card.currency_code }}</label>
            </div>
          </div>
          <div class="wrap-box-detail-column">
            <div class="af-bnk-l">
              <span class="af-bnk-icon"> <i class="fas fa-university"></i></span>
              <label class="af-bnk-info">{{ card.branch }}</label>
            </div>
          </div>
          <div class="wrap-box-detail-column">
            <div class="af-bnk-l">
              <span class="af-bnk-icon"> <i class="fas fa-key"></i></span>
              <label class="af-bnk-info">{{ card.account_number }}</label>
            </div>
          </div>
          <div class="wrap-box-detail-column">
            <div class="af-bnk-l">
              <span class="af-bnk-icon"> <i class="fas fa-user-alt"></i> </span>
              <label class="af-bnk-info">{{ card.account_name }}</label>
            </div>
          </div>
        </div>
      </div>
      <div class="af-bnk-box add-bnk" ref="addBtn" @click="router.push({ name: 'memberBankAdd' })">
        <div class="af-bnk-add">
          <a>{{ $t("member.bank.addAccount") }} +</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useBank } from "src/common/composables/useBank";
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const { handleWithdralBankCardClick, withdrawState } = useBank()

const props = defineProps(["cardList"])
const emit = defineEmits(["updateBankId"])

const router = useRouter()
const route = useRoute()

let activeBankId = ref(0)

const changeBank = (id: number) => {
  activeBankId.value = id
  emit("updateBankId", id)
}

onMounted(() => {
  console.log(props.cardList)
})

// watchEffect(() => {

// })
</script>

<style lang="sass" scoped>
@import 'src/common/css/_variable.sass'
@import 'app/template/epicwin/css/_variable.sass'

.wrap-box-title
  background: #8127C5
  padding: 10px 24px
  border-radius: 4px 4px 0px 0px
  font-weight: bold
  font-size: 18px
.wrap-box-detail
  display: flex
  flex-direction: column
  padding: 15px 24px
  gap: 14px
  .wrap-box-detail-column
    display: flex
    justify-content: space-between
    align-items: center

.bank-wrap
  @apply mt-5
  width: 100%
  display: grid
  grid-template-columns: repeat(2, 1fr)
  gap: 10px
  +iphone-width
    grid-template-columns: repeat(1, 1fr)
  .bank-wrap-box
    border: 1px solid #8127C5
    border-radius: 10px
    background: #08192b

.af-bnk-icon i
  color: #8127C5

.af-bnk-l
  display: flex
  gap: 15px
  font-size: 16px

.af-bnk-l label.af-bnk-info
  margin: 0px

.af-bnk-box.add-bnk
  border: 5px solid #8127C5
  border-style: dashed
  display: flex
  align-items: center
  justify-content: center
  font-size: 20px
  font-weight: bold
  min-height: 211.39px
  cursor: pointer

.af-bnk-add a
  color: #fff

.add-bank .modal-dialog
  padding: 20px
  min-height: 390px
  background: #021524
  border-radius: 8px
  border: 1px solid #086eb8
  max-width: 815px
  margin-top: 5%

.bank-wrap-box
  cursor: pointer
  margin-right: 0.5vw
  margin-top: 0.5vw
  margin-bottom: 0.5vw
  &.active
    transform: scale(1.05, 1.05)
    transition: transform 300ms ease
    border: 2px solid #ffe400 !important
    box-shadow: 0px 0px 5px 1px rgb(255 255 255 / 50%)

.bank-card-content
  @apply w-full flex font-bold
</style>
