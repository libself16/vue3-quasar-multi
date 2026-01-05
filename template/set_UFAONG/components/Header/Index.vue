<template>
  <header
    class="header-wrapper"
    :class="{
      'no-header': currentRoute === 'Home',
      'show-shadow': isNotHomeAndAccount
    }"
  >
    <div v-if="currentRoute === 'Account'" class="account-header">
      <div class="edit-btn" @click="redirectionPage('Profile')">
        <span class="edit-text hover:text-white">{{ $t("home.edit_info") }}</span>
        <i class="fa-solid fa-angle-right edit-icon"></i>
      </div>
    </div>
    <div v-else-if="currentRoute !== 'Home'" class="go-back-header">
      <i @click="goBack" class="fa-solid fa-angle-left"></i>
      <div>{{ $t(headerTitle) }}</div>
      <i></i>
    </div>
  </header>
</template>

<script lang="ts" setup>
import { computed, onMounted } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useUserInfo } from "src/common/composables/useUserInfo"

const { getUserInfo, getUserWalletList } = useUserInfo()
const route = useRoute()
const router = useRouter()

const currentRoute = computed(() => {
  return route.name
})

const headerTitle = computed<string>(() => {
  return route.meta.headerTitle as string
})

const isNotHomeAndAccount = computed(() => {
  return currentRoute.value !== "Home" && currentRoute.value !== "Account" && currentRoute.value !== "Promotions"
})

const goBack = () => {
  router.go(-1)
}

const redirectionPage = (link: string) => {
  router.push({ name: link })
}

const getUserData = async () => {
  await getUserWalletList()
  await getUserInfo()
}

onMounted(() => {
  getUserData()
})
</script>

<style lang="scss" scoped>
@import "../../assets/css/variable.scss";

.header-wrapper {
  @apply flex w-full h-[50px] items-center;
  font-size: 0.9375rem;
}

.show-shadow {
  box-shadow: #f0e47f 0.125rem 0.125rem 0.5rem -0.25rem;
}

.go-back-header {
  @apply flex w-full items-center justify-between px-[10px];
  font-weight: 600;
  color: $primary;

  i {
    @apply cursor-pointer;
  }
}

.no-header {
  display: none;
}

.account-header {
  @apply flex w-full items-center justify-end;
  .edit-btn {
    @apply flex items-center cursor-pointer;
    color: $primary;

    .edit-text {
      @apply mr-1.5;
    }
  }
}
</style>
