<template>
  <div class="invite-bonus-header">
    <div class="header-title-label">
      <q-img class="label-img" :src="memberCenterIconImage('bonus-white')" loading="lazy"></q-img>
      <p class="label-text">{{ $t("menu.invitation_bonus") }}</p>
    </div>
    <div class="header-title-content">
      <div class="chest" v-if="translation">
        <img
          class="chest-img"
          :src="
            translation.images !== '' && translation.images
              ? translation.images
              : resultImages('invite-bonus/chest.png')
          "
          alt=""
          srcset=""
        />
        <p class="chest-label" v-html="translation.title"></p>
      </div>
      <div class="share-community">
        <div class="share-community-link">
          <p>{{ $t("shareholder_platform.share_referral_link") }}！</p>
          <q-input v-model="referralLink" readonly bg-color="white" outlined class="referral-link">
            <template v-slot:append>
              <q-icon
                name="share"
                class="referral-link-icon"
                @click="copyMessage(inviteCodeUrl({ inviteCode: accountInfo.invite_code }))"
              />
              <q-icon name="content_copy" class="referral-link-icon" @click="copyMessage(accountInfo.invite_code)" />
            </template>
          </q-input>
        </div>
        <div class="community-container">
          <div class="share-community-header">
            <p>{{ $t("shareholder_platform.share_screenshot_community") }}！</p>
          </div>
          <div class="share-community-content">
            <q-btn
              v-for="item in shareOptions"
              :icon="`img:${item.icon}`"
              :key="item.icon"
              flat
              class="social-btn"
              :label="item.label"
            >
            </q-btn>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_r016/assets/css/_variable.scss";
@import "app/template/set_r016/assets/css/button.scss";

.invite-bonus-header {
  @apply overflow-hidden rounded-[10px];
  background-color: $primary05;
  .header-title-label {
    @apply flex items-center justify-center text-white;
    @apply gap-[0.75rem] py-[0.75rem];
    .label-img {
      @apply w-[2.5rem];
    }
    .label-text {
      @apply text-[26px];
    }
  }
  .header-title-content {
    @apply min-h-[436px] rounded-t-[10px];
    @apply flex items-center justify-around;
    background: $gradient03;

    @include phone-width {
      @apply flex-col pt-8;
    }

    .chest {
      @apply flex flex-col items-center justify-center gap-[10px];
      .chest-img {
        @apply w-[300px];
      }
      .chest-label {
        @apply text-[1.25rem] text-white font-bold leading-none;
        @include phone-width {
          @apply font-normal;
        }
      }
    }

    .share-community {
      @apply flex flex-col gap-[1.25rem] my-[1.25rem];

      &-header {
        @apply text-center text-base font-bold;
        color: $neutral01;
      }
    }

    .share-community-content {
      @apply flex justify-center gap-[2rem] my-[1.25rem];
      .social-btn {
        @apply w-[3.125rem] h-auto rounded-[.625rem] flex items-center justify-center;
        @apply border-none;

        &:deep(.q-icon) {
          @apply w-[3.125rem] h-[3.125rem] mx-auto mb-[10px] drop-shadow-md;
        }

        &:deep(.q-btn__content span) {
          @apply text-[18px] text-white;
        }
      }

      @include phone-width {
        @apply flex-wrap px-0;
      }
    }

    .share-community-link {
      @apply flex flex-col items-center gap-[.625rem] rounded-[.625rem] p-[1.25rem];

      p {
        @apply text-base font-bold;
        color: $neutral01;
      }

      :deep(.q-field__control) {
        @apply max-w-[18.75rem] max-h-[2.5rem] rounded-[.625rem];
        color: $neutral06 !important;
      }

      :deep(.q-field__control-container),
      :deep(.q-field__marginal) {
        @apply max-h-[2.5rem];
      }

      :deep(.q-field--outlined .q-field__control:after) {
        @apply max-h-[2.5rem];
        border-color: white;
      }

      .referral-link-icon {
        @apply cursor-pointer mr-2;
        color: $primary05;
      }
    }
  }
}
</style>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue"
import { useI18n } from "vue-i18n"
import { useCommon } from "src/common/hooks/useCommon"
import { useCommonImg } from "src/common/hooks/useCommonImg"
import { useSiteImg } from "app/template/set_r016/hooks/useSiteImg"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useLanguage } from "src/common/composables/useLanguage"
import type * as Response from "src/api/response.type"

const { t } = useI18n()
const { nowLang } = useLanguage()
const { copyMessage } = useCommon()
const { commonResult } = useCommonImg()
const { memberCenterIconImage, resultImages } = useSiteImg()
const { accountInfo, getAccountInfo, inviteCodeUrl } = useUserInfo()

const referralLink = ref("")
const shareOptions = computed(() => {
  return [
    {
      icon: commonResult("social/wechat.png"),
      link: "",
      enabled: true,
      label: t("social_media.wechat")
    },
    {
      icon: commonResult("social/qq.png"),
      link: "",
      enabled: true,
      label: t("social_media.qq")
    },
    {
      icon: commonResult("social/tiktok.png"),
      link: "",
      enabled: true,
      label: t("social_media.tiktok")
    },
    {
      icon: commonResult("social/more.png"),
      link: "",
      enabled: true,
      label: t("social_media.more")
    }
  ]
})

const props = defineProps({
  translation: {
    type: Array as () => Response.ReferralSignupOverviewTranslation[],
    required: true
  }
})

const translation = computed(() => {
  return props.translation.find((item) => item.language === nowLang.value)
})

onMounted(async () => {
  await getAccountInfo()
  referralLink.value = inviteCodeUrl({ inviteCode: accountInfo.value.invite_code })
})
</script>
