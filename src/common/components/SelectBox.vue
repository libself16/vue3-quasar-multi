<template>
  <div class="aselect" :data-value="title" :data-list="list">
    <div class="circle">
      <img src="src/common/assets/images/currency.png" />
    </div>
    <div class="selector" @click="toggle(title)">
      <div class="label">
        <span v-if="title === 'Select Currency'">{{ `${title}` }}</span>
        <span v-else>
          <span class="currency-label">{{ `${title}` }}</span>
          <span class="currency-amount">{{ `&nbsp;&nbsp;&nbsp;${amount}` }}</span>
        </span>
      </div>
      <div class="arrow" :class="{ expanded: visible }"></div>
      <div :class="{ hidden: !visible, visible }">
        <ul>
          <li :class="{ current: item === title }" v-for="(item, key) in list" :key="key" @click="select(item)">
            {{ item }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue"
const title = ref("Select Currency")
let list = ["USD", "CNY", "USDT"]
let amount = ref("")
let visible = ref(false)

const getCurrencyAmount = (currency: any) => {
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
const toggle = (title: string) => {
  visible.value = !visible.value
  getCurrencyAmount(title)
}

const select = (option: string) => {
  title.value = option
}
</script>
<style lang="scss" scoped>
body {
  background: STEELBLUE;
  font-family: "Roboto";
}

.currency-label {
  color: #6282c4;
}

.currency-amount {
  color: #555555;
}

h1 {
  color: #f9f9f9;
  text-align: center;
  font-size: 36px;
  line-height: 1;
  font-weight: 300;
  letter-spacing: 3px;
  text-transform: uppercase;
  font-family: "Mogra";
  margin-bottom: 0;
  text-shadow: 3px 4px 0px rgba(0, 0, 0, 0.3);
}

.aselect {
  width: 16vw;
  margin: 1vw auto;
  position: relative;
  .circle {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    left: -1vw;
    border: 0.1vw solid gainsboro;
    z-index: 999;
    width: 3vw;
    height: 3vw;
    border-radius: 3vw;
    background: #8099cc;
    img {
      width: 2vw;
    }
  }
  .selector {
    border: 0.1vw solid gainsboro;
    border-radius: 5px;
    height: 3vw;
    background: #f8f8f8;
    position: relative;
    z-index: 1;
    .arrow {
      position: absolute;
      right: 1vw;
      top: 40%;
      width: 0;
      height: 0;
      border-left: 0.7vw solid transparent;
      border-right: 0.7vw solid transparent;
      border-top: 1vw solid #888;
      transform: rotateZ(0deg) translateY(0px);
      transition-duration: 0.3s;
      transition-timing-function: cubic-bezier(0.59, 1.39, 0.37, 1.01);
    }
    .expanded {
      transform: rotateZ(180deg) translateY(2px);
    }
    .label {
      display: block;
      padding: 0.8vw;
      font-size: 1.1vw;
      color: #888;
    }
  }
  ul {
    width: 100%;
    border-radius: 5px;
    list-style-type: none;
    padding: 0;
    margin: 0.5vw 0 0 0;
    font-size: 1vw;
    border: 0.1vw solid gainsboro;
    position: absolute;
    z-index: 1;
    background: #fff;
  }
  li {
    padding: 0.8vw;
    color: #666;
    &:hover {
      color: #6282c4;
      background: #eef4ff;
    }
  }
  .current {
    background: #eaeaea;
  }
  .hidden {
    visibility: hidden;
  }
  .visible {
    visibility: visible;
  }
}

@media screen and (max-width: 575px) {
  .aselect {
    width: 38vw;
    .circle {
      display: flex;
      justify-content: center;
      align-items: center;
      position: absolute;
      left: -2vw;
      border: 0.1vw solid gainsboro;
      z-index: 999;
      width: 8vw;
      height: 8vw;
      border-radius: 8vw;
      background: #8099cc;
      img {
        width: 5vw;
      }
    }
    .selector {
      border: 0.1vw solid gainsboro;
      border-radius: 5px;
      height: 8vw;
      background: #f8f8f8;
      position: relative;
      z-index: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      .arrow {
        position: absolute;
        right: 1vw;
        top: 40%;
        width: 0;
        height: 0;
        border-left: 0.7vw solid transparent;
        border-right: 0.7vw solid transparent;
        border-top: 1vw solid #888;
        transform: rotateZ(0deg) translateY(0px);
        transition-duration: 0.3s;
        transition-timing-function: cubic-bezier(0.59, 1.39, 0.37, 1.01);
      }
      .expanded {
        transform: rotateZ(180deg) translateY(2px);
      }
      .label {
        display: block;
        padding: 0.8vw;
        font-size: 3vw;
        color: #888;
      }
    }
    ul {
      width: 100%;
      border-radius: 5px;
      list-style-type: none;
      padding: 0;
      margin: 0.5vw 0 0 0;
      font-size: 3vw;
      position: absolute;
      top: 9vw;
      left: 0;
    }
    li {
      padding: 1.8vw;
      color: #666;
      &:hover {
        color: #6282c4;
        background: #eef4ff;
      }
    }
  }
}
</style>
