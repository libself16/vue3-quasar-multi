<template>
  <div class="about-us-wrapper">
    <div v-for="item in informationList" :key="item.title" class="about-us-content">
      <div class="title">
        {{ item.title }}
      </div>
      <div class="detail" v-html="item.detail"></div>
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
  name: "TermAndCondition",
  setup() {
    let informationList: Ref<InformationItem[]> = ref([
      {
        title: "General Terms & Condition",
        detail:
          '<p>Apart from the Terms &amp; Conditions of this Agreement, please review our Privacy Policy and other rules, policies and terms and conditions relating to games and promotions available on the Site as posted on the Site from time to time, which are included here by reference, together- the same as any other policy that you may notify us of from time to time. </p><p><span style="font-size: 0.9rem;">By clicking the "Submit upon account registration" button below and using the Software (as defined below) you agree to the terms and conditions set out in this Agreement along with the Privacy Policy and other rules relating to games and promotions available as their respective. can be updated or changed from time to time in accordance with the conditions below. You further acknowledge that your failure to comply with this agreement may result in disqualification, account closure, confiscation of your funds as deemed appropriate and more specifically described below.</span><br></p>'
      },
      {
        title: "Definations",
        detail:
          '<p> "Games" means the internet gaming system accessible and/or offered on the Site.\r\n\r\n "Device(s)" means any application access devices, including but not limited to personal computers, laptops, mobile telephones, personal digital assistants, PDA telephones employed for the use of and access to the Site and participation in the Services.</p><p> \r\n\r\n"The information" means information provided on the Site including but not limited to results, statistics, sports data, odds and betting data. \r\n\r\n "Software" means any computer programme, data file or any other content that is required to be installed on your Device in order to enable you to use, access and participate in the Services for the purpose of using, accessing and participating in the foregoing on the Website through your Device. \r\n\r\n "The Services" means the Software and Games together.</p>'
      },
      {
        title: "Grant of License/Intellectual Property",
        detail:
          "<p>WINSOFT is licensed and therefore regulated to operate online sportsbook and casino via electronic media on a global basis under permits from the Isle of Man and Kahnawake, Canada. </p><p>Whilst it is intended that the online sportsbook and casino will operate under (WINSOFT`s licences), WINSOFTreserves the right to switch any of the operations of the business to another jurisdiction at any time. </p><p>\r\n\r\n Subject to the terms &amp; conditions contained herein WINSOFT grants you a personal, non-transferable and non-exclusive right to use the WINSOFT Software, to access information on the WINSOFT website through the Device(s) and to play the Games available. </p><p>\r\n\r\n You acknowledge and agree that the Software that is made accessible to you is part of the Services and is the property of WINSOFT and/or our licensor, and that you do not gain any rights to such Software. The Software is licensed to you by WINSOFT for your private personal use. </p><p>Please note that the Software is not for use by (i) individuals under 18 years of age, (ii) individuals under the legal age of majority in their jurisdiction, and (iii) individuals connecting to the Site from jurisdictions from which it is illegal to do so. </p><p>WINSOFT is not able to verify the legality of the Service in each jurisdiction and it is your responsibility to verify such matters. </p><p>\r\n\r\n WINSOFT assumes no liability for correctness, completeness or up-to-datedness of the Services provided, for example results made available on the Site. WINSOFT also assumes no liability for the accuracy of livescores, statistics and intermediate results in in-running betting. </p><p>\r\n\r\n WINSOFT reserves the right at any time to request from you evidence of age in order to ensure that minors are not using the Service. We further reserve the right to suspend or cancel your account and exclude you, temporarily or permanently, from using the Service if satisfactory proof of age is not provided or if we suspect that you are underage. \r\n\r\n The Software`s code, structure and organisation are protected by copyright, trade secrets, intellectual property and other rights. \r\n\r\n</p>"
      },
      {
        title: "Modification and Amendment",
        detail:
          "<p>You fully understand and agree to be bound by this Agreement as modified and/or amended by WINSOFT from time to time. WINSOFT reserves the right to amend this Agreement or any part thereof at any time. </p><p>If we make such modification and/or amendment we will place a notice of such change on the Site. It is your responsibility to check these Terms &amp; Conditions and the Privacy Policy from time to time to ensure that you agree with them and your continued use of the Site will be deemed to be your acceptance of any amendments and/or modifications to the Agreement. </p><p>\r\n\r\n Any bets placed prior to the time of amendment and/or modification will be subject to the pre-existing Terms &amp; Conditions. Any bets placed after the time of amendment and/or modification will be subject to the changed Terms &amp; Conditions. If any modification is unacceptable to you, your only recourse is to terminate this Agreement.</p>"
      },
      {
        title: "Account Registration",
        detail:
          "<p>You are required to complete the application for the opening of an account and membership as set out on Site. \r\n\r\nYou agree that you are required to provide us with certain personal details about yourself (including details regarding your methods of payment) for the purpose of using the Services. Our control of the information provided by you shall be subject to our Privacy Policy.</p><p><br></p><p>You undertake that you will provide full and truthful information in respect of all details and information provided by you to WINSOFT. You are obligated to update such details in the event of any change thereto. To confirm your name and address WINSOFT&nbsp;reserves the right to confirm such data by post and to correspond by post.<br></p><p>\r\n\r\n </p><p><br></p><p>Your account must match your true and legal name and identity and the name on your account registration must match the name on the credit card(s) or other payment accounts used to deposit or receive monies in your account. \r\n\r\n We reserve the right to reject your registration without reference to you or without assigning any reason thereto and without liability to you. </p><p><br></p><p>Where account registration details are found to be inaccurate, misleading or incomplete, WINSOFT&nbsp;reserves the right to close the account, returning monies deposited to the same funding account but voiding any wagers placed. <br>\r\n</p>"
      },
      {
        title: "Settlement of Transactions",
        detail:
          '<p>To use a credit or debit card, the cardholder`s name must be the same as the name given in the registration process. WINSOFT&nbsp;reserves the right to withhold settlement of any transaction should there be discrepancies between the cardholder`s name and the name given in the registration process.\r\n</p><p>\r\n You are responsible for paying all monies owed to WINSOFT&nbsp;and/or other members. In respect of any payment made by you, if we suspect that you have engaged or attempted to engage in fraudulent, unlawful, dishonest or improper activity whilst using the Site, including without limitation, engaging in game manipulation using stolen credit cards, or any other fraudulent activity (including any chargeback, other reversal of a payment, or money laundering)</p><p><span style="font-size: 0.9rem;">WINSOFT</span>&nbsp;shall be entitled to take such action as it sees fit, including immediately blocking access to the Site, suspending and/or closing your account, seizing all monies held in your WINSOFT&nbsp;account and sharing this information (together with your identity) with other online gaming sites, financial institutions, relevant authorities and/or any person or entity that has the legal right to such information. </p><p><span style="font-size: 0.9rem;">WINSOFT</span>&nbsp;may also take legal action against you. Any expenses incurred by WINSOFT&nbsp;shall be claimed from you.\r\n\r\n In accordance with the laws of the Isle of Man all online gambling debts are enforceable by law.\r\n\r\nThe maximum amount that can be won by one customer in any one day of betting, regardless of the stake, is USD$500,000 or its equivalent in an accepted currency.\r\n\r\nWinnings are exclusive of bet amount. </p><p>Where selections taken from different categories are combined in multiple or accumulative bets the lowest maximum winnings limit will apply.\r\n\r\nShould funds be credited to your account in error, it is your responsibility to notify WINSOFT&nbsp;of the error without delay. Any winnings subsequent to the error and prior to the notification of WINSOFT, whether linked to the error or not, shall be deemed invalid and must be returned to WINSOFT.</p>'
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
