<template>
  <div v-for="item in informationList" :key="item.title" class="card">
    <div class="title">
      {{ item.title }}
    </div>
    <div v-for="(paragraph, index) in item.detail" :key="index">
      <div v-if="typeof paragraph === 'string'" class="detail">{{ paragraph }}</div>
      <div v-else class="detail-group">
        <div class="detail">{{ paragraph.main }}</div>
        <div v-for="(subItem, subIndex) in paragraph.subItems" :key="subIndex" class="sub-rule">
          {{ subItem }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, Ref } from "vue"
import { useEnv } from "src/common/hooks/useEnv"

const { companyName } = useEnv()

interface DetailItem {
  main: string
  subItems: string[]
}

interface InformationItem {
  title: string
  detail: (string | DetailItem)[]
}

export default defineComponent({
  name: "PrivacyPolicy",
  setup() {
    const informationList: Ref<InformationItem[]> = ref([
      {
        title: "Policy Statement",
        detail: [
          `
            ${companyName.value} takes your privacy and the security of any information related to your personal data very
            seriously. This policy will describe how we protect the information you provide and the steps involved. It also
            explains how and where we collect your personal information and your rights with respect to any personal
            information we hold under our guidelines under the Data Privacy Act 2012.
          `,
          `
            Other countries may have different privacy protection laws than the Philippines. We are constantly working to
            adjust our policies to achieve best practices in the security and protection of private data. Conversely, we do
            not guarantee that our privacy policies and practices comply with the requirements of foreign jurisdictions.
          `
        ]
      },
      {
        title: "Scope and Commitment",
        detail: [
          "The Privacy Statement and our Data Privacy Policy apply to all personal information, whether physical or digital, processed manually or automatically. When you use the services provided by the company or log in to register, you have accepted our privacy statement and agreed to our collection, use, disclosure, retention and protection of your personal information in accordance with these terms.",
          "If you submit any personal information or sensitive personal information on behalf of others, you must declare that you have the right to provide such information and allow us to use said personal information in accordance with this Privacy Policy. If you do not wish to provide personal information for us to use, the company may not be able to provide or inform you of the requested products and services."
        ]
      },
      {
        title: `Please note that ${companyName.value}'s services are not intended for or against`,
        detail: [
          `Subjects under the age of 21. Anyone (including immediate family members) serving in the Philippine government, PAGCOR, ${companyName.value}, law enforcement, or military personnel. Your Rights & Preferences`,
          "Under the Data Privacy Act, you have the following rights the company is obligated to protect:",
          "(a) Your rights to be informed whether personal information pertaining to you, are being or have been processed",
          {
            main: "(b) Your rights to be furnished the information indicated below before the entry of your personal information into the processing system of the personal information controller, or at the next practical opportunity: Description of the personal information to be entered into the system",
            subItems: [
              "Purposes for which they are being or are to be processed",
              "Scope and method of the personal information processing",
              "The recipients or classes of recipients to whom they are or may be disclosed",
              "Methods utilized for automated access, if the same is allowed by the data subject, and the extent to which such access is authorized",
              "The identity and contact details of the personal information controller or its representative",
              "The period for which the information will be stored; and",
              "The existence of your rights, i.e., to access, correction, as well as the right to lodge a complaint before the National Privacy Commission (NPC)."
            ]
          },
          {
            main: "(c) Your rights of reasonable access to, upon demand, of the following:",
            subItems: [
              "Contents of your personal information that were processed",
              "Sources from which personal information were obtained",
              "Names and addresses of recipients of the personal information",
              "Manner by which such data were processed",
              "Reasons for the disclosure of the personal information to recipients",
              "Information on automated processes where the data will or likely to be made as the sole basis for any decision significantly affecting or will affect the data subject",
              "Date when your personal information concerning the data subject were last accessed and modified; and",
              "The designation, or name or identity and address of the personal information controller"
            ]
          },
          "(d) Your rights to dispute the inaccuracy or error in the personal information and have the personal information controller correct it immediately and accordingly, unless the request is vexatious or otherwise unreasonable. If the personal information has been corrected, the personal information controller shall ensure the accessibility of both the new and the retracted information and the simultaneous receipt of the new and the retracted information by recipients thereof.",
          "(e) Your rights to suspend, withdraw or order the blocking, removal or destruction of your personal information from the personal information controller's filing system upon discovery and substantial proof that the personal information are incomplete, outdated, false, unlawfully obtained, used for unauthorized purposes or are no longer necessary for the purposes for which they were collected. In this case, the personal information controller may notify third parties who have previously received such processed personal information; and should you feel that your rights under the Data Privacy Act was disregarded, you are granted the right to file a complaint, and the right to seek indemnity for damages sustained, if any."
        ]
      },
      {
        title: "Collected Personal Information",
        detail: [
          "Personal data (or personal information) means any information about an individual from which that person can be identified. It does not include data where the identity has been removed (anonymous data).",
          "We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:",
          "Identity Data includes first name, maiden name, last name, username or similar identifier, date of birth and gender.",
          "Contact Data includes billing address, delivery address, email address and telephone numbers.",
          "Financial Data includes bank account and payment card details.",
          "Transaction Data includes details about payments to and from you and other details of products and services you have purchased from us.",
          "Technical Data includes internet protocol (IP) address, pc tag, your login data, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform and other technology on the devices you use to access this website.",
          "Profile Data includes your username and password, purchases or orders made by you, your interests, preferences, correspondence feedback and survey responses.",
          "Usage Data includes information about how you use our website, products and services.",
          "Marketing and Communications Data includes your preferences in receiving marketing from us and our third parties and your communication preferences.",
          "We also collect, use and share Aggregated Data such as statistical or demographic data for any purpose. Aggregated Data may be derived from your personal data but is not considered personal data in law as this data does not directly or indirectly reveal your identity. For example, we may aggregate your Usage Data to calculate the percentage of users accessing a specific website feature. However, if we combine or connect Aggregated Data with your personal data so that it can directly or indirectly identify you, we treat the combined data as personal data which will be used in accordance with this privacy policy."
        ]
      },
      {
        title: "How We Collect Your Personal Data",
        detail: [
          "Identification and Contact Information",
          "These may include, but are not limited to, sharing special information, events, offers, and promotions via email, direct mail, social media, phone, SMS, and similar methods.",
          "Non-marketing Purposes",
          "These may include, but are not limited to, validating identity, conducting digital demographic or performance analysis, conducting surveys, handling reservations, purchases, and related transactions, security and surveillance, and in complying with laws and regulatory guidelines. Communications and Opting Out",
          "We only wish to message you, primarily via email, with communications and notifications that you might find useful or want to receive. These may include, but are not limited to, sharing special information, events, offers and promotions; contacting you regarding certain reservations and inquiries, bookings, or related transactions; and regular updates for special interest groups associated with our programs. The emails we send include an opt-out mechanism within the message itself. By clicking on the unsubscribe link, you will be opted-out from our mailing list at no cost. How we share your personal information",
          "We will only share your personal data with your permission. Depending on the circumstances, we may share your personal data with the following recipients:",
          `a. For the purpose of anti-money laundering, fraud detection and/or control, ${companyName.value} has the right to transfer your personal data to third parties, including but not limited to third-party suppliers such as the Anti-Money Laundering Commission, PAGCOR, other financial institutions, etc. Integrity Units, Banks, ID and Address Verification System Providers, Payment Service Providers and Financial Institutions, but only if we guarantee that they meet the same standards with regard to data processing and security. We encourage you to read the privacy policies of our third-party suppliers.`,
          `b. In addition, we reserve the right to disclose your personal data to relevant third parties, such as groups directly related to GAVIN VENTURES, Inc., our regulators,financial integrity units, especially when ${companyName.value} has reasonable grounds to suspect that there is a breach in your account behavior.`,
          "c. Your data will also be shared with cloud services, data centers, payment services, banks, authentication tools, customer communication tools, game providers, etc. for routine operational purposes.",
          "d. Subject to our regulatory responsibilities, we have the right to share personal information we hold, including personal statistics and/or betting history, with sports organisations to investigate fraud, money laundering or sports integrity issues.",
          "e. We will take all reasonable steps to ensure that your personal data is processed securely, with due care and in compliance with applicable legal requirements. How We Store & Secure Your Personal Information"
        ]
      },
      {
        title: `${companyName.value} assures you that your personal data is:`,
        detail: [
          "processed in accordance with your rights;",
          "processed fairly and lawfully;",
          "obtained only for the above purposes;",
          "adequate, relevant and not excessive for its purpose;",
          "kept in a secure manner;",
          "not kept longer than is necessary for its purposes.",
          `${companyName.value} shall take all reasonable steps to ensure that your information is kept secure and protected. In this regard, we maintain appropriate technical and organizational measures to protect your data against unauthorized or unlawful processing.`,
          `While you are a customer, we will need to retain your information to meet our legal and contractual requirements. However, when you cease using ${companyName.value}'s Services, we will still retain your personal information for a period of time. There are several reasons why we retain your information, these include:`,
          "To comply with legal obligations under Philippine local laws (for example, anti-money laundering regulations, or licensing regulations);",
          "To establish or defend legal claims (for example negligence claims) which could be made against us;",
          "To comply with our contractual obligations and rights in relation to the information involved;",
          "Our legitimate interests where we have carried out balancing tests;",
          "To comply with guidelines issued by relevant data protection authorities.",
          "We are encrypting sensitive information such as credit card or debit card number, mobile number, email address, username and password stored in our databases.",
          "Only the application will be able to decrypt such information provided with high level of security of user access in which all events or activities are being logged in the secured server.",
          "However, we have no control and therefore cannot enforce the same amount of security on any of the devices that you use to access our site, or to send us information via email, messaging apps, or our website. We are therefore not responsible for the security and protection of information that may have been intercepted prior to our receipt of your personal data."
        ]
      },
      {
        title: "Updates to this Privacy Statement",
        detail: [
          `This Privacy Policy may be updated from time to time to reflect changes in the way we work or the way our work is regulated - so you may wish to check it each time you submit personal information to us. The date of the most recent revision will be displayed on this page. If you do not agree to these changes, please do not continue to submit personal information to ${companyName.value} or use our services in any way. Otherwise, you will be deemed to have accepted the changes to the Privacy Policy. You can also delete your ${companyName.value}/account at any time. If there is a material change to the Privacy Policy, such as affecting how we want to use your personal information, we will provide a more prominent notice (including, for some services, notification of the Privacy Policy change by email), and you will be required to expressly accept this Class changes to continue to use the Service, the changes will apply immediately upon your acceptance of the changes.`
        ]
      },
      {
        title: "Your Obligation",
        detail: [
          `By using our Website and by providing your personal data, you acknowledge that you are required to provide your actual, accurate and complete data as requested by ${companyName.value}. Furthermore, you must inform us of any changes to your information so as to ensure it is kept up-to-date and accurate.`,
          "If you are found to be in breach of your obligations or if we have reasonable suspicion that the information you provide is false or incomplete or in any way contrary to Data Privacy Act of 2012 or this Policy, we retain the right to reject your application for registration or to suspend or terminate your account immediately without notice. In this case, you have no right to any compensation due to the rejection of your application, or the suspension or termination of your account.",
          "Responsible Gaming"
        ]
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
@import "app/template/okbet_redBlack/assets/css/_variable.sass";

.card {
  background: $background-light-color;
  box-shadow: rgba($box-shadow-soft-slate-gray-color, 0.1) 0px 3px 10px;
  border-radius: 8px;
  margin: 10px 0px;
  padding: 10px 20px;

  @include phone-width {
    border-radius: 0px;
  }

  .title {
    font-family: serif;
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    color: $text-charcoal-gray-color;
    padding-bottom: 10px;
    margin-bottom: 10px;
    border-bottom: 1px solid $border-pale-gray-color;

    @include phone-width {
      font-family: OpenSans;
      font-weight: 700;
      font-size: 16px;
    }

    &::before {
      content: "";
      display: inline-block;
      width: 3px;
      height: 16px;
      background-color: $primary-color;
      margin-right: 5px;
    }
  }

  .detail {
    font-family: OpenSans;
    font-size: 14px;
    line-height: 24px;
    font-weight: 400;
    color: $text-charcoal-gray-color-light;
    margin-bottom: 15px;
  }

  .detail-group {
    margin-bottom: 15px;
  }

  .sub-rule {
    font-size: 14px;
    font-weight: 400;
    color: $text-charcoal-gray-color-light;
    padding-left: 20px;
    position: relative;
    margin-bottom: 10px;
  }
}
</style>
