<template>
  <div class="dropdown currency-drop">
    <div class="mk" @click="isDropdownOpen = !isDropdownOpen" v-if="isDropdownOpen"></div>
    <button
      class="btn-afbtn dropdown-toggle"
      role="button"
      id="dropdownMenuLink"
      type="button"
      @click="isDropdownOpen = !isDropdownOpen"
    >
      <span class="bln-balance">{{ `${userInfo.currency} : ${userInfo.balance}` }}</span>
      <span class="bln-ico"><i class="fas fa-sync-alt"></i></span>
    </button>
    <div class="dropdown-menu" :class="{ show: isDropdownOpen }">
      <div class="currency-wrap">
        <div class="currency-head">
          <div class="pref">{{ $t("game.preferred") }}</div>
          <div class="bal">{{ $t("game.balance") }}</div>
        </div>
        <div class="af-currency">
          <div class="af-amt">
            <label v-for="(curr, key) in currencyList" :key="key">
              <input
                type="radio"
                class="option-input radio"
                name="example"
                @click="changeCurr(curr)"
                :checked="curr.name === userInfo.currency"
              />
              <div class="currency-amt">
                <span class="currency-country">{{ curr.name }}</span>
                <span>{{ curr.amount }}</span>
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, defineProps, watch } from "vue"
import { useUserInfoStore } from "stores/userInfoStore"

let { userInfo, updatedUserInfo } = useUserInfoStore()

let isDropdownOpen = ref(false)

const props = defineProps({
  type: String,
  scrollTop: Number
})
const currencyList = [
  { name: "MYR", amount: "12,000.00" },
  { name: "SGD", amount: "40,000.00" },
  { name: "BRL", amount: "180,000.00" },
  { name: "PHP", amount: "0" },
  { name: "IDR", amount: "1600.00" }
]

const changeCurr = (item: { name: string; amount: string }) => {
  updatedUserInfo({
    currency: item.name,
    balance: item.amount
  })
  // isDropdownOpen.value = false;
}
watch(
  () => props.scrollTop,
  (value) => {
    if (value > 55 && isDropdownOpen.value && props.type == "rel") {
      isDropdownOpen.value = false
    } else if (value < 55 && isDropdownOpen.value) {
      isDropdownOpen.value = false
    }
  },
  { immediate: true }
)
</script>
<style lang="scss" scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

/* currency setting */
#set-33 {
  .mk {
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0px;
    top: 0px;
    background: rgb(0, 0, 0, 0.3);
  }
  .header-menu-mobile {
    cursor: pointer;
  }
  .currency-drop .dropdown-menu {
    background: #011422;
    border: 1px solid #008ff7;
    padding: 5px;
    border-radius: 7px;
    min-width: 300px;
    right: 0px !important;
    left: auto !important;
    top: 42px !important;
    transform: translate3d(0px, 0px, 0px) !important;
  }
  .currency-wrap {
    margin: 0 auto;
  }
  .currency-head {
    display: grid;
    grid-template-columns: 40% 60%;
    /* display: flex; */
    text-align: center;
  }
  .currency-head .pref {
    background: linear-gradient(to bottom, #0290f6 0%, #033b5c 100%);
    color: #fff;
    border-radius: 5px 0px 0px 0px;
    padding: 5px 10px;
    font-size: 14px;
  }
  .currency-head .bal {
    background: linear-gradient(to bottom, #0290f6 0%, #033b5c 100%);
    color: #fff;
    border-radius: 0px 5px 0px 0px;
    padding: 5px 10px;
    margin-left: 3px;
    font-size: 14px;
  }
  .currency-row {
    display: flex;
    display: grid;
    grid-template-columns: 40% 60%;
    text-align: center;
    margin: 3px 0px;
  }
  .currency-radio {
    background: #1b2d39;
    padding: 5px;
    text-align: center;
    display: flex;
    justify-content: center;
  }
  .currency-amt {
    display: flex;
    justify-content: space-between;
    padding: 5px;
    margin-left: 3px; /* background: #08192b; */
  }
  .currency-country {
    color: #008ff7;
    font-weight: bold;
  }
  .currency-radio input[type="radio"] {
    position: absolute;
    visibility: hidden;
  }
  .currency-wrap table {
    color: #fff;
  }
  .crc-btn-wrap {
    display: flex;
    text-align: center;
    justify-content: center;
    gap: 5px;
    padding: 10px 0px;
  }
  .crc-close-btn {
    background: #c22323;
    color: #fff;
    font-weight: 800;
    text-transform: uppercase;
    border: none;
    border-radius: 10px;
    width: 110px;
    height: 30px;
    font-size: 13px;
    box-shadow: inset 0px 0px 5px #fff;
  }
  .crc-save-btn {
    color: #fff;
    font-weight: 800;
    text-transform: uppercase;
    border: none;
    border-radius: 10px;
    width: 110px;
    height: 30px;
    font-size: 13px;
    margin-right: 5px;
    background: linear-gradient(to bottom, rgba(169, 211, 32, 1) 0%, rgba(56, 131, 18, 1) 100%);
    box-shadow: inset 0px 0px 5px #fff;
  }
  .af-currency {
    margin-top: 5px;
  }
  .af-amt label {
    align-items: center;
    justify-content: space-between;
    display: grid;
    grid-template-columns: 40% 60%;
    background: #1b2d39;
    margin-bottom: 3px;
    padding: 4px;
  }
  .option-input {
    -webkit-appearance: none;
    -moz-appearance: none;
    -ms-appearance: none;
    -o-appearance: none;
    appearance: none;
    position: relative;
    top: 0px;
    right: 0;
    bottom: 0;
    left: 26%;
    height: 30px;
    width: 30px;
    transition: all 0.15s ease-out 0s;
    background: #cbd1d8;
    border: none;
    color: #fff;
    cursor: pointer;
    display: inline-block;
    margin-right: 0.5rem;
    outline: none;
    position: relative;
    z-index: 1000;
  }
  .option-input:hover {
    background: #9faab7;
  }
  .option-input:checked {
    background: #97c618;
  }
  .option-input:checked::before {
    width: 30px;
    height: 30px;
    display: flex;
    content: "\f00c";
    font-size: 18px;
    font-weight: bold;
    position: absolute;
    align-items: center;
    justify-content: center;
    font-family: "Font Awesome 5 Free";
  }
  .option-input:checked::after {
    -webkit-animation: click-wave 0.65s;
    -moz-animation: click-wave 0.65s;
    animation: click-wave 0.65s;
    background: #40e0d0;
    content: "";
    display: block;
    position: relative;
    z-index: 100;
  }
  .option-input.radio {
    border-radius: 50%;
  }
  .option-input.radio::after {
    border-radius: 50%;
  }
}

@keyframes click-wave {
  0% {
    height: 40px;
    width: 40px;
    opacity: 0.35;
    position: relative;
  }
  100% {
    height: 200px;
    width: 200px;
    margin-left: -80px;
    margin-top: -80px;
    opacity: 0;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
