<template>
  <div class="info-wrapper">
    <h3>About Us</h3>
    <p>
      <strong>{{ companyName }}</strong> is Vietnam’s leading Online Casino and Sportsbook Gaming Establishment. Online
      Casino gaming plays an integral role in the entertainment field, and we believe that, with self-control and
      limitations, everyone deserves a chance to utilise their luck on some the fun and games.
    </p>

    <p>
      Play all sorts of exciting games, including card variations such as baccarat, blackjack and poker; classic and
      progressive slots machines, European and American Roulette, Sic Bo, Keno, Lottery, Scratch Cards, and many more.
      For sports fanatics, be part of the game by cheering and betting on your favourite sports team at anytime and
      anywhere. Let our games spark unexpected money gains and jackpots for you! At {{ companyName }}, we strive to give
      you the best user experience. Our commitments include:
    </p>

    <p>
      <strong>HASSLE-FREE AND QUICK MONEY TRANSACTIONS</strong><br />
      We understand the excitement of wanting to play and loathing the wait, therefore we assure you that all deposit
      and withdrawal transactions are hassle-free, speedy and secured.
    </p>

    <p>
      <strong>24-HOURS CUSTOMER SERVICE</strong><br />
      Our Customer Service Representatives on Live Chat are online 24 hours a day, 7 days a week. Each of them has gone
      through a rigorous product, services and hospitality training to ensure professional support and assistance when
      at your service.
    </p>

    <p>
      <strong>DEPOSIT AND WITHDRAWAL METHODS</strong><br />
      Online bank transfer is our principal transaction method. We also accept manual transfers via ATM (Automated
      Teller Machine) or CDM (Cash Deposit Machine) for those who don’t have online banking. Credit card and third-party
      payment merchants are currently not available, but we are working our way on implementing it to serve you better.
    </p>

    <p>
      <strong>FULLY COMPLIANT AND LICENSED</strong><br />
      {{ companyName }} is fully licensed in the Philippines under First Cagayan Leisure and Resort Corporation (FCLRC),
      meaning that we are obligated to adhere to the rules and regulations in one of worldwide’s most strictly
      controlled gaming regulatory jurisdiction. All your personal information is kept secured and confidential under an
      SSL encryption at all times, and we do not sell or share any information to any third parties. If you're yet to be
      a member, give us a try by signing up for a free account, and embark on your journey with a generous 100% Welcome
      Bonus of up to MYR 777 from us!
    </p>
  </div>
</template>

<script lang="ts" setup>
import { useEnv } from "src/common/hooks/useEnv"

const { companyName } = useEnv()
</script>

<style lang="sass" scoped>
.info-wrapper
  margin-left: 1vw
  background: rgba(0, 0, 0, .5019607843)
  border-radius: 7px
  padding: 25px 30px
  margin-bottom: 30px
  min-height: 500px
  font-size: 0.9rem
  h3
    font-size: calc(1.3rem + .6vw)

::v-deep p
  margin-bottom: 1rem
</style>
