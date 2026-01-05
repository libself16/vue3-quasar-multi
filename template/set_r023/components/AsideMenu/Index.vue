<template>
  <q-drawer :width="isLargeTablet ? 312 : 244" show-if-above v-model="drawer" side="left" class="drawer-wrapper">
    <div class="side-header">
      <LanguageDropdown />
      <div class="theme-change-btn" @click="handlerChangeDarkMode()">
        <div class="toggle-knob" :class="{ 'is-dark': $q.dark.isActive }"></div>
        <q-img :src="svgIcon('moon')" class="icon" />
        <q-img :src="svgIcon('sun')" class="icon" />
      </div>
    </div>
    <div v-if="isLogin && isCash" class="currency-btn-list">
      <div class="currency-btn deposit-btn" @click="goToPage('deposit')">
        <q-img :src="asideMenuImage('deposit')" class="currency-btn-icon" />
        <div class="currency-btn-text">{{ $t("common.btn.deposit") }}</div>
      </div>
      <div class="currency-btn withdrawal-btn" @click="goToPage('withdrawal')">
        <q-img :src="asideMenuImage('withdrawal')" class="currency-btn-icon" />
        <div class="currency-btn-text">{{ $t("common.btn.withdrawal") }}</div>
      </div>
    </div>
    <MenuCMS />
    <div v-if="isLogin">
      <p class="list-title">{{ $t("menu.personalCenter") }}</p>
      <PersonalCenter />
    </div>
    <div v-if="cmsListState[CMS_TYPE.Enums.CONTACT_US].length > 0">
      <p class="list-title">{{ $t("menu.other") }}</p>
      <ContactUsCMS :contactUsList="cmsListState[CMS_TYPE.Enums.CONTACT_US]" />
    </div>
    <div v-if="isLogin && isLargeTablet" @click="logout" :loading="isLoading" class="logout-btn">
      <img :src="svgIcon('logout')" alt="" />
      <span>{{ $t("common.btn.logout") }}</span>
    </div>
  </q-drawer>
</template>

<script setup lang="ts">
import { onMounted } from "vue"
import { useQuasar } from "quasar"
import { useRouter } from "vue-router"
import { useAuth } from "src/common/hooks/useAuth"
import { useSiteImg } from "app/template/set_r023/hooks/useSiteImg"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import { CMS_TYPE } from "src/common/utils/constants"
import { useCms } from "src/common/composables/useCms"
import { EventBusKey } from "src/symbols"
import { injectStrict } from "src/common/utils/injectTyped"
import MenuCMS from "app/template/set_r023/components/AsideMenu/MenuCMS.vue"
import PersonalCenter from "app/template/set_r023/components/AsideMenu/PersonalCenter.vue"
import ContactUsCMS from "app/template/set_r023/components/AsideMenu/ContactUsCMS.vue"
import LanguageDropdown from "app/template/set_r023/components/LanguageDropdown/Index.vue"
import { useEnv } from "src/common/hooks/useEnv"
import { useTelegram } from "src/common/composables/useTelegramMiniApp"
import { useDarkModeStore } from "stores/darkModeStore"

const $q = useQuasar()
const eventbus = injectStrict(EventBusKey)
const { svgIcon, asideMenuImage } = useSiteImg()
const { isLogin, handleLogout, isLoading } = useAuth()
const { isLargeTablet } = useMediaQuery()
const { cmsListState, handleCmsList } = useCms()
const { isCash } = useEnv()
const { isTelegramMiniApp, closeMiniApp } = useTelegram()
const { isDarkMode, updateIsDarkMode } = useDarkModeStore()

const drawer = defineModel<boolean>()
const router = useRouter()

const goToPage = (name: string) => {
  eventbus.emit("openDepositWithWithdrawal", true, name)
}

const logout = async () => {
  await handleLogout()
  router.push({ name: "home" })

  if (isTelegramMiniApp.value) closeMiniApp()
}

const handlerChangeDarkMode = () => {
  $q.dark.toggle()
  updateIsDarkMode($q.dark.isActive)
}

onMounted(() => {
  if (isDarkMode) {
    $q.dark.set(true)
  }

  handleCmsList(CMS_TYPE.Enums.CONTACT_US)
})
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";
@import "app/template/set_r023/assets/css/_variable.scss";

:deep(.drawer-wrapper) {
  @apply py-[1.5rem] px-[.75rem];
  background: var(--bg-side);
  border-right: 0.045625rem solid var(--neutral-03);

  &::-webkit-scrollbar {
    display: none;
  }
  &::-moz-scrollbar {
    display: none;
  }
  &::-ms-scrollbar {
    display: none;
  }
  &::-o-scrollbar {
    display: none;
  }
}

.side-header {
  @apply flex justify-between items-center;
}

.theme-change-btn {
  @apply flex justify-evenly items-center cursor-pointer w-[3.5rem] h-[1.75rem] rounded-[1rem] relative;
  background: var(--primary-01);

  .icon {
    @apply w-[1.25rem] h-[1.25rem];
  }

  .toggle-knob {
    @apply w-[1.5rem] h-[1.5rem] rounded-full absolute left-[0.125rem] transition-transform duration-300;
    background: var(--white-01);
    transform: translateX(0);

    &.is-dark {
      transform: translateX(1.75rem);
    }
  }
}

.currency-btn-list {
  @apply flex gap-[.5rem] mt-[.75rem];
}

.currency-btn {
  @apply flex items-center justify-center cursor-pointer w-1/2;
  @apply h-[2.5rem] rounded-[.5rem] gap-[.25rem];

  .currency-btn-icon {
    @apply w-[2rem] h-[2rem];
  }

  .currency-btn-text {
    @apply text-[.75rem];
    color: var(--secondary-02);
  }
}

.deposit-btn {
  @apply bg-[var(--secondary-03)];
}

.withdrawal-btn {
  @apply bg-[var(--primary-05)];
}

.list-title {
  @apply text-[.875rem] mt-[1.5rem];
  color: var(--secondary-01);
}

.logout-btn {
  display: flex;
  cursor: pointer;
  align-items: center;
  gap: 0.5rem;
  border-radius: 0.5rem;
  padding: 0.5rem 0 0.5rem 0.75rem;
  color: var(--primary-02);
  transition: all 0.3s ease;
  margin-top: 0.5rem;

  img {
    width: 1.125rem;
  }
}
</style>
<style lang="scss">
.q-drawer {
  position: fixed;
}
</style>
