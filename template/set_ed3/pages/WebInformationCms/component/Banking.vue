<template>
  <div class="info-wrapper">
    <h3>Banking</h3>
    <p>
      At {{ companyName }},we endeavour to process all transaction requests efficiently and effectively. Please be
      advised to retain any relevant bank receipts or transaction reference numbers (TRNs) as we might request it as
      proof of transaction.
    </p>

    <table width="100%" border="0" cellpadding="0" cellspacing="0" class="bank-table">
      <tbody>
        <tr class="trans">
          <td width="25%" rowspan="2">
            <div align="center">Banking Options</div>
          </td>
          <td colspan="2" align="center">
            <strong>Transaction Limit (VND)</strong>
          </td>
          <td width="25%" rowspan="2">
            <div align="center"><strong>Transaction Timeline</strong></div>
          </td>
        </tr>
        <tr class="trans">
          <td width="25%">
            <div align="center"><strong>Minimum</strong></div>
          </td>
          <td width="25%">
            <div align="center"><strong>Maximum</strong></div>
          </td>
        </tr>
        <tr class="dwbox">
          <td height="20" colspan="4" align="center"><span>Deposit</span></td>
        </tr>
        <tr class="trans1">
          <td><div align="center">ATM / CDM</div></td>
          <td rowspan="3"><div align="center">30.00</div></td>
          <td rowspan="3"><div align="center">100,000.00</div></td>
          <td rowspan="3"><div align="center">5 Minutes</div></td>
        </tr>
        <tr class="trans1">
          <td><div align="center">Online Transfer</div></td>
        </tr>
        <tr class="trans1">
          <td><div align="center">Local Bank Transfer</div></td>
        </tr>
        <tr class="dwbox">
          <td height="20" colspan="4" align="center">
            <span>Withdrawal</span>
          </td>
        </tr>
        <tr class="trans1">
          <td align="center">Quick Withdrawal</td>
          <td align="center">50.00</td>
          <td align="center">10,000.00</td>
          <td align="center">10 Minutes</td>
        </tr>
        <tr class="trans1">
          <td align="center">Local Bank Transfer</td>
          <td align="center">50.00</td>
          <td align="center">50,000.00</td>
          <td align="center">1 Day</td>
        </tr>
      </tbody>
    </table>
    <br /><br />
    <strong>NOTES:</strong>

    <ul>
      <li>The minimum amount is assessed on a per-transaction basis.</li>
      <li>The maximum amount is assessed by the total volume of daily transactions.</li>
      <li>Large withdrawals require more time to process.</li>
      <li>Processing times will only come into effect once we have received and verified your transaction request.</li>
      <li>
        Please note that if you have any outstanding bonuses on your player account, you may be unable to withdraw until
        you have fulfilled the requirements of that particular bonus.
      </li>
      <li>
        In the event that stakes are less than 50% of the total deposited amount, any withdrawal requests will be
        subjected to a 10% service &amp; administration charge, based on the total deposited amount.
      </li>
      <li>
        An SMS notification will be sent to you every time funds are deposited to or withdrawn from your player account.
      </li>
    </ul>
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
  ul
    padding-left: 2rem
    list-style-type: disc
  h3
    font-size: calc(1.3rem + .6vw)
  p
    margin-bottom: 1rem

  table
    border-collapse: collapse
    thead, tbody, tfoot, tr, td, t
      border-color: inherit
      border-style: solid
      border-width: 0
    td
      background: rgba(0, 0, 0, .5)
      color: #fff
      border: 1px solid #21276d
      padding: 2px
  .dwbox
    td
      background: linear-gradient(to bottom, rgb(169, 211, 32) 0%, rgb(56, 131, 18) 100%)
      color: #fff
      font-weight: 600
      padding: 2px
</style>
