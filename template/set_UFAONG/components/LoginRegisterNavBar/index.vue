<template>
  <div class="change-tab w-full h-[36px]">
    <div
      v-for="(item, index) in tabList"
      :key="index"
      class="tab-item"
      :class="{ active: item.isActive }"
      @click="changeTabStatus(item.name)"
    >
      {{ item.label }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue"
import { useI18n } from "vue-i18n"
import { useRouter, useRoute } from "vue-router"

const { t } = useI18n()
const route = useRoute()
const router = useRouter()

const tabList = computed(() => {
  return [
    {
      name: "Login",
      label: t("common.btn.login"),
      isActive: route.name === "Login"
    },
    {
      name: "Register",
      label: t("common.btn.register"),
      isActive: route.name === "Register"
    }
  ]
})

const changeTabStatus = (link: string) => {
  router.push({ name: link })
}
</script>

<style lang="scss" scoped>
@import "../../assets/css/variable.scss";
@import "../../assets/css/main.scss";
</style>
