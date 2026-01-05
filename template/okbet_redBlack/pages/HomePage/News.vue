<template>
  <div class="news-area" v-if="!isMobile">
    <div class="content-area">
      <div class="title">
        <div class="more">FEATURED</div>
        <div class="bestDeals">
          <span>okbet_red</span>
        </div>
      </div>
      <div class="news-content-wrap">
        <div class="news-detail-wrap">
          <div class="detailWrap" v-for="item in newsData.slice(0, 3)" :key="item.id" @click="handleDetail(item.id)">
            <div class="contentWrap">
              <div class="header-wrap">
                <div>
                  <div class="day">{{ item.time.split(" ")[0].split("/")[2] }}</div>
                  <div class="year">{{ item.time.split(" ")[0].split("/").slice(0, 2).join("/") }}</div>
                </div>
                <div class="time">{{ item.time.split(" ")[1] + " " + item.time.split(" ")[2] }}</div>
              </div>
              <div class="title-wrap">
                <div class="title">
                  {{ item.title }}
                </div>
              </div>
              <div class="image-wrap">
                <img :src="newsImg(item.img)" />
              </div>
              <div class="content-wrap">
                <p>{{ item.content }}</p>
              </div>
              <div class="footer-wrap"><div class="view-more">Details</div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="content-area">
      <div class="title">
        <div class="bestDeals">
          <span>NEWS</span>
          <span>List</span>
        </div>
      </div>
      <div class="news-content-horizontal-wrap">
        <div class="news-detail-wrap">
          <div class="detailWrap" v-for="item in newsData" :key="item.id" @click="handleDetail(item.id)">
            <div class="image-wrap">
              <img :src="newsImg(item.img)" />
            </div>
            <div class="info-wrap">
              <div class="title-wrap">
                <div class="titles" style="word-break: break-word">
                  {{ item.title }}
                </div>
              </div>
              <div class="content-wrap">
                <p>{{ item.content }}</p>
              </div>
              <div class="footer-wrap">
                <div class="date">{{ item.time }}</div>
                <div class="view-more">Details</div>
              </div>
            </div>
          </div>
          <!--detailWrap-->
        </div>
      </div>
    </div>
  </div>
  <div v-else class="news-area-mobile">
    <div class="contentView">
      <div class="banner-box">
        <img :src="newsImg('banner.png')" alt="" />
      </div>
      <div class="title-row">
        <img
          src="data:image/png;base64,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"
          width="24"
          alt=""
        />
        <div class="title">News List</div>
      </div>
      <div class="list-row">
        <div class="content" v-for="item in newsData" :key="item.id" @click="handleDetail(item.id)">
          <div class="flex-box">
            <div class="left-img">
              <img :src="newsImg(item.img)" />
            </div>
            <div class="right">
              <div class="title">{{ item.title }}</div>
              <div class="time">{{ item.time }}</div>
            </div>
          </div>
          <div class="context">{{ item.content }}</div>
          <div class="line"></div>
        </div>
      </div>
    </div>
  </div>
  <FooterArea />
</template>

<script lang="ts" setup>
import FooterArea from "app/template/okbet_redBlack/components/Footer/Index.vue"
import { onMounted, onUnmounted, ref } from "vue"
import { useRouter } from "vue-router"
import { useSiteImg } from "../../hooks/useSiteImg"

const router = useRouter()
const { newsImg } = useSiteImg()

const isMobile = ref(window.innerWidth <= 768)
const updateIsMobile = () => {
  isMobile.value = window.innerWidth <= 768
}

const newsData = ref([
  {
    id: 1,
    title: "okbet_red Unaffected by POGO Ban, Continues Operations",
    time: "2024/07/25 18:32 PM",
    content:
      "Amidst the recent crackdown on Philippine Offshore Gaming Operators (POGOs) following President Ferdinand Marcos Jr.’s State of the Nation Address (SONA), local gaming platform okbet_red has clarified that it remains unaffected by the ban.</p><p><br></p><p>The President’s directive to the Philippine Amusement and Gaming Corporation (PAGCOR) to cease POGO operations by the end of the year has sparked concerns about job losses and economic impact. However, okbet_red, a Philippine Inland Gaming Operator (PIGO), assures the public that its operations will continue as usual.</p><p><br></p><p>Unlike POGOs, which cater to foreign customers and operate with offshore licenses, PIGOs are required to be associated with land-based establishments and are subject to stricter regulation by PAGCOR. okbet_red, a trusted partner of PAGCOR, adheres to the agency’s guidelines on responsible gaming and holds the necessary permits to operate in the Philippines.</p><p><br></p><p>As the gaming industry undergoes significant changes, okbet_red positions itself as a stable and reliable platform for all qualified players. &nbsp;The company remains committed to supporting the local economy and providing secure and enjoyable gaming experiences for all its patrons.</p><p><br></p>",
    img: "news1.jpg"
  },
  {
    id: 2,
    title: "Get the Premium Casino Experience Online with okbet_red",
    time: "2024/05/28 15:29 PM",
    content:
      "Table games are the kind of games people want to play in the casino because the casino experience elevates the encounter. The casino usually augments the premium gaming experience with live music, entertainment, an assortment of alcoholic beverages - and a fancy dress code that will have you dressed in your best and fanciest.",
    img: "news2.jpg"
  },
  {
    id: 3,
    title: "okbet_red’s Step-by-Step Guide: How to Choose the Best Online Casino Games",
    time: "2024/05/02 12:59 PM",
    content:
      "Playing casino games online has become a popular leisure activity for many people, offering a wide variety of options. However, deciding on the right game can be a daunting task, especially for newcomers to online casinos. This guide will highlight important factors to consider when selecting an online casino game.",
    img: "news3.jpg"
  },
  {
    id: 4,
    title: "Mastering Casino Games with okbet_red: Strategies for Success",
    time: "2024/04/25 15:09 PM",
    content:
      "Are you ready to elevate your casino game and beat the odds? With okbet_red, you can enhance your chances of winning by implementing the right strategies and choosing a reputable platform.",
    img: "news4.jpg"
  }
])
const handleDetail = (id: any) => {
  router.push({ name: "NewsDetail", params: { id } })
}
onMounted(async () => {
  window.addEventListener("resize", updateIsMobile)
})

onUnmounted(() => {
  window.removeEventListener("resize", updateIsMobile)
})
</script>

<style lang="sass" scoped>
@import "src/common/css/_variable.sass"
@import "app/template/okbet_redBlack/assets/css/_variable.sass"

.news-area
  margin: 20px auto 40px auto
  width: 1080px

  .content-area
    margin: 40px 0
    .title
      .more
        font-weight: 860
        font-size: 14px
        line-height: 17px
        opacity: 0.5
        font-style: normal
        color: $primary-color
      .bestDeals
        font-weight: 600
        font-size: 28px
        span
          &:nth-of-type(1)
            color: $primary-color
            font-weight: 860
          &:nth-of-type(2)
            margin-left: 8px
            color: $text-charcoal-gray-color

    .news-content-horizontal-wrap
      margin-top: 20px
      width: 100%
      .news-detail-wrap
        --grid-col: 2
        display: grid
        gap: 16px
        grid-template-columns: repeat(var(--grid-col), minmax(0, 1fr))
        .detailWrap
          background: $background-light-color
          border-radius: 16px
          padding: 20px
          width: 100%
          height: 180px
          margin-bottom: 16px
          display: flex
          .image-wrap
            width: 240px
            height: 140px
            border-radius: 8px
            margin-right: 20px
            overflow: hidden
            flex-shrink: 0
            img
              height: 100%
          .info-wrap
            display: flex
            flex-direction: column
            min-width: 0px
            width: 100%
            overflow: hidden
            .title-wrap
              font-weight: 700
              font-size: 18px
              line-height: 21px
              height: 48px
              overflow: hidden
              margin-top: 5px
              margin-bottom: 8px
              word-break: break-all
              .titles
                font-family: OpenSans
                overflow: hidden
                color: $text-night-sky-color
                white-space: inherit
                margin-bottom: 12px
                display: -webkit-box
                -webkit-box-orient: vertical
                -webkit-line-clamp: 2
            .content-wrap
              font-family: OpenSans
              font-weight: 600
              font-size: 14px
              line-height: 20px
              color: $text-steel-blue-color
              height: 40px
              flex: 1 1 0%
              p
                overflow: hidden
                display: -webkit-box
                -webkit-box-orient: vertical
                -webkit-line-clamp: 2

            .footer-wrap
              width: 100%
              display: flex
              align-items: center
              justify-content: space-between
              .date
                font-family: OpenSans
                font-weight: 400
                font-size: 12px
                line-height: 14px
                color: $text-sky-gray-color
              .view-more
                position: relative
                font-family: OpenSans
                font-weight: 400
                font-size: 12px
                line-height: 16px
                margin-right: 20px
                color: $primary-color
                cursor: pointer
                &::after
                  content: ""
                  width: 16px
                  height: 16px
                  position: absolute
                  margin-left: 4px
                  background:  url("app/template/okbet_redBlack/assets/images/svg/arrow-right-blue.svg")


    .news-content-wrap
      margin-top: 20px
      width: 100%
      .news-detail-wrap
        display: grid
        gap: 16px
        grid-template-columns: repeat(var(--grid-cols), minmax(0, 1fr))
        --grid-cols: 3
        --grid-size: 233px
        --box-height: 304px
        --item-height: 304px
        .detailWrap
          background: $background-light-color
          border-radius: 16px
          padding: 16px 24px
          width: 100%
          display: flex
          flex-direction: column
          .contentWrap
            .header-wrap
              display: flex
              -webkit-box-align: end
              align-items: end
              -webkit-box-pack: justify
              justify-content: space-between
              font-family: OpenSans
              font-style: normal
              .day
                font-weight: 700
                font-size: 32px
                line-height: 41px
                color: $text-night-sky-color
                font-family: DINPro
              .year
                font-weight: 500
                font-size: 12px
                margin: 7px 0px 10px
                color: $text-sky-gray-color
                font-family: DINPro
              .time
                font-weight: 400
                font-size: 12px
                line-height: 14px
                color: $text-smoke-gray-color
                margin: 7px 0px 10px
            .title-wrap
              font-weight: 510
              font-size: 16px
              line-height: 18px
              height: 36px
              margin-bottom: 12px
              overflow: hidden
              .title
                color: $text-night-sky-color
                display: -webkit-box
                -webkit-box-orient: vertical
                -webkit-line-clamp: 2
                word-break: break-word
                overflow: hidden
                text-overflow: ellipsis
            .image-wrap
              width: 100%
              height: 170px
              margin-bottom: 12px
              border-radius: 16px
              overflow: hidden
              img
                height: 100%
            .content-wrap
              font-size: 14px
              line-height: 20px
              color: $text-steel-blue-color
              height: 110px
              margin-bottom: 12px
              font-family: OpenSans
              p
                display: -webkit-box
                -webkit-box-orient: vertical
                -webkit-line-clamp: 5
                overflow: hidden
                word-break: break-word
            .footer-wrap
              display: flex
              -webkit-box-pack: end
              justify-content: end
              .view-more
                position: relative
                font-family: OpenSans
                font-weight: 400
                font-size: 12px
                line-height: 16px
                margin-right: 20px
                color: $primary-color
                cursor: pointer
                text-align: end
                &::after
                  content: ""
                  width: 16px
                  height: 16px
                  position: absolute
                  margin-left: 4px
                  background:  url("app/template/okbet_redBlack/assets/images/svg/arrow-right-blue.svg")
                  top: -1px



.news-area-mobile
  width: 100%
  background-color: $background-light-color
  img

  .banner-box
    width: 100%
    padding: 0px 5px
    margin-bottom: 20px
    height: 155px
    img
      width: 100%
      height: 100%
  .title-row
    width: 100%
    display: flex
    -webkit-box-pack: start
    justify-content: flex-start
    margin-bottom: 20px
    .title
      font-weight: 800
      font-size: 1.1rem
      color: $text-deep-ocean-color
      margin-left: 5px
  .contentView
    flex: 1 1 0%
    width: 100%
    height: 100%
    padding: 10px 13px 0px
    overflow: hidden auto
    .list-row
      width: 100%
      .content
        width: 100%
        .flex-box
          width: 100%
          display: flex
          word-break: break-word
          .left-img
            width: 35%
            height: 70px
            border-radius: 8rem
            object-fit: fill
            img
              width: 100%
              height: 100%
          .right
            flex: 1 1 0%
            margin-left: 10px
            .title
              font-weight: 700
              font-size: 0.95rem
              color: $text-night-sky-color
              overflow: hidden
              text-overflow: ellipsis
              display: -webkit-box
              -webkit-box-orient: vertical
              -webkit-line-clamp: 2
            .time
              margin-top: 7px
              font-weight: 400
              font-size: 0.75rem
              color: $text-dusty-blue-color
        .context
          width: 100%
          margin-top: 10px
          font-weight: 400
          font-size: 0.75rem
          color: $text-steel-blue-color
          overflow: hidden
          text-overflow: ellipsis
          display: -webkit-box
          -webkit-box-orient: vertical
          -webkit-line-clamp: 2
        .line
          align-items: center
          border-color: $border-pale-gray-color
          border-style: solid
          border-width: 0
          color: $text-balanced-gray-color
          display: flex
          font-size: 14px
          width: 100%
          margin: 12px 0px
</style>
