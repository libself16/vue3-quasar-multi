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
import { useEnv } from "src/common/hooks/useEnv"

const { companyName } = useEnv()

interface InformationItem {
  title: string
  detail: string
}

export default defineComponent({
  name: "AboutUs",
  setup() {
    const informationList: Ref<InformationItem[]> = ref([
      {
        title: "About Us",
        detail: `${companyName.value} is Malaysia's premier online casino and sportsbook gaming establishment. Online casino gambling is a crucial component of the entertainment industry, and we think that everyone should have the opportunity to try their hand at some of the fun and games as long as they exercise restraint and boundaries.`
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
        detail: `${companyName.value} is fully licenced in the Philippines under First Cagayan Leisure and Resort Corporation (FCLRC), which means we are required to follow the laws and regulations of one of the world's most carefully supervised gaming regulatory jurisdictions. We never sell or disclose any of your information with outside parties, and all of your personal information is always kept secure and private using SSL encryption.`
      }
    ])

    return {
      informationList
    }
  }
})
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";

.about-us-wrapper {
  @include phone-width {
    background-image: url("../../../assets/images/about-us-bg.webp");
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  }
  .about-us-content {
    @include iphone-width {
      padding: 10px 20px;
    }
    .title {
      color: rgb(2, 91, 232);
      font-size: 32px;
      line-height: 48px;
      margin-bottom: 20px;
      font-family: OpenSans;
      font-weight: 500;
      @include iphone-width {
        font-size: 20px;
        line-height: 24px;
        margin-bottom: 10px;
      }
    }
    .detail {
      font-family: OpenSans;
      font-weight: 400;
      font-size: 16px;
      line-height: 26px;
      margin-bottom: 30px;
      @include iphone-width {
        margin-bottom: 4px;
      }
    }
  }
}
</style>
