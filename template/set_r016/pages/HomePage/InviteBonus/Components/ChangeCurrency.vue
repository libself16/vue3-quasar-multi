<template>
  <div class="currency-dropdown">
    <q-btn-dropdown rounded :label="selectedLabel" menu-anchor="bottom middle" menu-self="bottom middle">
      <q-list>
        <q-item v-for="item in walletDropdown" :key="item.value" clickable v-close-popup @click="changeCurrency(item)">
          <q-item-section>
            <q-item-label>{{ item.label }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { WALLET_TYPE } from "src/common/utils/constants"

const { userWalletMap, getWalletLabel } = useUserInfo()
type WalletDropItem = {
  label: string
  value: string
}

const walletDropdown = computed<WalletDropItem[]>(() => {
  return Object.keys(userWalletMap.value).map((e) => {
    const cashWallet = userWalletMap.value[e][WALLET_TYPE.Enums.Cash]
    const label = `${getWalletLabel(cashWallet)}`
    const value = String(cashWallet.currency_id)
    return { label, value }
  })
})

const selectedItem = ref<WalletDropItem | null>(null)

const selectedLabel = computed(() => {
  return selectedItem.value?.label || walletDropdown.value[0]?.label || "Dropdown Button"
})

const changeCurrency = (item: WalletDropItem) => {
  selectedItem.value = item

  props.onChangeCurrency(item)
}

const props = defineProps({
  onChangeCurrency: {
    type: Function,
    required: true
  }
})
</script>

<style scoped lang="scss">
@import "app/template/set_r016/assets/css/_variable.scss";

.currency-dropdown {
  :deep(.q-btn--rounded) {
    @apply rounded-[.625rem];
    background: $neutral01;
    box-shadow: $shadow01;
  }
}
</style>
