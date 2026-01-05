<template>
  <div class="footer-wrapper">
    <footer class="layout-footer">
      <div class="footer-top">
        <div class="navigation-menu">
          <q-btn
            class="term-btn"
            @click="
              $router.push({
                name: 'GeneralTerms'
              })
            "
          >
            {{ $t("common.btn.generalTerms") }}
          </q-btn>
          <div class="link-seperator">|</div>
          <q-btn
            class="term-btn"
            @click="
              $router.push({
                name: 'CampaignTerms'
              })
            "
          >
            {{ $t("common.btn.campaignTerms") }}
          </q-btn>
        </div>
      </div>
      <div class="footer-middle">
        <div class="game-providers">
          <div class="providers-wrapper">
            <div class="prov-img">
              <ul class="provider-list">
                <li v-for="item in productState.allList" :key="item.product_code">
                  <img
                    :src="getProductTabImage({ ...item, siteKey: 'set_sjpn2' })"
                    class="tab-img"
                    :alt="item.product_name"
                    @error="setDefaultProductTabImg"
                  />
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <div class="footer-content-bottom">
          <div id="be-support">
            <div class="be-support-content">{{ $t("home.supporting", { company: companyName }) }}&nbsp;</div>
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
          {{ nowHost }}

          {{ $t("home.information", { company: companyName }) }}
        </div>
      </div>
    </footer>
  </div>
</template>

<script lang="ts" setup>
import { useSiteImg } from "app/template/set_sjpn2/hooks/useSiteImg"
import { useEnv } from "src/common/hooks/useEnv"
import { useGame } from "src/common/composables/useGame"

const { footerSvg } = useSiteImg()
const { companyName, nowHost } = useEnv()
const { productState, getProductTabImage } = useGame()
const { setDefaultProductTabImg } = useSiteImg()
</script>

<style lang="sass" scoped>
@import "src/common/css/_variable.sass"
@import "app/template/set_sjpn2/assets/css/_variable.sass"
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
  +pad-width
    padding-bottom: 4rem
  .layout-footer
    display: flex
    flex-direction: column
    font-size: 11px
    padding: 20px 2.5rem
    max-width: 95rem
    align-self: center
    background-color: var(--neutral-2)
    margin: 0 auto
    +phone-width
      padding: 20px 1rem
    .footer-top
      flex-direction: row
      justify-content: center
      border: none
      padding: 0px 0px 5px 0px
      flex-wrap: wrap
      display: flex
      font-size: 14px
      .navigation-menu
        +phone-width
          justify-content: start
      :deep(.q-btn)
        padding: 5px
        &:hover
          background-color:transparent
          color: #ED772E
        +phone-width
          font-size: 10px
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
          +phone-width
            width: 30%

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
