<template>
  <div class="deposit-withdrawal-wrapper">
    <div class="page-title">
      {{ pageType === "deposit" ? t("menu.deposit") : t("menu.withdrawal") }}
    </div>
    <div class="tab-wrapper">
      <div class="tab-item" :class="{ active: pageType === 'deposit' }" @click="changePageType('deposit')">
        {{ t("menu.deposit") }}
      </div>
      <div class="tab-item" :class="{ active: pageType === 'withdrawal' }" @click="changePageType('withdrawal')">
        {{ t("menu.withdrawal") }}
      </div>
    </div>
    <div class="content-wrapper">
      <DepositForm v-if="pageType === 'deposit'" />
      <WithdrawalForm v-if="pageType === 'withdrawal'" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue"
import { useI18n } from "vue-i18n"
import { useRoute } from "vue-router"
import DepositForm from "./DepositForm.vue"
import WithdrawalForm from "./WithdrawalForm.vue"

const { t } = useI18n()
const pageType = ref("")
const route = useRoute()

const changePageType = (type: string) => {
  pageType.value = type
}

const checkPageType = () => {
  pageType.value = route.query.type as string
}

watch(
  () => route.query.type,
  (newType) => {
    pageType.value = (newType as string) || "deposit"
  }
)

onMounted(() => {
  checkPageType()
})
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";
@import "app/template/set_DBO88/assets/css/_variable.scss";
@import "app/template/set_DBO88/assets/css/text.scss";

.deposit-withdrawal-wrapper {
  @apply flex flex-col w-full max-w-[65rem] mx-auto mb-8;

  @include phone-width {
    @apply px-4;
  }

  .tab-wrapper {
    @apply grid justify-between gap-[.3125rem];
    grid-template-columns: repeat(2, 1fr);
    background: #0000004d;

    .tab-item {
      @apply flex justify-center items-center text-lg font-bold cursor-pointer;
      @apply text-white rounded-[.1875rem] py-[.625rem];
      background: #dee3f026;

      &:hover {
        background: #ed0000;
      }

      &.active {
        background: #ed0000;
      }
    }
  }
}
</style>
