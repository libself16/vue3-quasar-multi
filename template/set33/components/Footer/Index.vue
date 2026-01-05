<template>
  <div class="footer-wrapper">
    <footer class="layout-footer">
      <div class="footer-top">
        <div class="payment-methods">
          <div class="title">{{ $t("home.payment_methods") }}:</div>
          <div class="methods">
            <div class="method-container">
              <img class="payment-method" :src="footerImg('GSPay_w')" />
            </div>
            <div class="method-container">
              <img class="payment-method" :src="footerImg('payment-eeziepay')" />
            </div>
            <div class="method-container">
              <img class="payment-method" :src="footerImg('help2pay')" />
            </div>
          </div>
        </div>

        <div class="social-media">
          <a target="_blank">
            <img class="social-media-image" :src="footerSvg('twitter-colored')" />
          </a>
          <a>
            <img class="social-media-image" :src="footerSvg('youtube-colored')" />
          </a>
        </div>
        <div class="navigation-menu">
          <div @click="navigateToWebInformation('AboutUs')" class="cursor-pointer">
            {{ $t("home.about_company", { company: companyName }) }}
          </div>
          <div class="link-seperator">|</div>
          <div @click="navigateToWebInformation('TermAndCondition')" class="cursor-pointer">
            {{ $t("home.term_condition") }}
          </div>
          <div class="link-seperator">|</div>
          <div @click="navigateToWebInformation('PrivacyPolicy')" class="cursor-pointer">
            {{ $t("home.privacy_policy") }}
          </div>
          <div class="link-seperator">|</div>
          <div @click="router.push('/ContactUs')" class="cursor-pointer">
            {{ $t("home.contact_us") }}
          </div>
        </div>
      </div>
      <div class="footer-middle">
        <div class="game-providers">
          <div class="providers-wrapper">
            <div class="prov-img">
              <ul>
                <li v-for="item in productState.allList" :key="item.product_code">
                  <img :src="getTabProductImages(item.product_code)" :alt="item.product_name" />
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <div class="footer-content-bottom">
          <div id="be-support">
            <div class="be-support-content">
              {{ $t("home.supporting", { company: companyName }) }}&nbsp;
              <div id="footer-responsible-gaming">
                {{ $t("home.responsible_gaming") }}
              </div>
            </div>
          </div>
          <div class="bottom-element">
            <div id="be-age-limit" class="age-limit">
              <img :src="footerSvg('eighteen')" alt="eighteen" />
            </div>
            <div class="copyright-element">
              <span>&nbsp;| {{ nowHost }}&nbsp;</span>
              <time>2024</time>
            </div>
          </div>
        </div>
        <div class="terms-info">
          {{ $t("home.conditions") }}<br />
          <br />
          {{ nowHost }}
          {{ $t("home.information", { company: companyName }) }}
        </div>
      </div>
    </footer>
  </div>
  <div class="t-footer">
    <section class="menu-btm">
      <div class="menu-wrapper" v-if="!isLogin">
        <a class="menuft" @click="$router.push('/')">
          <img :src="footerImg('footer-home')" />
          {{ $t("menu.home") }}
        </a>
        <a class="menuft" @click="$router.push({ name: 'Promotion' })">
          <img :src="footerImg('footer-promos')" />
          {{ $t("menu.promos") }}
        </a>
        <div></div>
        <a class="menuft" @click="$router.push({ name: 'Login' })">
          <img :src="footerImg('footer-login')" />
          {{ $t("menu.login") }}
        </a>
        <a class="menuft" @click="handleOpenLiveChat">
          <img :src="footerImg('footer-support')" />
          {{ $t("menu.liveChat") }}
        </a>
        <div class="aff-qr" @click="$router.push({ name: 'Register' })">
          <a><img :src="footerImg('footer-register')" /></a>
        </div>
      </div>
      <div class="menu-wrapper" v-else>
        <a class="menuft" @click="$router.push('/')">
          <img :src="footerImg('footer-home')" />
          {{ $t("menu.home") }}
        </a>
        <a class="menuft" @click="$router.push({ name: 'Promotion' })">
          <img :src="footerImg('footer-promos')" />
          {{ $t("menu.promos") }}
        </a>
        <div></div>
        <a class="menuft" @click="$router.push({ name: 'MemberWithdrawal' })">
          <img :src="footerImg('footer-withdrawal')" />
          {{ $t("menu.withdrawal") }}
        </a>
        <a class="menuft" @click="handleOpenLiveChat">
          <img :src="footerImg('footer-support')" />
          {{ $t("menu.liveChat") }}
        </a>
        <div class="aff-qr" @click="$router.push({ name: 'MemberDeposit' })">
          <a><img :src="footerImg('footer-deposit')" /></a>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router"
import { useCommonImg } from "src/common/hooks/useCommonImg"
import { useGame } from "src/common/composables/useGame"
import { useSiteImg } from "app/template/set33/hooks/useSiteImg"
import { useEnv } from "src/common/hooks/useEnv"
import { useAuth } from "src/common/hooks/useAuth"
import { useLiveChat } from "src/common/hooks/useLiveChat"

const { productState } = useGame()
const { getTabProductImages } = useCommonImg()
const { footerSvg, footerImg } = useSiteImg()
const router = useRouter()
const { companyName, nowHost } = useEnv()
const { isLogin } = useAuth()
const { handleOpenLiveChat } = useLiveChat()

const navigateToWebInformation = (link: string) => {
  router.push({ name: "WebInformation", params: { id: link } })
}
</script>

<style lang="sass" scoped>
@import "src/common/css/_variable.sass"
@import "app/template/set33/assets/css/_variable.sass"
.t-footer
  display: none
  position: fixed
  width: 100%
  bottom: 0
  z-index: 99
  +phone-width
    display: block
  .menu-btm
    position: fixed
    max-width: 991px
    margin: auto
    width: 100%
    bottom: 0
    left: 0
    right: 0
    background: url('../../assets/images/footer/ftr-menu-bar.png') no-repeat top center
    background-size: 100%
  .aff-qr
    background: #0772b3
    padding: 3.5%
    width: 15%
    border-radius: 100%
    position: absolute
    left: -1px
    right: 0
    bottom: 26px
    margin: auto
    z-index: 9
  .menu-wrapper
    display: grid
    grid-template-columns: repeat(5,1fr)
    text-align: center
    padding: 11px 0 1px
    position: relative
    a
      color: #fff
      font-size: 9px
      text-transform: uppercase
      font-weight: 600
      padding: 5px 0
    .menuft
      img
        max-width: 31%
        display: block
        margin: auto auto 2px
        filter: brightness(0) invert(1)

.footer-wrapper
  background-color: #000
  color:#fff
  padding-bottom: 90px
  .layout-footer
    display: flex
    flex-direction: column
    font-size: 11px
    padding: 0 13px
    max-width: 1366px
    align-self: center
    background-color: var(--neutral-2)
    margin: 0 auto
    .footer-top
      flex-direction: row
      justify-content: space-between
      border: none
      padding: 24px 0px 5px 0px
      flex-wrap: wrap
      display: flex
      img
        &.payment-method:hover,
        &.social-media-image:hover
          filter: none
      .payment-methods
        flex-direction: row
        order: 0
        display: flex
        align-items: center
        align-self: flex-start
        margin-bottom: 16px
        justify-content: flex-start
        width: 90%
        .title
          margin-right: 16px
          margin-bottom: 0
          display: flex
          justify-content: center
        .methods
          display: flex
          flex-wrap: wrap
          justify-content: space-around
          gap: 10px
          align-items: center
    .footer-middle
      display: flex
      flex-direction: row
      align-items: center
      padding: 0 !important
      justify-content: center
      border-top: 1px dashed #fff
      ul
        display: flex
        padding: 0
        margin: 15px 0 10px
        flex-wrap: wrap
        justify-content: center
        li
          list-style: none
          margin: 0 5px 10px
          display: flex
          justify-content: center
          align-items: center

    .footer-bottom
      border-top: 1px dashed #fff
      padding-top: 20px
      padding-bottom: 20px
      .bottom-element
        display: flex
        align-items: center
      .footer-content-bottom
        display: flex
        justify-content: space-between
        flex-wrap: wrap
        width: 100%
        padding-bottom: 20px

    .be-support-content
      display: flex
      #footer-responsible-gaming
        text-decoration: underline
        cursor: context-menu

    .navigation-menu
      border-radius: 5px
      display: flex
      flex-wrap: wrap
      align-items: center
      justify-content: center
      line-height: 24px
      margin-bottom: 8px
      a
        color: #fff
      .link-seperator
        font-size: 13px
        height: 25px
        margin: 0px 5px
</style>
