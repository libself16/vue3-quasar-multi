<template>
  <div class="change-password-content">
    <MemberNav />
    <div class="change-password-form column">
      <div class="form-title-content">
        <div class="color-label"></div>
        <div class="title">Update your password details</div>
      </div>
      <div class="form-content">
        <div class="form-item row">
          <div class="label col-12">Curent Password</div>
          <div class="input-content col-12 col-sm-9">
            <q-input standout v-model="form.password" placeholder="Curent Password" rounded outlined dense borderless />
          </div>
        </div>
        <div class="form-item row">
          <div class="label col-12">Confirm Password</div>
          <div class="input-content col-12 col-sm-9">
            <q-input
              standout
              v-model="form.confirmPassword"
              placeholder="Confirm Password"
              rounded
              outlined
              dense
              borderless
            />
          </div>
        </div>
        <div class="form-item row">
          <div class="label col-12">New Password</div>
          <div class="input-content col-12 col-sm-9">
            <q-input standout v-model="form.newPassword" placeholder="New Password" rounded outlined dense borderless />
          </div>
        </div>
        <div class="form-item">
          <div class="tip">Incorrect confirmation input</div>
        </div>
        <div class="action-btns row justify-center">
          <q-btn text-color="black" label="SUBMIT" class="submit-btn" @click="updatePassword" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from "vue"
import MemberNav from "src/common/components/MemberNav.vue"
import "vue3-carousel/dist/carousel.css"

const form = reactive({
  password: "",
  confirmPassword: "",
  newPassword: ""
})

const updatePassword = async () => {
  console.log("updatePassword")
  // TODO: call api
}
</script>

<style lang="sass" scoped>
@import 'src/common/css/_variable.sass'
@import 'src/css/form.sass'
// layout style
.change-password-content
  color: white
  padding: 5vw 0 5vw 12.865vw
  overflow: hidden
  +iphone-width
    padding: 0
  .change-password-form
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
        .tip
          color: #6FCF97
          font-family: "Century Gothic"
          font-size: 0.833vw
          font-weight: 700
          text-transform: capitalize
          +iphone-width
            margin-top: 4.103vw
            font-size: 4.103vw
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
    .action-btns
      margin-top: 5.208vw
      margin-bottom: 3.333vw
      +iphone-width
        margin-top: 7.179vw
        margin-bottom: 9.231vw
</style>
