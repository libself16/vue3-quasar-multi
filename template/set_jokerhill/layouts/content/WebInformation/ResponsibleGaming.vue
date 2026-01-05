<template>
  <div class="about-us-wrapper">
    <div v-for="(item, index) in informationList" :key="index" class="about-us-content">
      <div class="detail" v-html="item.detail"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, Ref } from "vue"
import "vue3-carousel/dist/carousel.css"

interface InformationItem {
  detail: string
}

export default defineComponent({
  name: "ResponsibleGaming",
  setup() {
    let informationList: Ref<InformationItem[]> = ref([
      {
        detail:
          "<p>Responsible Gambling<br></p><p>As a Premium Malaysian Casino, we take care of the Responsible Gambling for each and every player of us. We have a license from the reputed authority. This also means that we have to be very strict about keeping an eye on the players and the time they spend online.<br></p><p>We at ALADINCASH Referral know the attraction of being online and betting on games across categories is high. Moreover, the glitz and thrill of winning may even push the punters to keep bidding regularly or for a long time.</p><p>On the other hand, we are aware of the punters who have lost all their betting without control. Thus, we have ensured in coming up with various methods of allowing gambling responsibly.</p><h4>Steps Taken by ALADINCASH Referral</h4><ol><li><p>Restrict Betting Automatically :&nbsp;We feel that to help you curb your gambling activity, the best and the most practical way is to limit the deposit. This has been effective, and it is set at a maximum of 1000 Ringgit. Once you reach this limit per day, you will not be able to bet or spend anymore. Since our site only allows for one USER ID per head, we will also not allow you to try from any other account.</p></li><li><p>Set Limits :&nbsp;This is the second method we have employed. As players, you set a limit on your daily, weekly, and monthly spending. This is what you have to do once at the beginning of the month. Once you reach this level, you cannot bet more. We advise this method to every new or first-time gamer to practice.</p></li><li><p>Gambling Problem Complaints :&nbsp;At our site, we get players who love our site and the games immensely. However, their love may sometimes over-exceed their spending capacity. They may end up becoming a problem for their entire family. This is where our 24-hour hotline service will come in handy.</p></li></ol><p>Bankroll management is something everyone needs to work on before coming to play online.</p><h4>Signs of Problem Gambling</h4><p>As a proud member of Responsible Gambling, our company has strong policies on how to help people gamble with care. These are the signs of problem gambling we offer help in:</p><ul><li>Borrowing or selling jewels and personal items for gambling</li><li>Stealing and/or selling things not yours</li><li>Finding it difficult to resist gambling</li><li>Constantly thinking about gambling</li><li>Spending more than you can ever win</li><li>Thinking that you can repay loans by gambling and winning</li><li>Assuming that gambling online for long can help in winning big</li><li>Getting yourself isolated from family and social circle</li><li>Reducing interaction with others</li><li>Feeling guilty about the irresponsible attitude towards family or work</li></ul><p>If you have or see anyone with these behavioral changes, do not hesitate to contact us. These are a few among the other problems as posted by the Responsible Gambling Council</p><h4>Call for Self Exclusion</h4><p>We appreciate it if you want to self-exclude your account for some time. Just call us at our customer support number, and we shall be happy to help.</p><h4>Seeking for Professional Help</h4><p><span style='font-size: 14px; display: inline !important;'>BeGambleAware</span><br></p><p>BeGambleAware is an international NGO that is constantly helping gamblers to reduce or quit any addicted gambling activities. There is a big different between casual playing and hard-core gambling, and this is usually unnoticed by any gambler themselves. The three aspects of BeGambleAware’s mission is, firstly, to instruct the public about the importance and danger of addicted gambling. Second, to enhance the activities to prevent the factors of the issue. Lastly, saving people who are currently facing gambling-related issues by offering professional assist, counsel, and guidance.<br><br>info.Name: BeGambleAware<br>info.Contact Number: +44 808 802 0133<br>info.Email:&nbsp;info@gambleaware.org<br>info.Website: https://about.gambleaware.org/</p><p>GamCare</p><p>One of the leading providers of information, counsel, and help for the people facing any problems related to gambling. GamCare has been offering the sympathetic services to the people since they started operating in 1997. They have been helping people by offering one-to-one counsel, advice, emotional support, and more. People may contact GamCare via phone call, email, forums, or even the 24/7 live chat on their official website.<br><br>info.Name: GamCare<br>info.Contact Number: +44 207 801 7011<br>info.Email:&nbsp;info@gamcare.org.uk<br>info.Website: https://www.gamcare.org.uk/</p>"
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
        .detail
            color: #FFF
            font-family: "NotoSansTC"
            font-size: 14px
            font-style: normal
            font-weight: 400
            line-height: normal
            text-transform: capitalize
</style>
