<template>
  <div class="product-container">
    <h2 class="title text-left">{{ $t(GAME_TYPE.I18nKeys[gameTypeId as GAME_TYPE.Enums]) }}</h2>
    <q-separator />
    <ul class="live-product-row">
      <li v-for="product in combinedProductList" :key="product.product_name" class="live-item">
        <img
          :src="getProductSquareImage({ ...product, siteKey: 'set_sjpn2' })"
          :alt="product.product_name"
          class="live-img"
          @error="setDefaultProductImg"
        />

        <div class="live-content">
          <h3>{{ product.copywriterTitle }}</h3>
          <p>{{ product.copywriterText }}</p>
          <q-btn @click="handleProductClick(product.product_code)" class="live-btn" no-caps>
            <span>{{ $t("game.play_now") }}</span>
            <img :src="iconSvg('arrow')" class="arrow-icon" />
          </q-btn>
        </div>
      </li>
    </ul>
  </div>
  <CurrencySupportDialog />
  <LaunchGameDialog />
</template>
<script lang="ts">
export default {
  name: "ProductLobby"
}
</script>
<script lang="ts" setup>
import { onMounted, watchEffect, computed, ref } from "vue"
import CurrencySupportDialog from "src/common/components/dialog/CurrencySupport.vue"
import LaunchGameDialog from "src/common/components/dialog/LaunchGame.vue"
import { useGame } from "src/common/composables/useGame"
import { GAME_TYPE, LANGUAGE_CODE } from "src/common/utils/constants"
import { useRoute, useRouter } from "vue-router"
import { useCommonImg } from "src/common/hooks/useCommonImg"
import { useSiteImg } from "../../hooks/useSiteImg"

const route = useRoute()
const router = useRouter()
const { gameTypeState, getProducts, productState, handleProductClick, getProductSquareImage } = useGame()
const { setDefaultProductImg } = useCommonImg()
const { iconSvg } = useSiteImg()

const gameTypeId = computed(() => {
  return Number(route.params.gameType)
})

// 特規，amuse 日本站客戶僅提供 5 個 live 供應商文案，未來若有需求才做添加
const liveCopywriterList = ref([
  {
    id: 1002,
    title: "Evolution",
    text: "Evolutionは、マーケットのどのベンダーよりも多くのトップ事業会社と提携し、複数のチャネルとデバイスを介してお客様に提供するB2Bリアルタイムカジノサービスをリードしています。 革新的なソフトウェア、定評のあるエンタープライズクラスのインフラストラクチャ、伝統と独自性を兼ね備えた比類ないポートフォリオは、ゲームビジネスに真の価値をもたらします。"
  },
  {
    id: 1181,
    title: "Microgaming",
    text: "Microgamingプラットフォーム は、顧客のカジノとの高速かつシームレスな統合を実現するように設計されており、新しいコンテンツに対する需要の高まりに完全に対応できる拡張性を備えています。私たちの使命は、世界で最も有名なゲームブランドが卓越したゲーム体験をシームレスかつ責任を持って提供できるようにすることです。"
  },
  {
    id: 1022,
    title: "Sexy Gaming",
    text: "Sexy Gamingは、信頼性の高いサービスを提供するとともに、美しくセクシーな女性をオンラインで楽しむことができるオンラインバカラです。プロのディーラー全員が情熱的でセクシーな女性です。若くて非常に面白い彼女らは、すべてのライブディーラーゲームに刺激的な雰囲気を加えています。ゲームをイベントに変える想像力とスキルに終わりはありません。"
  },
  {
    id: 1011,
    title: "Playtech",
    text: "Playtechは、オンラインギャンブル業界における大手プラットフォーム、コンテンツ、サービスのプロバイダーであり、株主、顧客、同僚、環境に利益をもたらすという明確な戦略を持っています。テクノロジー、製品開発、ゲームプレゼンターのトレーニングに多大な投資を行うことで、業界最速のストリーミングと最高の稼働率に支えられた多様な体験を提供できます。"
  },
  {
    id: 1006,
    title: "Pragmatic Play",
    text: "Pragmatic Playライブカジノの導入は、オムニチャネルサービスへの新たな一歩となります。これにより、ランドベースおよびオンラインのオペレーターは、ライブディーラーソリューションをプレーヤーに提供すると同時に、デスクトップおよびスマートフォン、タブレット、VRガジェットから完全にユニークなゲーム体験を提供できます。"
  }
])

const combinedProductList = computed(() => {
  return productState.list
    .map((product) => {
      const matchingCopywriter = liveCopywriterList.value.find(
        (copywriter) => copywriter.id === Number(product.product_code)
      )

      if (matchingCopywriter) {
        return {
          ...product,
          copywriterText: matchingCopywriter.text,
          copywriterTitle: matchingCopywriter.title
        }
      }

      return null
    })
    .filter((item): item is NonNullable<typeof item> => item !== null) // 保留非 null 項目
})

watchEffect(() => {
  if (gameTypeState.list.length && gameTypeId.value) {
    getProducts(gameTypeId.value)
  }
})

onMounted(() => {
  if (GAME_TYPE.Category[gameTypeId.value as GAME_TYPE.Enums] === GAME_TYPE.CategoryEnums.GameOpen) {
    router.push({ name: "GameLobby", params: { gameType: gameTypeId.value } })
  }
})
</script>

<style lang="sass" scoped>
@import "src/common/css/_variable.sass"
@import "app/template/set_sjpn2/assets/css/_variable.sass"

.product-container
  @apply px-10 pt-5 mx-auto box-border
  max-width: 95rem
  padding-bottom: 7rem
  +iphone-width
    padding-bottom: 5rem
  +pad-width
    @apply px-5
  .title
    @apply mt-6 text-center
    font-size: 2.25rem
    +pad-width
      font-size: 2.25rem
    +phone-width
      @apply mt-2
  .q-separator
    @apply mt-5 mb-10
    background: #5b5b5c
    +phone-width
      @apply mt-2 mb-4
// new live area style
.live-product-row
  @apply flex flex-col w-full justify-center items-center
  .live-item
    @apply flex gap-[3.3125rem] w-[83%] p-[2.5rem] mb-[1.75rem]
    border-radius: .875rem
    border: .0625rem solid #D0A781
    background: linear-gradient(313deg, #91725C -12.72%, #000 16.34%, #000 70.2%, #91725C 117.87%)
    font-family: Jost
    font-style: normal
    @include pad-width
      @apply flex flex-col
    .live-img
      @apply w-[24.25rem] h-[13.25rem]
      @include pad-width
        @apply w-[100%] h-[100%]
    .live-content
      h3
        @apply font-semibold text-5xl mb-[1rem]
        color: #BCA672
        @include pad-width
          @apply text-4xl
      p
        @apply text-sm text-white font-normal mb-[1rem]
      .live-btn
        @apply w-[10.875rem] h-[2.5rem] flex justify-center items-center text-base
        border-radius: .25rem
        border: .125rem solid #D37139
        background: #000
        span
          @apply mr-[.9375rem]
        .arrow-icon
          @apply w-[1.0625rem] h-[.375rem]
</style>
