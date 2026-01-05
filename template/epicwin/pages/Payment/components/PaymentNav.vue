<template>
  <div class="nav-content">
    <div
      v-for="item in routes"
      :key="item.routeName"
      class="nav-item"
      :class="{ active: route.name === item.routeName }"
      @click="goRoute(item.routeName)"
    >
      <div>
        <img class="nav-img" :src="memberNavImg(item.imgName)" alt="" />
      </div>
      <div class="mt-2">
        {{ $t(item.label) }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useSiteImg } from "app/template/epicwin/hooks/useSiteImg"
import { computed } from "vue"
import { useRoute, useRouter } from "vue-router"

const router = useRouter()
const route = useRoute()
const { memberNavImg } = useSiteImg()

const routes = computed(() => [
  {
    label: "menu.deposit",
    routeName: "paymentDeposit",
    imgName: "m-deposit"
  },
  {
    label: "menu.withdrawal",
    routeName: "paymentWithdraw",
    imgName: "m-withdraw"
  }
])

function goRoute(routeName: string) {
  if (route.name !== routeName) {
    router.push({ name: routeName })
  }
}
</script>

<style lang="sass" scoped>
@import 'src/common/css/_variable.sass'
@import 'app/template/epicwin/css/_variable.sass'

.nav-content
  @apply w-full flex font-bold
  background-color: $member-nav-bg-color
  .nav-item
    @apply w-1/4 text-center flex flex-col items-center py-4 cursor-pointer
    filter: grayscale(1)
    &.active
      background-color: $member-bg-color
      filter: grayscale(0)
    .nav-img
      max-width: 3.125rem
</style>
