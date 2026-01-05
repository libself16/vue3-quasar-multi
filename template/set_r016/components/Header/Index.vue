<template>
  <div class="header">
    <div class="header-left">
      <q-btn flat fab-mini class="logo" @click="router.push({ name: 'HomePage' })">
        <img class="logo" :src="getSquareLogo()" />
      </q-btn>
      <div
        v-if="cmsListState[CMS_TYPE.Enums.CONTACT_US][0]"
        class="contact-wrapper"
        @click="handleEntranceClick({ entrance: cmsListState[CMS_TYPE.Enums.CONTACT_US][0].Entrance[0] })"
      >
        <q-img
          :src="cmsListState[CMS_TYPE.Enums.CONTACT_US][0].Setting.icon_lang[nowLang as LANGUAGE_TYPE.Enums]"
          class="icon-img"
          contain
        />
        <div class="contact-content">
          <span>{{ cmsListState[CMS_TYPE.Enums.CONTACT_US][0].Setting.lang[nowLang as LANGUAGE_TYPE.Enums] }}</span>
          <span class="contact-info">{{
            cmsListState[CMS_TYPE.Enums.CONTACT_US][0].Setting.contact_lang[nowLang as LANGUAGE_TYPE.Enums]
          }}</span>
        </div>
      </div>
    </div>
    <div class="header-right">
      <div v-if="isLogin" class="info-wrapper">
        <div>
          {{ accountInfo.account || accountInfo.nickname }}
        </div>
        <div class="wallet-balance" v-if="inUseWallet">
          <img class="arrow-btn" :src="svgIcon('wallet-black')" alt="" />
          <span class="balance-label">{{ activeWalletLabel }}</span>
          <span class="balance-amount">{{ moneyFormat(inUseWallet[WALLET_TYPE.Enums.Cash].balance) }}</span>
          <img
            class="reload-btn"
            :class="{ 'animate-spin': isSpinning }"
            :src="svgIcon('reload-black')"
            alt="reload icon"
            @click="getBalance"
          />
        </div>
      </div>

      <div class="icon-area">
        <!--無功能+API 暫時隱藏
        <div v-if="!isMobile">
          <FilterInput></FilterInput>
        </div>-->

        <!-- 大頭貼, 小o 處理 -->
        <div v-if="isLogin" class="user-wrapper">
          <img class="cursor-pointer user-icon" :src="result('header-icon2.png')" />
          <div class="logout-modal" @click="logout">
            {{ $t("menu.logout2") }}
          </div>
        </div>

        <img
          v-if="!isMobile && isLogin"
          class="w-[2.5rem] mx-5 cursor-pointer shaking-bell"
          :src="result('header-icon1.png')"
          @click="handleOpenModal"
        />

        <LanguageDropdown class="language-bar" btnSize="sm" imgSize="40px" :isDarkBg="false" />

        <!-- <div>
          <SelectBox></SelectBox>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useSiteImg } from "app/template/set_r016/hooks/useSiteImg"
import { useLogo } from "src/common/composables/useLogo"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useAuth } from "src/common/hooks/useAuth"
import { useCommon } from "src/common/hooks/useCommon"
import { ref, watch, onMounted } from "vue"
import { useRouter } from "vue-router"
// import SelectBox from 'src/common/components/SelectBox.vue';
import { useWindowSize } from "@vueuse/core"
import LanguageDropdown from "src/common/components/LanguageDropdown.vue"
import { WALLET_TYPE } from "src/common/utils/constants"
import { useCms } from "src/common/composables/useCms"
import { CMS_TYPE } from "src/common/utils/constants"
import { LANGUAGE_TYPE } from "src/common/utils/constants"
import { useLanguage } from "src/common/composables/useLanguage"
import { useEntranceHandler } from "app/template/set_r016/composables/useCms"

const { moneyFormat } = useCommon()
const { cmsListState, handleCmsList } = useCms()
const { nowLang } = useLanguage()
const { accountInfo, inUseWallet, activeWalletLabel, getUserWalletList } = useUserInfo()
const { handleEntranceClick } = useEntranceHandler()

const { result, svgIcon } = useSiteImg()
const prop = defineProps(["modelValue"])
const emit = defineEmits(["update:modelValue", "changeLogin"])
const { isLogin, handleLogout } = useAuth()
const { getSquareLogo } = useLogo()
const router = useRouter()
const { width } = useWindowSize()
let isMobile = ref(false)
const isSpinning = ref(false)

const handleOpenModal = () => {
  if (isLogin.value) {
    router.push({ name: "memberInbox" })
  } else {
    emit("changeLogin", true)
  }
}

const logout = async () => {
  await handleLogout()
  router.push({ name: "HomePage" })
}

const getBalance = async () => {
  if (isSpinning.value) return
  isSpinning.value = true
  try {
    await getUserWalletList()
  } finally {
    isSpinning.value = false
  }
}

watch(
  width,
  (newWidth) => {
    if (newWidth >= 576) {
      isMobile.value = false
    } else {
      isMobile.value = true
    }
  },
  { immediate: true }
)

onMounted(async () => {
  await handleCmsList(CMS_TYPE.Enums.CONTACT_US)
})
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_r016/assets/css/_variable.scss";

@keyframes bell-shake {
  0% {
    transform: rotate(0);
  }
  15% {
    transform: rotate(15deg);
  }
  30% {
    transform: rotate(-15deg);
  }
  45% {
    transform: rotate(10deg);
  }
  60% {
    transform: rotate(-10deg);
  }
  75% {
    transform: rotate(5deg);
  }
  85% {
    transform: rotate(-5deg);
  }
  100% {
    transform: rotate(0);
  }
}

.header {
  z-index: 1;
  width: 100%;
  padding: 1.875rem 0;
  display: flex;
  align-items: center;
  justify-content: space-between;

  @include phone-width {
    padding: 0 0.625rem;
    height: 3.75rem;
  }

  .header-left {
    display: flex;
    justify-content: flex-start;
    align-items: center;

    .logo {
      width: 12.5rem;
      padding: 0;

      :deep(.q-btn__content) {
        justify-content: flex-start;
      }

      @include phone-width {
        width: 100px;
      }
    }
  }

  .header-right {
    display: flex;
    justify-content: flex-end;
    align-items: center;

    .info-wrapper {
      @include fontStyle(1.25rem);
      margin-right: 1.25rem;
      color: $neutral10;
      text-align: right;

      @include phone-width {
        @include fontStyle(0.625rem);
        margin-right: 0.25rem;
      }

      .wallet-balance {
        @include fontStyle(0.875rem);
        margin: 0.375rem 0 0;
        display: flex;
        align-items: center;
        justify-content: flex-end;

        .balance-label {
          @apply mx-2;
        }

        .balance-amount {
          @apply mr-2.5;
        }

        @include phone-width {
          @include fontStyle(0.625rem);
          margin-top: 0.25rem;
          .balance-label {
            @apply mx-1;
          }

          .balance-amount {
            @apply mr-1;
          }
        }

        .arrow-btn,
        .reload-btn {
          width: 1.2rem;
          height: 1.2rem;

          @include phone-width {
            width: 1.25rem;
            height: 1.25rem;
          }
        }

        .reload-btn {
          @apply cursor-pointer;
        }
      }
    }

    .icon-area {
      display: flex;
      align-items: center;
      justify-content: center;

      .shaking-bell:hover {
        animation: bell-shake 0.6s;
      }

      .user-wrapper {
        @apply relative;

        @include phone-width {
          :deep(.q-btn) {
            width: 1.875rem;
            height: 1.875rem;
            min-width: auto;
            min-height: auto;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }

        &:hover {
          .logout-modal {
            display: block;
          }
        }

        .user-icon {
          width: 3.75rem;

          @include phone-width {
            width: 1.875rem;
            height: 1.875rem;
          }
        }

        .logout-modal {
          @include fontStyle();
          display: none;
          position: absolute;
          top: 100%;
          left: 50%;
          background-color: $menu-default-color;
          border: 1px solid $menu-default-color;
          padding: 0.625rem 1.625rem;
          box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.2);
          z-index: 10;
          white-space: nowrap;
          transform: translateX(-50%);
          border-radius: 10px;
          cursor: pointer;
          color: $primary09;
          @include phone-width {
            left: unset;
          }
        }
      }
    }
  }
}

.language-bar {
  :deep(.q-avatar) {
    @include iphone-width {
      width: 1.5rem;
      height: 1.5rem;
    }
  }
}

.contact-wrapper {
  @apply flex items-center cursor-pointer ml-[.625rem];

  @include phone-width {
    margin-left: 0.3125rem;
  }

  .icon-img {
    width: 3.75rem;
    height: 3.75rem;

    @include phone-width {
      width: 1.625rem;
      height: 1.625rem;
    }
  }

  .contact-content {
    @apply flex flex-col gap-1 ml-2;

    @include phone-width {
      @apply ml-1;
      font-size: 0.625rem;
    }

    .contact-info {
      color: $primary09;
    }
  }
}
</style>
