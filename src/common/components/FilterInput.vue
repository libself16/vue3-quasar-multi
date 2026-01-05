<template>
  <div class="aselect" :data-value="title" :data-list="list">
    <div class="input-layout">
      <input v-model="inputVal" @keyup="toggle()" class="input-style" placeholder="Search" />
      <img @click="visible = false" :src="commonSvgIcon('vector')" />
    </div>
    <div :class="{ hidden: !visible, visible }">
      <ul>
        <template v-if="history.length !== 0">
          <p>- Search History -</p>
          <li :class="{ current: item === title }" v-for="(item, key) in history" :key="key" @click="select(item)">
            <span class="member">{{ item }}</span>
            <img @click="(e) => closeHistoryItem(e, key)" :src="closeImg" />
          </li>
        </template>
        <p>- Popular Searches -</p>
        <li :class="{ current: item === title }" v-for="(item, key) in list" :key="key" @click="select(item)">
          <span class="number">{{ `${key + 1}.` }}</span>
          <span class="member">{{ item }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useCommonImg } from "src/common/hooks/useCommonImg"
import { ref } from "vue"
const title = ref("Select Currency")
let list = ref(["Slots", "Baccarat", "New Game", "Soccer", "Jackpot", "Pragmatic Play", "Evolution Gaming", "Fishing"])
let history = ref(["Slots", "Soccer"])

const { commonSvgIcon, closeImg } = useCommonImg()

let filterHistory = () => {
  const str = "S"

  history.value.map((item, key) => {
    // 使用 RegExp 建構子來動態建立正規表達式對象
    let regex = new RegExp(item, "g")

    // 使用正規表達式對 str 進行匹配
    let matches = str.match(regex)

    // 打印匹配結果
    console.log(`Matches for ${item}:`, matches)
  })
}
let amount = ref("")
let visible = ref(false)
let inputVal = ref("")

const getCurrencyAmount = (currency: string) => {
  switch (currency) {
    case "USD":
      amount.value = "120.1"
      break
    case "USDT":
      amount.value = "44,245.1"
      break
    case "CNY":
      amount.value = "12,478"
      break
  }
}
const toggle = () => {
  if (inputVal.value.length === 0) visible.value = false
  else visible.value = true
}

const select = (option: string) => {
  inputVal.value = option
  if (!history.value.includes(option)) history.value.push(option)
  visible.value = false
}

const closeHistoryItem = (event: Event, key: number) => {
  event.stopPropagation()
  history.value.splice(key, 1)
}

filterHistory()
</script>
<style lang="sass" scoped>
input::-webkit-input-placeholder
  /* Chrome/Opera/Safari */
  text-align: center
  font-size: 1.1vw
  color: #888
input::-moz-placeholder
  /* Firefox 19+ */
  text-align: center
  font-size: 1.1vw
  color: #888

input:-moz-placeholder
  /* Firefox 18- */
  text-align: center
  font-size: 1.1vw
  color: #888

body
  background: STEELBLUE
  font-family: "Roboto"

.currency-label
  color: #6282c4

.currency-amount
  color: #555555

h1
  color: #f9f9f9
  text-align: center
  font-size: 36px
  line-height: 1
  font-weight: 300
  letter-spacing: 3px
  text-transform: uppercase
  font-family: "Mogra"
  margin-bottom: 0
  text-shadow: 3px 4px 0px rgba(0, 0, 0, 0.3)

.input-layout
  position: relative
  display: flex
  align-items: center
  > img
    position: absolute
    z-index: 9
    left: 1vw
    width: 1.5vw

.aselect
  width: 16vw
  margin: 1vw auto
  position: relative
  .input-style
    text-align: center
    border: 1px solid rgba(255, 255, 255, 0.15)
    border-radius: 5rem
    padding: 0
    width: 16vw
    height: 3vw
    background: #1c1e22
    position: relative
    z-index: 1
    font-size: 1.1vw
    color: #888
    &:focus
      outline: 0.2vw solid gainsboro
    .label
      display: block
      padding: 0.8vw
      font-size: 1.1vw
      color: #888
  ul
    width: 100%
    border-radius: 5px
    list-style-type: none
    padding: 0
    margin: 0.5vw 0 0 0
    font-size: 1vw
    border: 0.1vw solid gainsboro
    position: absolute
    z-index: 1
    background: #fff
    p
      font-size: 0.8vw
      color: #333
      margin: 0.5vw 0 0.5vw 1vw
      text-align: left
      cursor: auto
  li
    position: relative
    padding: 0.8vw 0 0.8vw 1vw
    text-align: left
    display: flex
    justify-content: flex-start
    align-items: center
    color: #999999
    img
      position: absolute
      right: 0px
      margin: 0 1vw
      width: 1.2vw
    .number
      color: #ce783a !important
      margin: 0 0.1vw
    .member
      color: #999999
    &:hover
      color: #6282c4
      background: #eef4ff
  .current
    background: #eaeaea
  .hidden
    visibility: hidden
  .visible
    visibility: visible
</style>
