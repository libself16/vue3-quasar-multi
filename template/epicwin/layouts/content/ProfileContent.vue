<template>
  <div class="profile-content">
    <MemberNav />
    <div class="profile-form column">
      <div class="form-title-content">
        <div class="color-label"></div>
        <div class="title">Update your account details</div>
      </div>
      <div class="form-content">
        <div class="form-item row">
          <div class="label col-12">USERNAME</div>
          <div class="input-content col-12 col-sm-5">
            <q-input
              standout
              v-model="form.userName"
              placeholder="請輸入使用者名稱"
              rounded
              outlined
              dense
              borderless
            />
          </div>
        </div>
        <div class="form-item row">
          <div class="row col-12 col-sm-5 q-mr-lg">
            <div class="label col-12">first name</div>
            <div class="input-content col-12">
              <q-input
                standout
                v-model="form.firstName"
                placeholder="請輸入使用者姓氏"
                rounded
                outlined
                dense
                borderless
              />
            </div>
          </div>
          <div class="row col-12 col-sm-5">
            <div class="label col-12">last name</div>
            <div class="input-content col-12">
              <q-input
                standout
                v-model="form.lastame"
                placeholder="請輸入使用者姓名"
                rounded
                outlined
                dense
                borderless
              />
            </div>
          </div>
        </div>
        <div class="form-item row">
          <div class="label col-12">e-mai</div>
          <div class="input-content col-12 col-sm-9">
            <q-input standout v-model="form.email" placeholder="請輸入電子郵件" rounded outlined dense borderless />
          </div>
        </div>
        <div class="form-item row">
          <div class="label col-12">CONTACT NO.</div>
          <div class="input-content col-12 col-sm-9">
            <q-input standout v-model="form.contact" placeholder="請輸入聯絡電話" rounded outlined dense borderless />
          </div>
        </div>
        <div class="form-item row">
          <div class="label col-12">GENDER</div>
          <div class="radio-content col-12 col-sm-10">
            <q-radio dense v-model="form.gender" :val="0" label="Male" checked-icon="circle" />
            <q-radio dense v-model="form.gender" :val="1" label="Female" checked-icon="circle" />
          </div>
        </div>
        <div class="form-item row birth-content">
          <div class="row col-12 col-sm-3 year-content">
            <div class="label col-12">BIRTH DATE</div>
            <div class="input-content col-12">
              <q-select rounded outlined dense v-model="form.yaer" :options="years" @update:model-value="initDate">
                <template #default>
                  <div v-if="!form.yaer" class="select-placeholder">請選擇年份</div>
                </template>
              </q-select>
            </div>
          </div>
          <div class="row col-5 col-sm-3 month-content">
            <div class="label col-12">month</div>
            <div class="input-content col-12">
              <q-select rounded outlined dense v-model="form.month" :options="months" @update:model-value="initDate">
                <template #default>
                  <div v-if="!form.month" class="select-placeholder">請選擇月份</div>
                </template>
              </q-select>
            </div>
          </div>
          <div class="row col-5 col-sm-3 date-content">
            <div class="label col-12">DATE</div>
            <div class="input-content col-12">
              <q-select rounded outlined dense v-model="form.date" :options="daysInMonth">
                <template #default>
                  <div v-if="!form.date" class="select-placeholder">請選擇日期</div>
                </template>
              </q-select>
            </div>
          </div>
        </div>
        <div class="action-btns row justify-center">
          <q-btn text-color="black" label="SUBMIT" class="submit-btn" @click="updateProfile" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, computed } from "vue"
import dayjs from "dayjs"
import MemberNav from "src/common/components/MemberNav.vue"
import "vue3-carousel/dist/carousel.css"

const form = reactive({
  userName: "",
  firstName: "",
  lastame: "",
  email: "",
  contact: "",
  gender: 0,
  yaer: "",
  month: "",
  date: ""
})

const years = computed(() => {
  const currentYear = dayjs().year()
  return Array.from({ length: 100 }, (_, i) => currentYear - i)
})

const months = computed(() => {
  const result = []
  for (let i = 1; i <= 12; i++) {
    result.push(`${i}`)
  }
  return result
})

const daysInMonth = computed(() => {
  if (!form.yaer || !form.month) return []
  const maxDate = dayjs(`${form.yaer}-${form.month}-01`).daysInMonth()
  const result = []
  for (let i = 1; i <= maxDate; i++) {
    result.push(`${i}`)
  }
  return result
})

const initDate = () => {
  form.date = ""
}

const updateProfile = async () => {
  console.log("updateProfile")
  // TODO: call api
}
</script>

<style lang="sass" scoped>
@import 'src/common/css/_variable.sass'
@import 'src/css/form.sass'
// layout style
.profile-content
  color: white
  padding: 5vw 0 5vw 12.865vw
  overflow: hidden
  +iphone-width
    padding: 0 0 88vw 0
  .profile-form
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
        width: 80%
        margin: 4.103vw auto
        padding: 4.103vw 6.154vw
        background: #1C1E22
        border-radius: 2.051vw
      .form-item
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
        &.birth-content
          gap: 1.563vw
          +iphone-width
            gap: 0
            justify-content: space-between
</style>
