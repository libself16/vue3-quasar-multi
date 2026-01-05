<template>
  <div class="news-detail-bg" v-if="!isMobile">
    <div class="news-detail-area">
      <div class="detailMainContent">
        <div class="fast-navigate">
          <svg class="arrow" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M15 18L9 12L15 6"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <a class="home" @click="router.push({ name: 'home' })">Home</a>
          <a @click="router.push({ name: 'News' })">News</a>
          <span>Detail</span>
        </div>
        <div class="divide"></div>
        <div class="publish-date">
          <span>Published on:</span><span class="datetime">{{ newsDetail.time }}</span>
        </div>
        <div class="title">{{ newsDetail.title }}</div>
        <div class="mainContent" v-html="newsDetail.content"></div>
      </div>
    </div>
    <div class="bottom-content-area" v-if="!loading">
      <div class="title">
        <div class="bestDeals">
          <span>Related</span>
          <span>NEWS</span>
        </div>
      </div>
      <div class="bottom-news-content-wrap">
        <div class="news-detail-wrap">
          <div
            class="detailWrap"
            v-for="item in newsData.filter((item) => item.id !== Number(route.params.id))"
            :key="item.id"
            @click="handleDetail(item.id)"
          >
            <div class="bottom-content-wrap">
              <div class="image-wrap">
                <img :src="newsImg(item.img)" />
              </div>
              <div class="title-wrap">
                <div class="text-box">
                  <div class="title">
                    {{ item.title }}
                  </div>
                  <div class="datetime">
                    <div>{{ item.time.split(" ")[0].split("/").slice(0, 2).join("/") }}</div>
                    <div>{{ item.time.split(" ")[2] + " " + item.time.split(" ")[3] }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <FooterArea />
  </div>
  <HeaderTitleBack titleI18n="menu.newsDetails" variant="blackGold" v-else>
    <div class="news-detail-area-mobile">
      <div class="banner-box">
        <img :src="newsImg(newsDetail.img)" />
      </div>
      <div class="title">{{ newsDetail.title }}</div>
      <div class="date">{{ newsDetail.time }}</div>
      <div class="divide"></div>
      <!-- <div class="detailSubText">Promo Period: July 02, 2024 To January 01, 2025</div> -->
      <div class="detailText" v-html="newsDetail.content"></div>
    </div>
    <div class="news-area-mobile" v-if="!loading">
      <div class="contentView">
        <div class="title-row">
          <img
            src="data:image/png;base64,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"
            width="24"
            alt=""
          />
          <div class="title">Related News</div>
        </div>
        <div class="list-row">
          <div
            class="content"
            v-for="item in newsData.filter((item) => item.id !== Number(route.params.id))"
            :key="item.id"
            @click="handleDetail(item.id)"
          >
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
  </HeaderTitleBack>
</template>

<script lang="ts" setup>
import { onMounted, ref, onUnmounted, watch } from "vue"
import { useRoute } from "vue-router"
import { useRouter } from "vue-router"
import { usePromotion } from "src/common/composables/usePromotion"
import type * as Response from "src/api/response.type"
import HeaderTitleBack from "src/common/components/modal/HeaderTitleBack.vue"
import { useSiteImg } from "../../hooks/useSiteImg"
import FooterArea from "app/template/okbet_blackGold/components/Footer/Index.vue"

const { newsImg } = useSiteImg()

const { promotionList, handlePromotionList } = usePromotion()
const router = useRouter()
const route = useRoute()
const isMobile = ref(window.innerWidth <= 768)
const updateIsMobile = () => {
  isMobile.value = window.innerWidth <= 768
}
const newsDetail = ref<{
  id: number
  title: string
  time: string
  content: string
  img: string
}>({
  id: 0,
  title: "",
  time: "",
  content: "",
  img: ""
})

const newsData = ref([
  {
    id: 1,
    title: "OKBet Unaffected by POGO Ban, Continues Operations",
    time: "2024/07/25 - 18:32 PM",
    content:
      "<p>Amidst the recent crackdown on Philippine Offshore Gaming Operators (POGOs) following President Ferdinand Marcos Jr.’s State of the Nation Address (SONA), local gaming platform OKBet has clarified that it remains unaffected by the ban.</p><p><br></p><p>The President’s directive to the Philippine Amusement and Gaming Corporation (PAGCOR) to cease POGO operations by the end of the year has sparked concerns about job losses and economic impact. However, OKBet, a Philippine Inland Gaming Operator (PIGO), assures the public that its operations will continue as usual.</p><p><br></p><p>Unlike POGOs, which cater to foreign customers and operate with offshore licenses, PIGOs are required to be associated with land-based establishments and are subject to stricter regulation by PAGCOR. OKBet, a trusted partner of PAGCOR, adheres to the agency’s guidelines on responsible gaming and holds the necessary permits to operate in the Philippines.</p><p><br></p><p>As the gaming industry undergoes significant changes, OKBet positions itself as a stable and reliable platform for all qualified players. &nbsp;The company remains committed to supporting the local economy and providing secure and enjoyable gaming experiences for all its patrons.</p><p><br></p>",
    img: "news1.jpg"
  },
  {
    id: 2,
    title: "Get the Premium Casino Experience Online with OKBet",
    time: "2024/05/28 - 15:29 PM",
    content:
      "<p>Table games are the kind of games people want to play in the casino because the casino experience elevates the encounter. The casino usually augments the premium gaming experience with live music, entertainment, an assortment of alcoholic beverages - and a fancy dress code that will have you dressed in your best and fanciest.</p><p>What are some types of popular table games you can play online? Table games you can play online are roulette, craps, baccarat, poker, and blackjack. The mentioned four (4) games are accessible for playing on OKBet's website.</p><p><br></p><p><strong>Here are the three types of table games.</strong></p><p><br></p><p><strong>1) Roulette: </strong>Games like virtual bingo have become more popular online. With gaming platforms like OKBet, enjoying table games has become easier. One of the most popular table games online that you can play is roulette. Roulette, in the history of gaming, has been one of the staple table games you can play online and in a land casino.</p><p>Roulette takes its name from a French phrase that translates to little wheel. There is a high probability that roulette's origins were developed after the Italian game of birbi. The game has since offered glamour, mystery, and entertainment to its players ever since its inception during the 17th century.</p><p>Playing the game is easy. First, you have to pick and place a bet on a number. Then, after placing your bet, the croupier spins a wheel in one direction. Then, they spin a ball in the opposite direction around a tilted circular track around the wheel's outer edge. If the wheel lands on the value you have bet on, then you are declared the winner, and you will be paid your winnings. When you play roulette, you also observe a range of bets, with a maximum and minimum betting value set.</p><p><br></p><p><strong>2) Craps: </strong>The next game is craps. Craps is an action-packed dice game that is easy to learn. You can also play craps online. The premise of craps is to bet on a value within a pair of rolled dice. Due to its easy gameplay, you can play informally.</p><p>Some believe that craps is hard to play due to its rules. However, it is quite the contrary because it can be played anywhere, anytime, and uses minimal props. There are also fewer errors with craps, which adds to the fun experience of playing it.</p><p><br></p><p><strong>3) Baccarat: </strong>You can play the classic game of baccarat at casinos and online. The three outcomes whenever you play baccarat include the Banker winning, the Player winning, and lastly, the tie.</p><p>When you play baccarat in a land casino, the dealer will deal your cards face up. There are two for the Player (you) and the Banker. If you have bet on the Banker, then that gives you an advantage because the odds favor the Banker. So what else happens if you have placed your bet on the Banker? What happens when you’ve placed your bet on the Banker is that it will pay 95 (95%) of your wager.</p><p>When you’re playing live in a casino premise, the dealer usually hands out the cards to you with the cards’ face down. If you have bet on the Player, whoever has the total hands closest to nine wins the game.</p><p><br></p><p><strong>A Range of Table Games on OKBet</strong></p><p><br></p><p>There are plenty of table games for you to enjoy. It has become easier to enjoy and access table games online. Going online has become beneficial for gaming companies and players because this means more fun and chances of winning.</p><p>OKBet is an online gaming website with a diverse range of online games. OKBet's roster includes table games such as poker, craps, baccarat, and others. In addition, OKBet also has fishing games, in case you want a hiatus from playing online table games. Play to win at OKBet now!</p>",
    img: "news2.jpg"
  },
  {
    id: 3,
    title: "OKBet’s Step-by-Step Guide: How to Choose the Best Online Casino Games",
    time: "2024/05/02 - 12:59 PM",
    content:
      "<p>Playing casino games online has become a popular leisure activity for many people, offering a wide variety of options. However, deciding on the right game can be a daunting task, especially for newcomers to online casinos. This guide will highlight important factors to consider when selecting an online casino game.</p><p><br></p><p><strong>Identify Your Preferred Game Type:<br></strong>Begin by identifying the type of games you enjoy the most. Whether it's slots, table games like roulette or blackjack, or other popular casino games, knowing your preference will help narrow down your search.</p><p><br></p><p><strong>Explore Game Bonuses:<br></strong>Check for special bonuses offered specifically for the game you want to play. Online casinos often provide various bonuses, such as free play credits or deposit match bonuses. Understand whether these bonuses require real money deposits or can be used with play money.</p><p><br></p><p><strong>Choose Reputable Online Casinos:</strong></p><p>Opt for online casinos that are regulated by independent authorities. This ensures fair gameplay and reliable payouts, giving you peace of mind while you play.</p><p><br></p><p><strong>Review Terms and Conditions:<br></strong>Before committing to a game, thoroughly read the terms and conditions of the online casino. Pay attention to withdrawal policies, bonus restrictions, and game eligibility for bonuses.</p><p><br></p><p><strong>When researching online casinos:</strong></p><p><strong><br></strong>1) Read player reviews to gauge overall satisfaction and game selection.</p><p>2) Consider deposit requirements and minimum account funding.</p><p>3) Evaluate game features such as graphics quality, sound effects, and special promotions like free spins or jackpot opportunities.</p><p><br></p><p>Online casino games have diverse offerings in terms of gameplay, bonuses, and overall experience. By exploring different online casinos and understanding their features, you can find the ideal game that suits your preferences. Remember to consider factors like game variety, bonuses, and reputation when making your choice.<br></p><p><br></p><p>For a comprehensive and enjoyable online casino experience, consider exploring reputable platforms like OKBet. OKBet offers a range of exciting games, transparent terms, and reliable services, ensuring a rewarding gaming experience for players.<strong><br></strong></p><p><br></p><p>So, take your time to research and discover the perfect online casino game for you, and enjoy the thrill of playing with confidence on platforms like OKBet!</p>",
    img: "news3.jpg"
  },
  {
    id: 4,
    title: "Mastering Casino Games with OKBet: Strategies for Success",
    time: "2024/04/25 - 15:09 PM",
    content:
      "<p>Are you ready to elevate your casino game and beat the odds? With OKBet, you can enhance your chances of winning by implementing the right strategies and choosing a reputable platform. </p><p><br></p><p>Here's how you can ensure victory and maximize your casino experience at OKBet:</p><p><br></p><p><strong>1) Stay Focused on Winning</strong></p><p><strong>- </strong>In the realm of online gambling, distractions can abound, from enticing visuals to alluring promotions. However, it's essential to keep your eyes on the prize.</p><p><strong>-</strong> Unlike traditional casinos' Party Pits, where distractions like bikini-clad dealers may be rampant, OKBet prioritizes fair gameplay without compromising on payouts.</p><p><strong>- </strong>While other platforms may lure you with flashy gimmicks, OKBet maintains transparent odds, ensuring that your winnings are maximized.</p><p><br></p><p><strong>2) Avoid Chasing Losses</strong></p><p><strong>- </strong>It's natural to encounter losing streaks during your gaming sessions. However, succumbing to the temptation of chasing losses can exacerbate the situation.</p><p><strong>- </strong>OKBet encourages responsible gambling practices, reminding players to stay within their session bankroll limits.</p><p><strong>- </strong>By resisting impulsive bets and focusing on strategic gameplay, you can mitigate losses and maintain a balanced approach to gaming.</p><p><br></p><p><strong>3) Master Gambling Strategies</strong></p><p><strong>- </strong>Successful players understand the importance of strategy in games like poker and baccarat.</p><p><strong>- </strong>OKBet provides a wealth of educational resources, including blogs and tutorials, to help players hone their skills and make informed decisions.</p><p><strong>- </strong>By familiarizing yourself with effective gambling strategies, you can gain a competitive edge over other players and increase your chances of winning.</p><p><br></p><p><strong>4) Exploit Game Rules</strong></p><p><strong>- </strong>Understanding the intricacies of casino games can give you a significant advantage.</p><p><strong>- </strong>Just as Joseph Jagger capitalized on a biased roulette wheel in 1873, savvy players can exploit game mechanics to their benefit.</p><p><strong>- </strong>OKBet ensures fair gameplay while empowering players to leverage their knowledge of game rules for strategic advantage.</p><p><br></p><p><strong>5) Practice and Persistence</strong></p><p><strong>- </strong>Like any skill, mastering casino games requires practice and perseverance.</p><p><strong>- </strong>Video poker, in particular, offers favorable odds for skilled players. OKBet provides a platform for players to hone their skills and improve their gameplay over time.</p><p><strong>- </strong>By dedicating yourself to continuous improvement and learning from both wins and losses, you can enhance your proficiency and increase your chances of success.</p><p><br></p><p><strong>Play to Win with OKBet!</strong></p><p><br></p><p>Ready to take your casino gaming to the next level? Join OKBet today and start implementing the strategies outlined above.With a diverse range of games, secure platform, and enticing promotions, OKBet offers everything you need for an exceptional online gambling experience. Sign up now and discover why OKBet is the preferred choice for players seeking excitement, rewards, and unparalleled entertainment.</p>",
    img: "news4.jpg"
  }
])
const loading = ref(false)
const handleDetail = (id: any) => {
  loading.value = true
  router.push({ name: "NewsDetail", params: { id } })
}
watch(
  () => route.params.id,
  (newId) => {
    window.location.reload()
  }
)
onMounted(async () => {
  window.addEventListener("resize", updateIsMobile)
  const news = newsData.value.find((news) => news.id.toString() === route.params.id)
  if (news) {
    newsDetail.value = news
  }
})

onUnmounted(() => {
  window.removeEventListener("resize", updateIsMobile)
})
</script>

<style lang="sass" scoped>
@import 'src/common/css/_variable.sass'
@import "app/template/okbet_blackGold/assets/css/_variable.sass"

.news-detail-bg
  background:  url("app/template/okbet_blackGold/assets/images/news/newsbg.png") no-repeat
.bottom-content-area
  margin: 20px auto 40px auto
  width: 1080px
  .title
    height: 50px
    margin-bottom: 20px
    .more
      font-weight: 860
      font-size: 14px
      line-height: 17px
      opacity: 0.5
      font-style: normal
      color: $primary-gold-color
    .bestDeals
      font-family: OpenSans
      font-weight: 600
      font-size: 28px
      span
        &:nth-of-type(1)
          color: $primary-gold-color
          font-weight: 860
        &:nth-of-type(2)
          font-weight: 500
          margin-left: 8px
          color: $primary-white-color
  .bottom-news-content-wrap
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
        height: 264px
        border-radius: 24px
        overflow: hidden
        margin-right: 16px
        position: relative
        display: inline-block
        flex: 1 1 0%
        cursor: pointer
        .title-wrap
          position: absolute
          inset: 0px
          z-index: 1
          padding: 24px
          background: $primary-gray-color
          display: flex
          flex-direction: column
          .text-box
            flex: 1 1 0%
            display: flex
            flex-direction: column
            justify-content: flex-end
            .title
              font-family: OpenSans
              font-weight: 510
              font-size: 16px
              line-height: 20px
              height: 40px
              color: $primary-white-color
              margin-bottom: 12px
              width: 100%
              overflow: hidden
              text-overflow: ellipsis
              display: -webkit-box
              -webkit-line-clamp: 2
              -webkit-box-orient: vertical
            .datetime
              font-family: OpenSans
              font-weight: 500
              font-size: 12px
              line-height: 15px
              color: $secondary-white-color
              display: flex
              justify-content: space-between
              div
                &:nth-of-type(2)
                  font-family: Arial
        .image-wrap
          width: 100%
          height: 100%
          position: absolute
          img
            height: 100%


.news-detail-area
  width: 1080px
  margin: -10px auto
  background: $primary-black-color
  border-radius: 24px
  position: relative
  top: 20rem
  margin-bottom: 23rem

  .detailMainContent
    padding: 40px 48px
    .fast-navigate
      color: $secondary-gray-color
      font-family: OpenSans
      font-style: normal
      font-weight: 400
      font-size: 16px
      line-height: 19px
      position: relative
      display: flex
      -webkit-box-align: center
      align-items: center
      .arrow
        height: 20px
        width: 20px
        cursor: pointer
      a
        color: $secondary-gray-color
        cursor: pointer
        position: relative
        text-decoration: none
        &::after
          content: "/"
          margin: 0px 8px
      span
        color: $primary-gold-color
    .divide
      width: 100%
      height: 1px
      background: $primary-gray-color
      margin-top: 20px
    .publish-date
      font-family: OpenSans
      font-weight: 400
      font-size: 14px
      line-height: 17px
      color: $secondary-gray-color
      margin-bottom: 20px
      margin-top: 40px
      .datetime
        margin-left: 10px
        font-weight: 510
        color: $primary-gray-color

    .ellipsis
      display: -webkit-box
      -webkit-line-clamp: 2
      -webkit-box-orient: vertical
      overflow: hidden
      text-overflow: ellipsis
    .title
      font-weight: 860
      font-size: 40px
      line-height: 48px
      color: $primary-white-color
      margin-bottom: 20px
      font-family: OpenSans
    .mainContent
      font-style: normal
      font-weight: 400
      font-size: 16px
      line-height: 32px
      color: $primary-gray-color
      font-family: OpenSans







.news-detail-area-mobile
  width: 100%
  padding: 12px
  font-family: Helvetica
  .banner-box
    width: 100%
    img
      height: 100%
      border-radius: 16px
  .date
    font-weight: 300
    font-size: 13px
    color: $secondary-gray-color
  .title
    color: $primary-white-color
    font-size: 16px
    font-weight: 700
    margin-top: 20px
  .divide
    width: 100%
    margin: 10px 0px
    border-color: $primary-gray-color
    align-items: center
    border-style: solid
    border-width: 0
    color: $secondary-gray-color
    display: flex
    font-size: 14px

  .detailText
    color: $primary-white-color
    font-size: 15px
    font-weight: 400



.news-area-mobile
  width: 100%
  .title-row
    width: 100%
    display: flex
    -webkit-box-pack: start
    justify-content: flex-start
    margin-bottom: 20px
    .title
      font-weight: 800
      font-size: 1.1rem
      color: $primary-white-color
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
              color: $primary-white-color
              overflow: hidden
              text-overflow: ellipsis
              display: -webkit-box
              -webkit-box-orient: vertical
              -webkit-line-clamp: 2
            .time
              margin-top: 7px
              font-weight: 400
              font-size: 0.75rem
              color: $secondary-gray-color
        .context
          width: 100%
          margin-top: 10px
          font-weight: 400
          font-size: 0.75rem
          color: $primary-gray-color
          overflow: hidden
          text-overflow: ellipsis
          display: -webkit-box
          -webkit-box-orient: vertical
          -webkit-line-clamp: 2
        .line
          align-items: center
          border-color: $primary-gray-color
          border-style: solid
          border-width: 0
          color: $secondary-gray-color
          display: flex
          font-size: 14px
          width: 100%
          margin: 12px 0px
</style>
