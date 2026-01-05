<template>
  <div class="cover" v-show="isMobile && modelValue" @click="$emit('update:modelValue', false)" />
  <div class="side-menu" :class="{ 'is-mobile': modelValue }">
    <div class="button-area">
      <q-expansion-item
        v-if="isLogin"
        expand-separator
        icon="perm_identity"
        label="Account settings"
        class="button-account"
      >
        <template #header>
          <q-btn class="normal-btn" align="left">
            <img :src="svgIcon('account')" />
            <span class="btn-title my-account">{{ $t("menu.myAccount") }}</span>
            <img class="arrow-btn" :src="svgIcon('arrow-down')" alt="" />
          </q-btn>
        </template>
        <template #default>
          <ul class="account-list">
            <li
              v-for="item in accountMenuItems"
              :key="item.name"
              class="account-item"
              :class="{ 'account-item-active': isAccountItemActive(item.name) }"
            >
              <q-btn align="left" flat :to="{ name: item.name }">
                {{ $t(item.label) }}
              </q-btn>
            </li>
            <li class="account-item logout-btn">
              <q-btn align="left" flat @click="logout" :loading="isLoading">
                {{ $t("common.btn.logout") }}
              </q-btn>
            </li>
          </ul>
        </template>
      </q-expansion-item>

      <!-- 串接 CMS Menu List -->
      <template v-for="(cmsItem, cmsIndex) in fliterDisplayDeviceAndLogin" :key="cmsIndex">
        <q-btn
          v-if="isWebInformation(cmsItem.Entrance[0].payload.did ?? '')"
          class="normal-btn"
          :class="{ 'btn-common-active': isActive(cmsItem.Entrance[0]) }"
          align="left"
          @click="
            handleEntranceClick({
              entrance: cmsItem.Entrance[0]
            })
          "
        >
          <img
            v-if="cmsItem.Setting.icon_path"
            :src="isActive(cmsItem.Entrance[0]) ? cmsItem.Setting.selected_icon_path : cmsItem.Setting.icon_path"
          />
          <div v-else class="img-area" />
          <span class="btn-title">
            {{ limitWordLength(cmsItem.Setting.lang[nowLang as LANGUAGE_TYPE.Enums] as string) }}
          </span>
        </q-btn>

        <!-- 關於我們 -->
        <q-expansion-item v-else icon="perm_identity" label="websiteInformation settings" class="button-account">
          <template #header>
            <q-btn class="normal-btn" align="left">
              <img
                v-if="cmsItem.Setting.icon_path"
                :src="isActive(cmsItem.Entrance[0]) ? cmsItem.Setting.selected_icon_path : cmsItem.Setting.icon_path"
              />
              <div v-else class="img-area" />
              <span class="btn-title my-account">
                {{ limitWordLength(cmsItem.Setting.lang[nowLang as LANGUAGE_TYPE.Enums] as string) }}
              </span>
              <img class="arrow-btn" :src="svgIcon('arrow-down')" alt="" />
            </q-btn>
          </template>
          <template #default>
            <ul class="account-list">
              <li
                v-for="item in webInformationMenuList"
                :key="item.id"
                class="account-item"
                :class="{ 'account-item-active': isWebInformationActive(item.id) }"
              >
                <q-btn
                  align="left"
                  flat
                  @click="router.push({ name: 'webInformation', params: { id: item.id.toString() } })"
                >
                  {{ item.title }}
                </q-btn>
              </li>
            </ul>
          </template>
        </q-expansion-item>
      </template>

      <q-expansion-item
        v-if="languageList.length > 1"
        icon="perm_identity"
        label="websiteInformation settings"
        class="language-area"
      >
        <template #header>
          <q-btn class="normal-btn" align="left">
            <div class="flex items-center justify-start">
              <img :src="getFlagImg(currentLanguage)" :alt="currentLanguage" />
              <span>{{ currentLanguage }}</span>
            </div>
            <img class="arrow-btn" :src="svgIcon('arrow-down')" alt="" />
          </q-btn>
        </template>
        <template #default>
          <div class="language-list">
            <div
              v-for="(language, index) in languageList"
              :key="index"
              class="language-item flex items-center justify-start"
              :class="{ 'language-item-active': language === currentLanguage }"
            >
              <q-btn align="left" flat @click="changeLanguage(language)">
                <img :src="getFlagImg(language)" :alt="language" class="mr-2" />
                <span>{{ language }}</span>
              </q-btn>
            </div>
          </div>
        </template>
      </q-expansion-item>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useWindowSize } from "@vueuse/core"
import { useEntranceHandler } from "app/template/set_r016/composables/useCms"
import { storeToRefs } from "pinia"
import { useCms } from "src/common/composables/useCms"
import { useLanguage } from "src/common/composables/useLanguage"
import { useLogo } from "src/common/composables/useLogo"
import { useAuth } from "src/common/hooks/useAuth"
import { useCommonImg } from "src/common/hooks/useCommonImg"
import { CMS_TYPE, LANGUAGE_TYPE } from "src/common/utils/constants"
import { computed, defineEmits, defineProps, onMounted, ref, watch } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useSiteImg } from "../hooks/useSiteImg"
import { MENU } from "../utils/constants"

const props = defineProps({
  modelValue: Boolean
})
const emit = defineEmits(["changeLogin", "changeRegister", "update:modelValue"])

const { svgIcon } = useSiteImg()
const router = useRouter()
const { getSquareLogo } = useLogo()
const route = useRoute()
const { width } = useWindowSize()
const { isLogin, handleLogout, isLoading } = useAuth()
const { commonSvgIcon } = useCommonImg()
const { handleEntranceClick } = useEntranceHandler()
const { handleCmsList, fliterDisplayDeviceAndLogin, webInformationMenuList } = useCms()
const { nowLang, availableLanguages, getLanguage, getFlagImg, setLanguage } = useLanguage()

let isMobile = ref(false)

const accountMenuItems = [
  { name: "memberCenter", label: "menu.memberCenter" },
  { name: "memberVip", label: "menu.vip" },
  { name: "MemberDeposit", label: "menu.deposit" },
  { name: "MemberWithdrawal", label: "menu.withdrawal" },
  { name: "history", label: "menu.history" },
  { name: "orders", label: "menu.order" }
]

const languageList = computed(() => availableLanguages)
const currentLanguage = computed(() => getLanguage())

const changeLanguage = (language: string) => {
  setLanguage(language)
}

const isAccountItemActive = (routeName: string) => {
  return route.name === routeName
}

const isWebInformationActive = (id: number) => {
  return route.params.id === id.toString()
}

const isWebInformation = (type: string) => {
  return MENU.RouterNameMapping[type] !== MENU.RouterNameMapping.website_information
}

const getRouterInfo = (did: string) => {
  return MENU.RouterNameMapping[did]
}

const isActive = (entrance: any) => {
  if (entrance.payload.game_type) {
    return route.params.gameType == entrance.payload.game_type
  }

  return route.name === getRouterInfo(entrance.payload.did)
}

const limitWordLength = (word: string) => {
  if (!word) {
    return ""
  }
  return word.length > 14 ? word.slice(0, 14) + "..." : word
}

const logout = async () => {
  await handleLogout()
  router.push({ path: "/" })
}

watch(
  width,
  (newWidth) => {
    if (newWidth >= 769) {
      isMobile.value = false
    } else {
      isMobile.value = true
    }
  },
  { immediate: true }
)
watch(
  () => route,
  (newRoute) => {
    if (isMobile.value) {
      emit("update:modelValue", false)
    }
  },
  { deep: true }
)

onMounted(async () => {
  await handleCmsList(CMS_TYPE.Enums.MENU)
})
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_r016/assets/css/_variable.scss";

::-webkit-scrollbar {
  display: none;
}

.cover {
  width: 100%;
  height: 100%;
  position: fixed;
  @include setFlex;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 10;
}

.side-menu {
  @include fontStyle();
  position: fixed;
  top: 0;
  left: 0;
  z-index: 99;
  flex-shrink: 0;
  width: 14rem;
  height: 100vh;
  vertical-align: top;
  display: table-cell;
  border-radius: 0px 60px 60px 0px;
  padding: 3vw 0;
  background: linear-gradient(90deg, #540000 0%, #820000 100%);
  overflow-y: hidden;
  color: $neutral01;

  @include phone-width {
    border-radius: 0px;
    width: 70%;
  }

  .button-area {
    width: 90%;
    margin: 0 auto;
    height: auto;
    max-height: 85vh;
    overflow-y: scroll;
    position: relative;
    flex-direction: column;

    @include phone-width {
      max-height: 100vh;
      padding: 20px 0 40px;
    }

    .normal-btn {
      cursor: pointer;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      width: 96%;
      height: auto;
      border-radius: 0.4vw;
      padding: 1.2vw 1.1vw;
      margin: 0vw;

      @include phone-width {
        height: 13vw;
        padding: 1.2vw 0.4rem;
      }

      img {
        width: 1.2vw;

        @include phone-width {
          width: 20px;
        }
      }

      .img-area {
        width: 1.2vw;
        @include phone-width {
          width: 20px;
        }
      }

      &:before {
        box-shadow: none;
      }

      span {
        @apply text-left break-all;
        margin: 0 1vw;

        @include phone-width {
          margin: 0 3vw;
        }
      }

      .my-account {
        margin-right: 0.6vw;

        @include phone-width {
          margin: 0 3vw;
        }
      }

      &.q-btn {
        :deep(.q-btn__content) {
          @apply flex flex-nowrap justify-start;
          width: 100%;
        }
      }
    }

    .button-account,
    .language-area {
      width: 100%;

      &.q-expansion-item--expanded {
        .arrow-btn {
          transform: rotate(0deg);
        }
      }

      :deep(.q-item) {
        padding: 0;

        .q-focus-helper {
          opacity: 0 !important;
        }

        .q-item__section.q-focusable {
          display: none;
        }
      }

      .account-list,
      .language-list {
        border-radius: 10px;
        background: rgba(255, 255, 255, 0.2);
        width: 100%;
        margin: 0 auto;
        padding: 0.375rem;

        .account-item,
        .language-item {
          list-style: none;
          width: 100%;
          padding: 0.625rem;
          color: $menu-default-color;

          @include phone-width {
            padding: 1.2vw 0rem;
          }

          &:hover {
            :deep(.q-btn) {
              color: $menu-hover-color;
            }
          }

          img {
            width: 1.2vw;

            @include phone-width {
              width: 20px;
            }
          }

          &.account-item-active,
          &.language-item-active {
            border-radius: 10px;
            background: rgba(255, 255, 255, 0.2);
          }

          :deep(.q-btn) {
            padding: 0 0.8rem;
            font-size: 0.875rem;
            font-family: Helvetica;

            @include phone-width {
              font-size: 0.9rem;
            }

            .q-focus-helper {
              opacity: 0 !important;
            }
          }

          &.logout-btn {
            border-top: 1px solid rgba(255, 255, 255, 0.2);
          }
        }
      }
    }

    .arrow-btn {
      width: 1vw;
      height: 1vw;
      transform: rotate(180deg);

      @include phone-width {
        width: 5vw;
        height: 5vw;
      }
    }
  }
}
</style>
