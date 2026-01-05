<template>
  <div class="about-us-wrapper">
    <div v-for="item in informationList" :key="item.title" class="about-us-content">
      <div class="title">
        {{ item.title }}
      </div>
      <div class="detail">
        {{ item.detail }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, Ref } from "vue"
import "vue3-carousel/dist/carousel.css"

interface InformationItem {
  title: string
  detail: string
}

export default defineComponent({
  name: "AboutUs",
  setup() {
    let informationList: Ref<InformationItem[]> = ref([
      {
        title: "Who are we?",
        detail:
          "GamingSoft is Malaysia's premier online casino and sportsbook gaming establishment. Online casino gambling is a crucial component of the entertainment industry, and we think that everyone should have the opportunity to try their hand at some of the fun and games as long as they exercise restraint and boundaries."
      },
      {
        title: "Our Games",
        detail:
          "Play a variety of thrilling games, including as card games like baccarat, blackjack, and poker, as well as traditional and progressive slots, European and American roulette, Sic Bo, Keno, the lottery, scratch cards, and more. Sports fans may participate in the game by cheering and wagering on their favourite sports team at any time and from any location. Allow our games to bring you surprising money gains and jackpots!"
      },
      {
        title: "Quick & Easy Transactions",
        detail:
          "We are aware of how eager you are to play and how much you detest waiting, so we ensure you that all deposit and withdrawal operations will be simple, quick, and safe."
      },
      {
        title: "24-Hour Customer Support",
        detail:
          "Our primary mode of payment is online bank transfer. We also accept manual transfers through ATM (Automated Teller Machine) or CDM (Cash Deposit Machine) for people who do not have online banking. Credit card and third-party payment merchants are not presently accessible, but we are striving to introduce them in order to better serve you."
      },
      {
        title: "Fully Licensed & Compliant",
        detail:
          "GamingSoft is fully licenced in the Philippines under First Cagayan Leisure and Resort Corporation (FCLRC), which means we are required to follow the laws and regulations of one of the world's most carefully supervised gaming regulatory jurisdictions. We never sell or disclose any of your information with outside parties, and all of your personal information is always kept secure and private using SSL encryption."
      }
    ])

    return {
      informationList
    }
  }
})
</script>

<style lang="sass" scoped>
@import 'src/common/css/_variable.sass'

.about-us-wrapper
    .about-us-content
        .title
            color: #FFC002
            font-family: "NotoSansTC"
            font-size: 14px
            font-style: normal
            font-weight: 700
            line-height: normal
            text-transform: uppercase
            margin-bottom: 20px
        .detail
            color: #FFF
            font-family: "NotoSansTC"
            font-size: 14px
            font-style: normal
            font-weight: 400
            line-height: normal
            text-transform: capitalize
            padding: 0 20px
            margin-bottom: 30px
</style>
