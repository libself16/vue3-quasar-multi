<template>
  <div>
    <h3>Contact Us</h3>
    <span>Kindly contact our customer service personnels to assist you on your queries.</span>
    <div class="grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-4 xl:grid-cols-4 xl:gap-4 mt-4">
      <div class="contact_wrapper" v-for="(item, index) in contactData" :key="index">
        <img :src="item.image" alt="" />
        <div class="contact_wrapper_inn">
          <p class="text-white font-extrabold">{{ item.type }}</p>
          <span class="text-white font-semibold">{{ item.content }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from "vue"
import { useEnv } from "src/common/hooks/useEnv"
import email from "../../../assets/images/contacts/email.png"
import whatsapp from "../../../assets/images/contacts/whatsapp.png"
import ig from "../../../assets/images/contacts/instragram.png"
import fb from "../../../assets/images/contacts/facebook.png"
import yt from "../../../assets/images/contacts/youtube.png"
import tg from "../../../assets/images/contacts/telegram.png"
import mobile from "../../../assets/images/contacts/mobile.png"

const { companyName } = useEnv()
const contactData = reactive([
  {
    image: whatsapp,
    type: "WHATSAPP",
    content: "+60123456789"
  },
  {
    image: ig,
    type: "INSTAGRAM",
    content: "eD8888_official"
  },
  {
    image: fb,
    type: "FACEBOOK",
    content: "eD8888"
  },
  {
    image: yt,
    type: "YOUTUBE",
    content: "eD8888"
  },
  {
    image: tg,
    type: "TELEGRAM",
    content: "eD8888"
  },
  {
    image: email,
    type: "E-MAIL",
    content: "eD8888"
  },
  {
    image: mobile,
    type: "CALL US",
    content: "+60123456789"
  }
])
</script>

<style lang="sass" scoped>
@import "src/common/css/_variable.sass"

h3
  color: #188f74
  text-transform: uppercase
  position: relative
  font-size: 2.5rem
  font-weight: 700

.contact_wrapper
  position: relative
  display: flex
  align-items: center
  justify-content: center
  text-align: center
  .contact_wrapper_inn
    position: absolute
    margin-top: 37px
</style>
