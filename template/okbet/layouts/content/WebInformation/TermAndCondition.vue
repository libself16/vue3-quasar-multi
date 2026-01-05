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
  name: "TermAndCondition",
  setup() {
    const informationList: Ref<InformationItem[]> = ref([
      {
        title: "General Introduction and Definition",
        detail: [
          `
            Ownership of ${companyName.value} website belongs to GAVIN VENTURES, INC. a company duly registered under the laws of the Republic of the Philippines and currently has a license issued by the Philippine Amusement and Gaming Corporation (PAGCOR) and is supervised by it, and having its official registered website
            This terms and conditions constitute the complete, final and exclusive agreement between the Account Holder and ${companyName.value}, and governing the contractual relationship between ${companyName.value} and the Account Holder. The ${companyName.value} Terms and Conditions supersede and merge all prior agreements, representations and understandings between the Account Holder and ${companyName.value}. By opening an ${companyName.value} Account, registering, logging-in, using the Services, participating in the games, or accepting any Prize, a visitor or an Account Holder fully understands and agrees:
            to become a party to the ${companyName.value} Rules
            that he/she has read, understood and will be adhering to these Terms and Conditions
            that he/she shall abide by all its terms.
          `,
          `
            ${companyName.value} reserves the right to update, amend, edit and supplement the ${companyName.value} Terms and Conditions at any time. Any substantial amendment to the ${companyName.value} Terms and Conditions herein shall be notified in advance by ${companyName.value} to the Account Holder before coming into effect.
            All references in the ${companyName.value} Rules to the singular shall include the plural and vice versa. All references to “the” shall include “a/an” and vice versa.
            The account holder must read this agreement carefully and completely before accepting the services. This agreement forms a legally binding agreement between the account holder and ${companyName.value} (herein referred to as "${companyName.value}"). GAVIN VENTURES, INC. is www.${companyName.value}.com and ${companyName.value} mobile version app (hereinafter defined as "website" or "site").
            When an account holder clicks the "Register" or "Complete Registration" button during the registration process and use the software specified below, it means that he/she fully agrees to the rules and terms listed in the agreement, privacy protection rules, and other related gambling and website regular updates. Any violation of this agreement, will have the following consequences (deprivation of membership, account closure, confiscation of funds or other related legal proceedings).
          `
        ]
      },
      {
        title: "Definition of Terms",
        detail: [
          `1. “${companyName.value} account" is an account held by an Account Holder, for bona fide transactions, with a strict aim to establish a normal commercial relationship with ${companyName.value} and with the strict purpose of conducting betting and other gaming and gambling transactions.`,
          `2. "Equipment" refers to all application equipment, including all equipment used to access online services but not limited to personal computers, notebooks, mobile phones, personal electronic devices, PDA phones, etc.`,
          `3. "Game" refers to the online entertainment system provided on the website.`,
          `4. "Software" refers to all computer programs, data files or any other requirements that are installed on a device and in turn capable of accessing websites and participating in services through the Internet.`,
          `5. "Sports betting" refers to "sports", "casino" or "poker" and other related services and online entertainment provided by the website.`,
          `6. "Information" refers to the information provided on the website, including but not limited to match results, statistics, sports data, odds, etc.`,
          `7. "Website" is the internet gateway accessible through the internet address www.${companyName.value}.com where all current and relevant information regarding ${companyName.value}'s operations is published, and through which the Services are provided to the Account Holders.`,
          `8. "Service" is the gaming and betting offers provided by ${companyName.value} to the Account Holder through the Website.`,
          `9. "Card" refers to all types of cards with a function of "payment", "charge", "debit", "credit", "virtual" and/or similar.`,
          `10. "Payment Solution Provider" is an intermediary acting as a payment agent for various different payment methods.`,
          `11. “Regulator” is the Philippine Amusement and Gaming Corporation (PAGCOR), which is the regulatory authority established by Philippine law to govern all forms of gaming in the Philippines. For more information, please go to https://www.pagcor.ph/`,
          `12. "Financial Institution" is a bank and/or other institution regulated by an applicable domestic financial services Act or similar.`,
          `13. “Client Application” shall mean the web browser application opened by the Account Holder in order to use the Services.`,
          `14. “Software” shall mean all software used by ${companyName.value} to offer and/or operate the Services and/or run the Client Application.`,
          `15. “Prize” is an amount, a bonus or a reward that can be won by the Account Holder.`,
          `16. “Inactive Account” is an ${companyName.value} Account which has not recorded any log-in and/or log-out for a period exceeding 6 consecutive months.`
        ]
      },
      {
        title: `License/Intellectual Property`,
        detail: [
          `The coding and organizational structure of the software belong to ${companyName.value}’s copyright, trade secrets, intellectual property rights and other rights. An account holder or a visitor must not:`,
          `Forward and/or transfer streaming media services and project videos to any other person through the website, or post relevant information on any electronic communication website or service website accessible by third parties.`,
          `Copy, distribute, publish, reverse engineer, reverse compile, disassemble, modify, or translate the software or try to obtain the source code to make derivative files.`,
          `Sell, distribute, sublicense, transfer, distribute or rent the software.`,
          `Provide the software to third parties via the Internet or other means.`,
          `Export the software to any country through electronic transmission or other means without the written permission of ${companyName.value}. Use the software for any illegal purposes by nature.`,
          `If there are any losses, expenses or related commission fees caused by any illegal use, the perpetrator shall bear the responsibility.`,
          `All trademarks, service marks and trade names as well as images, graphics, text, concepts or methodologies (collectively the “Intellectual Assets”) found on the Website, the Client Application and the material contained therein are the exclusive property of ${companyName.value} and/or ${companyName.value}’s suppliers and partners. The Account Holder or any website visitor is not entitled to exploit or otherwise use any Intellectual Asset for whatever purpose, except for what is allowed by law.`
        ]
      },
      {
        title: "Financial Security",
        detail: [
          `The funds of ${companyName.value} registered members are deposited separately from the company funds in a client account held with a Financial Institution approved by the Regulator. ${companyName.value} will take measures to ensure that customer funds are not directly connected to any funds of the company. Client’s funds will be protected by all means.`,
          `${companyName.value} reserves the right to adjust any aspect of its business operations at any time to comply with other judicial regulations.`
        ]
      },
      {
        title: `Account Holder Registration, Access and Security`,
        detail: [
          `1. ${companyName.value} recognizes customers' personal rights (non-transferable and not exclusive) to use ${companyName.value} website software, use equipment to obtain information on the website, and participate in online games.`,
          `2. The ${companyName.value} website software is not suitable for the following people:`,
          `A. Under 21 years old.`,
          `B. Where in the jurisdiction where they belong, they are below their legal age.`,
          `C. According to local judicial regulations, visiting the website is illegal and/or ${companyName.value} cannot identify whether the customer's behavior is legal in the local jurisdiction such as:`,
          `a) Public officials, which includes elective and appointive officials and employees, permanent or temporary, whether in the career or non-career service, whether or not they receive compensation, regardless of amount.`,
          `b) Members of the Armed Forces of the Philippines, including the Army, Navy, Air Force or Philippine National Police;`,
          `c) Persons under 21 years of age or students of any school, college or university in the Philippines;`,
          `d) PAGCOR officials and employees;`,
          `e) Gaming site Operators and employees;`,
          `f) Unregistered players;`,
          `g) Banned individuals;`,
          `h) Spouse, common-law partner, children, parents of officials and persons mentioned in items (a), (b), and (d) above`,
          `i) Players currently residing outside of the Philippines;`,
          `D. ${companyName.value} employees and relatives of ${companyName.value} employees ("relatives" refer to spouses, partners, parents, children or brothers and sisters.), or any ${companyName.value} related former employees or relatives of former employees within 6 months of resignation (Including anything connected with ${companyName.value}).`,
          `3. In order to prevent people who do not meet the legal age from using the services, ${companyName.value} reserves the right to require customers to provide proof of age at any time. If the account holder doesn’t qualify for the age standard or we suspect that he/she is below the age standard, we have the right to suspend/cancel the ${companyName.value} account for a long-term/short-term period to prevent the unauthorized use of the services.`,
          `4. An individual cannot participate in a game for money unless that individual is an Account Holder. To be registered as a player, an individual must submit an application for registration and; must faithfully understand and fulfill the following terms:`,
          `a) The account holder is not an individual whose capacity is restricted by law;`,
          `b) The account holder’s statutory actions can only represent him/her personally, but not other people or other companies;`,
          `c) The account holder understands that his/her participation in ${companyName.value} services is purely voluntary;`,
          `d) The account holder is not experiencing nor diagnosed with Compulsive Gambling Disorder nor registered as a Self-Excluded player in accordance to the guidelines set by the Regulator;`,
          `e) The account holder fully agrees that certain personal information (including specific information about payment methods) must be provided to ${companyName.value} for confirmation when using its services. ${companyName.value} will follow the privacy policy to manage and control the information provided;`,
          `f) The account holder is responsible for the relevant taxes arising from gaming profits;`,
          `g) The account holder can only use the website for personal purposes. He/she shall only place bets for personal entertainment;`,
          `h) The account holder is not a citizen of the following countries: Anguilla, Antarctica, Argentina, Australia, Belgium, Bermuda, Bosnia and Herzegovina, Bouvet Island, British Indian Ocean Territory, British Virgin Islands, Cayman Islands, Channel Islands, Christmas Island, Cocos Islands, Croatia, Cyprus, Denmark (including Greenland and the Faroe Islands), Estonia, Ethiopia, Falkland Islands, France (including French Guiana, French Polynesia, French Southern Territory, Guadeloupe, Martinique) , Mayotte, New Caledonia, Reunion, Saint Martin, Saint Pierre and Miquelon, Saint Barthélemy, Wallis and Futuna), Germany, Gibraltar, Greece , Hilde and McDonald Islands, Hungary, Andhra Pradesh, Nagaland, Rajasthan, Sikkim, Tamil Nadu, Telangandi; Ireland, Iran, Iraq, Israel, Italy , Latvia, Lithuania, Montserrat, Netherlands (including Aruba, Bonaire, Curaçao, Saba, St. Eustatius and St. Martin), Norfolk Island, North Korea, Pakistan, Pitcairn Island, Poland, Portugal, Puerto Rico, Romania, Serbia, Singapore, Slovakia, South Africa, Georgia and the South Sandwich Islands, South Sudan, Spain, Sri Lanka, the State of Palestine, Swaziland, Sweden, Switzerland, Syria, Trinidad and Tobago, Tunisia, Turkey, Turks and Caicos Islands, Uganda, Ukraine, the United Kingdom and the United States of America (including American Samoa, Guam and the U.S. Virgin Islands), Vanuatu, Yemen;`,
          `i) The account holder agrees and can bear the risk of loss caused by using this service, ${companyName.value} does not bear any risk for its loss;`,
          `j) All of the account holder’s deposit is not from illegal or criminal activities;`,
          `k) The account holder must not engage in any illegal activities by using his/her ${companyName.value} account, or allow others to use its account to engage in any activities that violates both local and ${companyName.value} rules;`,
          `l) The account holder shall keep the account credentials including the password properly and must not allow others to use it. If in case the password has been forgotten or lost, the ${companyName.value} Customer Service Department will assist in setting up a new security information after a thorough authentication process;`,
          `m) The account holder is responsible for ensuring the confidentiality of the ${companyName.value} account and login information. Any online gambling conducted with the account holder’s username and password will be considered valid;`,
          `n) When using ${companyName.value} services, websites, equipment, software or related information, the account holder or a visitor must not in any way hinder other members from enjoying the services that ${companyName.value} provides;`,
          `o) Stealing any relevant information of other members is strictly prohibited;`,
          `p) Uploading or publishing any virus-bearing programs, files or data that affect the performance of the website equipment, software, services, etc. is strictly prohibited;`,
          `q) The account holder shall not attempt to modify, reverse compile, reverse engineer or disassemble the software in any form;`,
          `r) The account holder must not use any equipment, automatic equipment, software, programs or other methods (similar to the aforementioned) to hinder or attempt to interfere with the normal operation of the services, equipment, software, URL, information or any transaction provided by the website, use of artificial intelligence Including the unrestricted plug-in system is strictly forbidden to connect to the server. All customer service operations must be performed by the player through the use of ${companyName.value} program interface;`,
          `s) The account holder must not post any illegal information about harassment, insults, defamation, threats, obscenity, and incitement to racial dissatisfaction on the website or equipment or to other users, or any criminal behavior that constitutes or encourages criminal acts, or causes civil liability incidents, etc. And other related illegal information;`,
          `t) The account holder is not allowed to initiate or participate in investigations, quizzes, or mass release of chain letters/spam mails, mail peddling and other activities aimed at ${companyName.value};`,
          `u) The account holder cannot have multiple accounts at the same time. If ${companyName.value} find that a customer has multiple accounts, the company has the right to cancel their accounts and place bets. The company reserves the right to cancel or close the duplicate account. The company reserves the right to restrict customers to keep only one of the accounts;`,
          `v) The account holder must not be a professional player in any sport, competition or league where ${companyName.value} offers betting;`,
          `w) The account holder must not deposit nor withdraw through a Card which the Account Holder is not authorized to use and/or utilizing a Card in a jurisdiction in which betting and gaming are prohibited;`,
          `x) The account holder must not be employed or employs individuals who makes use of a system (including machines, robots, computers, software or any other automated system) designed to defeat or capable of defeating the Client Application and/or Software;`,
          `y) The account holder is not possessing an active account with another legal entity which is part of the same group as ${companyName.value}, meaning other entities directly or indirectly controlled by GAVIN VENTURES, INC;`,
          `z) The account holder must not find the Website or the Services offensive, objectionable, unfair, nor indecent; and to maintain his/her ${companyName.value} Account details up-to-date in terms of the following: first and last name, valid email address, phone number and any vital information as required by ${companyName.value};`,
          `aa) The account holder shall not allow any other individual, including any minor, to use or reuse its created ${companyName.value} Account, access and/or use any material or information from the Website, accept any Prize, or access and/or participate in the Services;`,
          `bb) The account holder must not sell, transfer or acquire account from or to other players. Funds cannot be transferred between ${companyName.value} accounts;`,
          `cc) The account holder’s name must be true, legal and consistent with the Proof of Identity submitted. It must also be ensured that the account name matches the name on the Card or any type of payment method used for deposit and withdrawals;`,
          `dd) The account holder is not allowed to access the website through the use of a proxy server or any tool that interferes with the IP address of the device being used, or to take any measure that will prevent ${companyName.value} from identifying the correct IP address of the device being used to access the website;`,
          `ee) The account holder agrees with the application of the above general terms and agree that if there is any suspicion or violation of the customer's behavior, ${companyName.value} has the right to report to the relevant authorities without prior notice or explanation.`,
          `ff) The minimum succeeding deposit is set at Php 500. As courtesy to its players, ${companyName.value} shall bear the cost of any transaction fees through providing a credit in the player’s ${companyName.value} account.`,
          `gg) Minimum withdrawal amount is set at Php 300 per transaction and the daily withdrawal limit for normal account is set at Php 1,250,000. ${companyName.value} will shoulder the transaction fee of up to 3 withdrawal requests per day through providing a credit in the player’s ${companyName.value} account otherwise all succeeding withdrawals are subject to applicable transaction fees.`,
          `hh) The account holder must agree that for every successful deposit, they must need to reach the required 100% turnover before they can submit a withdrawal.`
        ]
      },
      {
        title: `Account Management`,
        detail: [
          `${companyName.value} reserves the right at its own discretion and at all times, to:`,
          `1. Decline to open a ${companyName.value} Account and/or to close or suspend an existing ${companyName.value} Account without any explanation whatsoever.`,
          `2. Decline to accept deposits without any explanation whatsoever.`,
          `3. Request documents to verify:`,
          `a.the identity of the Account Holder,`,
          `b.his/her authorization to use a specific Card or any payment method;and/or`,
          `c.other facts and information provided by the Account Holder.`,
          `4. Such request may be made at any given moment and ${companyName.value} reserves the right to suspend an account pending investigation.`,
          `5. Transfer and/or license, without prior notice, data regarding an Account Holder to any other legal entity, in any country, ultimately managed and controlled by GAVIN VENTURES, INC., subject to ${companyName.value} guaranteeing that the said data at all times is transferred and managed in accordance with applicable laws, data protection acts and/or similar.`,
          `6. Transfer and/or license, without prior notice, the rights and liabilities regarding an Account Holder to any other legal entity, in any country, ultimately managed and controlled by GAVIN VENTURES, INC., subject to ${companyName.value} guaranteeing the liabilities being honored.`,
          `7. Hold and manage funds belonging to Account Holders in accordance with generally accepted guidelines for cash management regarding such funds; this may include a Financial Institution and/or a Payment Solution Provider being entrusted to hold funds in the name of and/or for the benefit of Account Holders.`,
          `8. Perform its Forfeiture Policy which includes the following provisions:`,
          `a. Forfeit and/or confiscate funds available on a ${companyName.value} Account and/or refuse to honor a claim, in the event that, directly or indirectly: (i) the ${companyName.value} Rules have been violated; and/or (ii) other unauthorized activities have occurred in connection with a betting event and/or the operation of a ${companyName.value} Account (such as, but not limited to, breach of the law or other regulations, breach of a third party’s rights, fraud, and cheating)`,
          `b. Suspend and/or cancel the participation of an Account Holder in the games, promotional activities, competitions or other services, whenever ${companyName.value} is of the opinion that there are legitimate concerns that a ${companyName.value} Account is, has been, or may be used for illegal, fraudulent or dishonest practices;`,
          `c. Suspend and/or cancel the participation of the Account Holder in the Services, and/or forfeit and/or confiscate funds available on their ${companyName.value} Account if the Account Holder is found in direct violation of any provisions of its Terms and Conditions such as:`,
          `• Cheating`,
          `• Irregular gaming such as equal, zero or low margin bets or hedge betting in order to circumvent the bonus turnover requirement`,
          `• Unauthorized account takeover which is made through sharing the same device and/or using any other related indicators such as IP address and shared common betting behavior`,
          `• Employing or using a system (including machines, robots, computers, software or any other automated system) designed to defeat or capable of defeating the Client Application and/or Software.`,
          `• Other methods which are in direct violation of the ${companyName.value} Terms and Conditions.`,
          `9. Decline and/or reverse the withdrawal of unspent or otherwise unused deposits until the verification of these funds is deemed satisfactory.`
        ]
      },
      {
        title: `Account Dormancy`,
        detail: [
          `If the ${companyName.value} account has been suspended in accordance with the clauses above, and has already been suspended for more than 6 months or an ${companyName.value} account has been dormant for more than 6 months since the last login time, ${companyName.value} reserves the right to charge a monthly administrative fee until the account balance reaches zero. The administrative fee deducted shall vest in ${companyName.value} on deduction from the Suspended Account and will cease to form part of the Account Holder’s funds. ${companyName.value} reserves the right to close the Suspended Account once the account reaches zero balance. If there are no funds on the account, the account will not be charged and it will be closed immediately.`,
          `${companyName.value} warrants and represents at all times to:`,
          `Manage funds belonging to Account Holders in a secure and appropriate manner; and/or`,
          `Manage data regarding an Account Holder in accordance with applicable laws, data protection acts and/or similar;`,
          `Not offer contingencies to customers to proceed to any fund transfer between customers’ accounts.`
        ]
      },
      {
        title: `Betting Rules and Regulations`,
        detail: [
          `1. All bets on the ${companyName.value} website must comply with relevant game rules and this agreement.`,
          `2. Any typographical error or unintentional human error in the announcement of the odds and/or result, ${companyName.value} is not responsible for the consequences, and ${companyName.value} has the right to cancel related bets.`,
          `3. Under any circumstances, ${companyName.value} reserves the right to refuse any bet without giving an explanation.`,
          `4. Only bets that comply with the terms and agreements through ${companyName.value} website or equipment will be considered valid. Regardless of the result, any other forms of betting (by letter, mail, fax or other means) will not be accepted or deemed invalid. The bet slip takes effect as soon as the confirmation message appears on the screen.`,
          `5. It is the account holder’s responsibility to be aware about the match score and all relevant match information. It is advised that the customer verify the match status before placing a bet.`,
          `6. The account holder acknowledges that the current score, time elapsed and other data provided on the site, while coming from a “live” feed provided by a third party is subject to a time delay and/or may be inaccurate, and that any bet placed based on this data is entirely at the customer’s own risk. ${companyName.value} provides this data as-is with no warranty as to the accuracy, completeness or timeliness of such data and accepts no responsibility for any loss (direct or indirect) suffered by the customer as a result of his reliance on it.`,
          `7. All bets are considered valid if they meet the following conditions: the username and password are entered correctly, and the account balance is sufficient.`,
          `8. The account holder is responsible for the security of his account and this includes all transactions and behaviors that occur through his/her account, regardless of whether the transaction is authorized or unauthorized.`,
          `9. If the supplied betting information is correct, the account holder is the only person responsible for this bet. Once the client application confirms the bet, the bet cannot be cancelled, withdrawn or changed, and the bet slip will be regarded as the valid evidence of the bet.`,
          `10. All betting records entered by ${companyName.value} will be stored in the ${companyName.value} transaction database software and will be used as a valid basis for any transaction at any time.`,
          `11. All bets that show confirmed status in the transaction records of ${companyName.value} customer accounts are considered valid bets by the company.`,
          `12. Except for live betting, ${companyName.value} have the right to cancel bets placed after the scheduled start of the game.`,
          `13. All bets for which the result of the match is already known at the time of betting will be considered invalid. ${companyName.value} reserves the right to cancel such bets.`,
          `14. The event information (starting time of the event, red card, score or other related information) displayed on the website is for reference only.`,
          `15. The results of the event are confirmed after the event, unless otherwise stated in the relevant sport or event rules. ${companyName.value} will not recognize any amendments or changes made to results for bets that have already been settled 72 hours after the event ended. ${companyName.value} only corrects unintentional human errors or incorrect results within a period of 72 hours.`,
          `16. If the venue of the event changes, all bets placed at the original location will be cancelled, except for neutral ground events which will still be considered valid.`,
          `17. The winner or loser of the game will be confirmed after the end of the game in accordance with relevant rules.`,
          `18. ${companyName.value} does not recognize interrupted matches and controversial proposals.`,
          `19. If a match is interrupted and continued within 48h after initial kick-off, all open bets will be settled with the final result. Otherwise, all undecided bets are considered void.`,
          `20. If there is an invalid option in the bet offer, the bet will be adjusted and settled according to the remaining valid options.`,
          `21. The account holder knows and accepts that all odds and market lines are constantly changing and will only be determined at the moment of betting. ${companyName.value} reserve the right, at its sole and absolute discretion, to change the odds, prices, or any information on a bet type, market or event at any time.`,
          `22. ${companyName.value} likewise reserve the right at its sole discretion to either void or reject any affected bets at any time or to correct any error when by error, omission or mistake the incorrect odds, prices, or any information on a bet type, market or event at any time where displayed.`,
          `23. If the players/teams are displayed incorrectly, ${companyName.value} reserve the right to void betting.`,
          `24. If markets remain open with an incorrect score or Incorrect match status which has a significant impact on the prices, ${companyName.value} reserve the right to void betting.`,
          `25. If there are any technical problems in the system, ${companyName.value} reserves the right to manually change the status of a pending bet to “confirmed” when the transaction resumes and as soon as the technical problem has been resolved. At that time, the account balance will be adjusted to reflect the member's betting at that time.`,
          `26. Multiple bets placed on the same event at the same time will not be recognized.`,
          `27. ${companyName.value} has the final decision on any related betting and transactions.`,
          `28. The account holder fully accepts the random shuffling of the system software in the poker game, and accept other random game transactions.`,
          `29. The account holder agrees and accept that WAP network links are not always stable. The company only recognizes the bets recorded in the system, and ${companyName.value} is not responsible for any misplaced bets.`,
          `30. Unless listed either in conjunction with the bet offer, or else in the Sport Specific rules, all bets should be considered valid for the result at the end of the "Regular Time" or "Full Time" only. "Regular Time" or "Full time" is defined as interpreted by the official rules published by the respective governing association. For example, in Football, full time is stipulated to be 90 minutes including injury time. Should the governing association decide to stipulate, before the start of the event, that the said event is to be played over a different duration, this will be treated as being the official rules for the event (for example, football matches played with 3 x 30 minutes or 2 x 40 minute formats). Nonetheless, such occurrence is limited to the "regular" playing time and does not include any prolongation such as extra time or overtime, unless explicitly stated.`,
          `31. "Livebetting" is where it is possible to bet during an ongoing match or event. ${companyName.value} does not acknowledge or accept any liability whatsoever if it not possible to place a bet or the live score update is not correct. At all times it is the Account Holder's responsibility to be aware of the match and the events surrounding it such as the current score, its progression and how much time remains before the match is completed. ${companyName.value} does not accept any liability for changes to the Livebetting schedule or interruption of the Livebetting service.`,
          `32. Whenever there’s evidence of fraud, game-fixing or rigging, ${companyName.value} reserves the right to make bets void or withhold payment pending the outcome of any investigation.`
        ]
      },
      {
        title: `Event-specific Rules`,
        detail: [`Please refer to our ${companyName.value} Sports Betting Game Rules.`]
      },
      {
        title: `Transaction Policy`,
        detail: [
          `For players who use credit/debit cards or any other type of payment method, the bank card name must be the same as the account holder's name when registering. If the bank card name is inconsistent with the account holder’s name when registering, ${companyName.value} reserves the right to refuse any transaction requested.`,
          `If the customer has debts to ${companyName.value} or any of its members, the customer must bear the responsibility of repaying the debts. In terms of payment, if a customer is suspected of fraud, including the use of a stolen credit card, or other fraud (such as recovering or subverting payment or money laundering), ${companyName.value} has the right to immediately freeze and/or close the customer’s account and confiscate the account balance, and publish its information (indicating its identity) to any online entertainment websites, banks, credit card companies, and related institutions and individuals that have the right to access this information. Any costs incurred by ${companyName.value} will be incurred by the perpetrator involved in the said malicious activities.`,
          `Refund Policy`,
          `1. No refund can be completed once the alleged deposit (including the bonus) has been played using the ${companyName.value} Services.`,
          `2. A refund request will only be considered if it is requested within the first twenty-four (24) hours of the alleged transaction, or within thirty (30) days if a Player alleges that another individual (or a minor) has accessed his/her Player Account or if there was any PAGCOR violation incurred.`,
          `3. ${companyName.value} reserve the right to withhold any refund or reverse transaction until the identity of the Player Account User is adequately established to its satisfaction, in order to ensure that any payment made will be honored after a refund has been made. The player agrees to provide, in case demanded, a notarized identification, or any other certified identification in accordance with the applicable Philippine laws. If such notarized or certified identification is not provided within five (5) days of the request, then such refund or reverse transaction shall not be affected, the Player Account shall be closed and ${companyName.value} shall forfeit all funds in the Player Account. Such decision shall be final, binding and not subject to appeal.`
        ]
      },
      {
        title: `KYC Policy`,
        detail: [
          `${companyName.value} Know Your Customer Policy or the KYC Policy is designed to prevent and mitigate possible risks of ${companyName.value} being involved in any kind of illegal activity.`,
          `Both international and local regulations require ${companyName.value} to implement effective internal procedures and mechanisms to prevent money laundering, terrorist financing, drug and human trafficking, proliferation of weapons of mass destruction, corruption and bribery and to take action in case of any form of suspicious activity from its Users.`,
          `KYC Policy covers the following matters:`,
          `1. Verification procedures.`,
          `2. Sanctions and PEP lists screening.`,
          `3. Compliance Officer.`,
          `4. Monitoring Transactions.`,
          `5. Risk Assessment.`,
          `Verification procedures`,
          `One of the international standards for preventing illegal activity is customer due diligence (“CDD”). According to CDD, ${companyName.value} establishes its own verification procedures within the standards of anti-money laundering and “Know Your Customer” frameworks.`,
          `Identity verification`,
          `${companyName.value}’s identity verification procedure requires the User to provide ${companyName.value} with reliable, independent source documents, data or information (e.g., national ID, international passport, bank statement, utility bill), one time video call verification and selfie with the valid ID. For such purposes ${companyName.value} reserves the right to collect User’s identification information for the KYC Policy purposes and verify it within 24 hours.`,
          `The following documents will be the acceptable IDs according to the PAGCOR Regulatory Framework:`,
          `Driver’s License`,
          `PhilHealth ID`,
          `Postal ID`,
          `NBI Clearance`,
          `Senior Citizen Card`,
          `Overseas Workers Welfare Administration (OWWA)`,
          `ID Passport (Philippine/Foreign)`,
          `Firearms License`,
          `Police Clearance`,
          `Integrated Bar of the Philippines ID`,
          `Seaman’s Book`,
          `Professional Regulations Commission`,
          `Overseas Filipino Workers (OFW) ID`,
          `Social Security System (SSS) Card`,
          `Tax Identification (TIN)`,
          `Unified Multi-Purpose ID (UMID)`,
          `Voter’s Certificate and/or Voter’s ID`,
          `Maritime Industry Authority (MARINA) ID`,
          `Philippine National ID`,
          `Valid Passport`,
          `Alien Certificate of Registration`,
          `Immigrant Certificate of Registration`,
          `National ID`,
          `${companyName.value} will take steps to confirm the authenticity of documents and information provided by the Users. All legal methods for double-checking identification information will be used and ${companyName.value} reserves the right to investigate certain Users who have been determined to be risky or suspicious.`,
          `${companyName.value} reserves the right to verify User’s identity on an on-going basis, especially when their identification information has been changed or their activity seems to be suspicious (unusual for the particular User). In addition, ${companyName.value} reserves the right to request up-to-date documents from the Users, even though they have passed identity verification in the past.`,
          `User’s identification information will be collected, stored, shared and protected strictly in accordance with the ${companyName.value}’s Privacy Policy and related regulations.`,
          `Once the User’s identity has been verified, ${companyName.value} is able to remove itself from potential legal liability in a situation where its Services are used to conduct illegal activity.`,
          `Card verification`,
          `The Users who are intended to use payment cards in connection with the ${companyName.value}’s Services are required to undergo a verification process in accordance with instructions available on the ${companyName.value}’s Site.`,
          `Sanctions, Minor, Government Officials, PNP/AFP, excluded and PEP lists screening.`,
          `${companyName.value} screens applicants against recognized Sanctions, Minor, Government Officials, PNP/AFP, excluded and Politically Exposed Persons (PEPs) lists. Individuals and legal entities are screened against mentioned lists:`,
          `1. On the onboarding stage when the user is submitting the application;`,
          `2. On each anti-fraud and AML alerts manually by Compliance Officer;`,
          `3. Monthly by running automatically with a script to re-check all DB of customers.`,
          `4. For the screening process ${companyName.value} uses PAGCOR Sanctions, Minor, Government Officials, PNP/AFP, excluded and Politically Exposed Persons (PEPs) database for manual confirmation.`,
          `${companyName.value} reserves the right to ask for additional proof regarding a player's current location by whatever means necessary in compliance with the current PAGCOR guideline stating that only individuals residing inside the Philippines shall be allowed to play.`,
          `Compliance Officer`,
          `The Compliance Officer is the person, duly authorized by ${companyName.value}, whose duty is to ensure the effective implementation and enforcement of the KYC Policy. It is the Compliance Officer’s responsibility to supervise all aspects of ${companyName.value}’s anti-money laundering and counter-terrorist financing, including but not limited to:`,
          `1. Collecting Users’ identification information.`,
          `2. Establishing and updating internal policies and procedures for the completion, review, submission and retention of all reports and records required under the applicable laws and regulations.`,
          `3. Monitoring transactions and investigating any significant deviations from normal activity.`,
          `4. Implementing a records management system for appropriate storage and retrieval of documents, files, forms and logs.`,
          `5. Updating risk assessment regularly.`,
          `6. Providing law enforcement with information as required under the applicable laws and regulations.`,
          `The Compliance Officer is entitled to interact with law enforcement, which are involved in prevention of money laundering, terrorist financing and other illegal activity.`,
          `Monitoring Transactions`,
          `The Users are known not only by verifying their identity (who they are) but, more importantly, by analyzing their transactional patterns (what they do). Therefore, ${companyName.value} relies on data analysis as a risk-assessment and suspicion detection tool. ${companyName.value} performs a variety of compliance-related tasks, including capturing data, filtering, record-keeping, investigation management, and reporting. System functionalities include:`,
          `Daily check of Users against recognized “black lists” (e.g. PAGCOR National Database of Restricted Persons), aggregating transfers by multiple data points, placing Users on watch and service denial lists, opening cases for investigation where needed, sending internal communications and filling out statutory reports, if applicable;`,
          `Case and document management.`,
          `With regard to the KYC Policy, ${companyName.value} will monitor all transactions and it reserves the right to:`,
          `1. Ensure that transactions of suspicious nature are reported to the proper law enforcement through the Compliance Officer;`,
          `2. Request the User to provide any additional information and documents in case of suspicious transactions;`,
          `3. Suspend or terminate User’s Account when ${companyName.value} has reasonable suspicion that such User engaged in illegal activity.`,
          `4. The above list is not exhaustive and the Compliance Officer will monitor Users’ transactions on a day-to-day basis in order to define whether such`,
          `transactions are to be reported and treated as suspicious or are to be treated as bona fide.`,
          `Risk Assessment`,
          `${companyName.value}, in line with the PAGCOR compliance, has adopted a risk-based approach to combating money laundering and terrorist financing. By adopting a risk-based approach, ${companyName.value} is able to ensure that measures to prevent or mitigate money laundering and terrorist financing are commensurate to the identified risks. This will allow resources to be allocated in the most efficient ways. The principle is that resources should be directed in accordance with priorities so that the greatest risks receive the highest attention.`
        ]
      },
      {
        title: "Anti-Money Laundering (AML) Policy",
        detail: [
          `Money laundering is defined as the process intended to mask benefits derived from serious criminal offenses or criminal conduct, as described under Anti-Money Laundering Act of 2001 REPUBLIC ACT NO. 9160, to make it appear that such benefits originated from a legitimate source. Generally, money laundering is composed of three (3) stages involving several transactions which could alert an intermediary such as the Company to the money laundering activity:`,
          `Placement – the physical act of disposing of the cash proceeds drawn from illegal activities`,
          `Layering – the act of separating illicit proceeds from their source by creating complex tiers of financial transactions in order to disguise the audit trail and provide anonymity`,
          `Integration – the act of providing an appearance of legitimacy to criminally- derived wealth. If the layering process is successful, the integration step places the laundered proceeds back into the economy in a manner that their re-entry into the financial system has the appearance of being normal business funds ${companyName.value} Anti-Money Laundering Strategies`,
          `${companyName.value} endeavors to apply the following principles in order to detect, prevent and oppose the use of the Company’s services for money laundering and terrorist financing:`,
          `1. Established and duly appointed Compliance Official`,
          `2. Know-Your-Customer Process (CDD and EDD)`,
          `3. Reporting to the AMLC`,
          `4. Ongoing Employee Training`,
          `5. Ongoing monitoring and Compliance Testing`,
          `6. Record Keeping and Data Retention in accordance with AML laws and regulations`,
          `7. Internal Audit Function.`,
          `Regulatory Compliance`,
          `${companyName.value} ensures that its business is conducted in conformity with the height of ethical standards, that laws and regulations are respected and complied with whenever possible, and that service is not provided where there is good reason to believe that transactions are associated with money laundering activities.`,
          `Partnership with Philippine Law Enforcement Agencies`,
          `Within the legal constraints relative to client confidentiality, ${companyName.value} cooperates with law enforcement agencies. This includes taking appropriate measures within the law if there are reasonable grounds for suspecting money laundering. Any disclosure made in conjunction with the Act shall be made to the applicable governing body.`
        ]
      },
      {
        title: "Bonus",
        detail: [
          `When an account holder gets a chance to win a bonus from ${companyName.value}, any bonus must comply with this agreement and the relevant additional terms provided.`,
          `${companyName.value} reserves the right to offer a specific bonus to a specific customer or group of customers.`,
          `Players must comply with the relevant provisions and restrictions before withdrawing the bonus amount from the account, otherwise they will not be processed.`,
          `The account holder's withdrawal currency must be consistent with the deposit currency.`,
          `${companyName.value} reserves the right to withdraw or modify bonuses or promotional activities and/or related specific terms and rules at any time, and does not assume the responsibility of explaining to customers or third parties.`,
          `If an account holder is under self-exclusion, ${companyName.value} will make reasonable efforts to return the account balance in accordance with existing terms and conditions. Please see Responsible Gaming guideline for more information.`,
          `The maximum winnings allowable with freebet or no-deposit-bonus shall not exceed the ₱5000. Any winnings beyond this limit will be considered null and void.`,
          `Bonus Abuse`,
          `“Bonus Abuse” includes, but is not limited to:`,
          `1. Breach of terms and conditions of a bonus, free bets or any other promotional offer;`,
          `2. The opening of multiple accounts to claim multiple bonuses;`,
          `Where there is a reasonable suspicion that the Account Holder has committed or attempted to commit a bonus abuse, either on their own or as part of a group, ${companyName.value} reserves the right to:`,
          `1. Forfeit the bonus allocated to the Account Holder and any winnings from that bonus, and/or;`,
          `2. Revoke, deny, or withdraw a bonus offer from the Account Holder, and/or;`,
          `3. Block an access to particular products, and/or;`,
          `4. Exclude the Account Holder from any future promotional offers, and/or;`,
          `5. Terminate the Account Holder’s account with immediate effect.`
        ]
      },
      {
        title: "Disclaimer",
        detail: [
          `In the event of ${companyName.value} being found liable in any way by a court of law and/or a similar authority with legal competence and/or jurisdiction over ${companyName.value}, then ${companyName.value}’s liability is limited to the amount of the stake, or the Account Holder’s net winnings, whichever is the lesser. Alternatively, when relevant and applicable, the amount recorded in the ${companyName.value} Account or the amount transferred into or out of the ${companyName.value} Account, whichever is the lesser.`,
          `${companyName.value} is not affiliated or connected with sports teams, event organizers, or players displayed on its websites, and does not claim any intellectual property rights relating to their name and image, which are used strictly in order to provide the Services.`,
          `${companyName.value} makes no representation or warranty, explicit or implicit, as to the legal rights of the Account Holder to participate in the Services, nor shall any of ${companyName.value}’s employees, licensees, distributors, wholesalers, affiliates, subsidiaries, advertising, promotion or other agencies, media partners, agents or retailers have the authority to make any such representation or warranty. The Account Holder shall not use the Services, open, use or reuse a ${companyName.value}`,
          `Account, enter the Website, nor accept any Prize if the Account Holder does not fully understand, agree to, wish to become a party to, and comply with, without exception, all the ${companyName.value} Rules contained herein, and as these may be amended from time to time.`,
          `${companyName.value} does not acknowledge or accept any liability for damage and/or losses to an Account Holder and/or a third party caused directly and/or indirectly due to the Account Holder:`,
          `1. making deposits to his ${companyName.value} Account via a third party’s Card or account;`,
          `2. requesting withdrawals from his ${companyName.value} Account to a third party’s account;`,
          `3. providing incorrect details of his personal account for the purpose of withdrawals from his ${companyName.value} Account;`,
          `4. allowing third parties to use his ${companyName.value} Account to make deposits to or withdrawals from his ${companyName.value} Account.`,
          `${companyName.value} does not acknowledge or accept any liability whatsoever for damage and/or losses to an Account Holder and/or a third party caused directly and/or indirectly due to any:`,
          `1. Mistake, misprint, misinterpretation, mishearing, misreading, mistranslation, spelling mistake, fault in reading, transaction error, technical failure, technical hazard, registration error, manifest error, cancellation of a game for any reason, and/or any other similar event;`,
          `2. Violation of the ${companyName.value} Rules;`,
          `3. Collusion and/or criminal actions;`,
          `4. Advice provided by ${companyName.value};`,
          `5. Failure of ${companyName.value}’s central computer system or any part thereof; delays, losses, errors or omissions resulting from failure of any telecommunications or any other data transmission system; and/or`,
          `6. Financial risk and loss, including but not limited to variances in exchange rates;`,
          `All information displayed on the Website (including but not limited to scores, results, time of the event, statistics, editorial text etc.) is provided for information purposes only, and not intended to constitute professional advice of any kind. Neither ${companyName.value} nor any of its independent providers is liable for any information errors, incompleteness, inaccuracy or delays, or for any actions taken in reliance on information contained therein.`,
          `The Account Holder shall hold ${companyName.value}, its employees, officers, directors, licensees, distributors, wholesalers, affiliates, subsidiaries, advertising, promotion or other agencies, media partners, agents and retailers harmless and shall fully indemnify the same from any and all costs, expenses, liabilities and damages whatsoever that may arise as a result of Account Holder's:`,
          `1. Entry, use or reuse of the Website;`,
          `2. Use of any Website material;`,
          `3. Entry, use or reuse of the servers used to provide the Services;`,
          `4. Entry, use or reuse of a Client Application;`,
          `5. Participation in the games, chat functionalities and Services;`,
          `6. The acceptance of any Prize.`,
          `companies, or affiliates be liable for any direct, indirect, incidental, special or consequential damages resulting from the use of or the inability to use ${companyName.value}'s or its suppliers’ products, Client Application and/or materials. The Account Holder specifically acknowledges and agrees that ${companyName.value} is not liable for any defamatory, offensive or illegal conduct of any Account Holder. If the Account Holder is dissatisfied with any Service, or with any of the present ${companyName.value} Rules, the Account Holder's sole and exclusive remedy is to discontinue using the Services.`,
          `The Account Holder understands, acknowledges and accepts that any resemblance of names, circumstances or conditions used, depicted, described or suggested in the games operated on the Website with reality is entirely coincidental and unintended.`,
          `The Account Holder understands that ${companyName.value} reserves the right to change or remove any of its Services at any time.`,
          `The Account Holder shall review the ${companyName.value} Rules as posted on the Website on a regular basis, and not less than once a month.`,
          `An account holder can access content played by third parties from the website (for example: streaming media). The account holder consequently acknowledges that this content does not belong to ${companyName.value} and is provided by a third party. When accessing content on the website, the account holder or a visitor is at their own risk. ${companyName.value} does not control the graphics, sounds or images provided by such content, but is for viewing purposes only.`,
          `${companyName.value} expressly disclaims any and all responsibilities related to such content.`,
          `In any case, ${companyName.value} is not responsible for any losses caused by poor or delayed satellite reception, network interruption, or personal errors, negligence, or misunderstanding of the website content when using the website services.`,
          `The company does not provide guarantees and assumes no liability for delays, breach of contract, or non-service provision due to third-party services provided by the company's website and information (such as wireless communication providers, etc.).`,
          `Any direct, indirect, major or ordinary loss or economic loss caused by customers accessing or using the website services, software, information services, or downloading, installing, or using the software, regardless of whether ${companyName.value} has been notified of its possibility, ${companyName.value} and related partners Companies, partners, partners, employees, and agents will not be liable.`,
          `If there is an inconsistency between the match result on the client's computer accessories and the match result of ${companyName.value}’s server, the result displayed by the server will be the final match result. In addition, customers also agree that ${companyName.value} has the final right to interpret the game rules and betting status of customers participating in its services.`,
          `${companyName.value} does not provide any express or implied guarantees for the services currently provided, nor does it provide any guarantees or explanations for the quality, suitability, completeness or accuracy of its services.`,
          `${companyName.value} does its best to provide customers with the highest quality, safest and reliable services. However, it does not guarantee the stability, timeliness and accuracy of the services we provide, or that errors will be corrected in time or that the website will not be interfered by viruses or worms.`,
          `${companyName.value} has the absolute right to temporarily or permanently suspend, terminate, modify, delete or add service content immediately, without notifying the customer, and ${companyName.value} is not responsible for any losses arising therefrom.`
        ]
      },
      {
        title: "Breach of Agreement and Claim",
        detail: [
          `If the account holder violates this agreement or part of its terms, ${companyName.value} has the right to take appropriate corresponding measures, including terminating the agreement, immediately intercepting and preventing the access from its website and using its services, closing the account, confiscation of account funds and/or taking necessary measures legal proceedings.`,
          {
            main: `The account holder thereby guarantees that if the following circumstances occur to ${companyName.value} and its shareholders, employees, staff, license holders, licensees, partners and affiliates; the account holder will be fully responsible for compensation for losses, costs, expenses, attorney fees and other charges, etc., and will protect their legitimate rights and interests from liability and negative influences.`,
            subItems: [
              `1. Violation of the agreement or part of the agreement by the account holder;`,
              `2. Violation of laws or regulations or affect the legal rights of third parties by the account holder;`,
              `3. Other negative results caused by the account holder’s use of ${companyName.value}’s website services, or other people's use of account information to log in, regardless of whether authorized or not.`
            ]
          }
        ]
      },
      {
        title: "Priority",
        detail: [
          `The rules of the game and any other terms of agreement regarding access to and use of the website services will form a complete agreement.`,
          `Unless there are express provisions, if the game rules conflict with any agreement terms or other parts of the agreement about accessing and using the website services, the game rules will prevail.`
        ]
      },
      {
        title: "Governing Law",
        detail: [
          `This agreement and related clauses are subject to and supervised by the relevant laws of the Republic of the Philippines. Regarding any litigation, dispute or disagreement on this clause and any matters arising therefrom, the relevant courts in the Republic of the Philippines have the sole right of interpretation and ruling. Each party irrevocably waives the following rights: deny the Republic of the Philippines trial, or claim that the Republic of the Philippines court does not have jurisdiction, or that the principle of court inconvenience should be adopted.`
        ]
      },
      {
        title: "Issue Resolution",
        detail: [
          `If any individual wants to complain about any aspect of ${companyName.value}'s products or services, they are advised to contact the ${companyName.value} customer service team.`,
          `In the initial stage of an account holder’s complaint, ${companyName.value} will investigate the matter in a fair and objective manner, and will provide practical results and final decisions as much as possible.`,
          `The customer might be asked to provide additional information, data or appropriate evidence to help in handling the said complaint.`,
          `Alternative dispute resolution – All complaints cannot be resolved during the appeal process and can be submitted to relevant independent agencies for adjudication.`,
          `Any disputes that refer to relevant independent institutions will be handled by specific relevant independent institutions in accordance with the law and the dispute resolution process. The resulting decision is final and executory.`
        ]
      },
      {
        title: "Other Terms",
        detail: [
          `The official Terms and Conditions have been drafted in English. Translations into other languages are made as a service and in good faith. In the event of discrepancy between the English version and a translation, the English version shall supersede and prevail.`,
          `If a clause in the agreement is ruled as illegal, invalid or unenforceable in a certain legal category, it will not affect the application of that clause in other legal areas, nor will it affect the application of other clauses in the agreement in that legal category, or other clauses. Application in other legal areas.`,
          `The title of the agreement is for reference only, and it does not affect the composition or interpretation of any clause.`,
          `If ${companyName.value} fails to perform its obligations in accordance with the provisions of the agreement due to the following reasons (including natural disasters, government control, war, riots, transmission interruption, system crash, telecommunications or broadband service interruption, power interruption, etc.), it will not constitute a breach of contract.`,
          `In this agreement, ${companyName.value}'s failure or delay to exercise or perform any rights, remedies, privileges do not mean that ${companyName.value} has waived this privilege ${companyName.value} reserves the right to transfer the agreement or part of the content at any time without notice. However, the account holder or any visitor has no right to transfer ${companyName.value} rights or obligations with respect to this agreement.`,
          `${companyName.value} reserves the right to transfer the agreement or part of the content at any time without notice. However, the account holder or any visitor has no right to transfer ${companyName.value} rights or obligations with respect to this agreement.`,
          `This agreement cannot generate or grant any rights or other benefits to third parties unrelated to this agreement.`,
          `This agreement cannot be created or cannot be regarded as creating a cooperation, agency, trust or joint venture relationship between ${companyName.value} and the account holder.`,
          `This agreement is the latest and complete version of the website service usage agreement between the account holder or a visitor and ${companyName.value}, and it will replace the previous version.`
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
@import "app/template/okbet/assets/css/_variable.sass";

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
