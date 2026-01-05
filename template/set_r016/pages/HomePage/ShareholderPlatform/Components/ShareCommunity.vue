<template>
  <div class="share-community">
    <div class="community-container">
      <div class="share-community-header">
        <p>{{ $t("shareholder_platform.share_screenshot_community") }}！</p>
      </div>
      <div class="share-community-content">
        <q-btn v-for="item in shareOptions" :icon="`img:${item.icon}`" :key="item.icon" flat class="social-btn">
        </q-btn>
      </div>
    </div>
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useCommon } from "src/common/hooks/useCommon"
import { useCommonImg } from "src/common/hooks/useCommonImg"

const { accountInfo, getAccountInfo, inviteCodeUrl } = useUserInfo()
const { copyMessage } = useCommon()
const { commonResult } = useCommonImg()

const referralLink = ref("")

const shareOptions = computed(() => {
  return [
    {
      icon: commonResult("social/wechat.png"),
      link: "",
      enabled: true
    },
    {
      icon: commonResult("social/qq.png"),
      link: "",
      enabled: true
    },
    {
      icon: commonResult("social/tiktok.png"),
      link: "",
      enabled: true
    },
    {
      icon: commonResult("social/weibo.png"),
      link: "",
      enabled: true
    },
    {
      icon: commonResult("social/telegram.png"),
      link: "",
      enabled: true
    },
    {
      icon: commonResult("social/email.png"),
      link: "",
      enabled: true
    },
    {
      icon: commonResult("social/whatsapp.png"),
      link: "",
      enabled: true
    },
    {
      icon: commonResult("social/more.png"),
      link: "",
      enabled: true
    }
  ]
})

onMounted(async () => {
  await getAccountInfo()
  referralLink.value = inviteCodeUrl({ inviteCode: accountInfo.value.invite_code })
})
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";
@import "app/template/set_r016/assets/css/_variable.scss";
@import "app/template/set_r016/assets/css/shareholder.scss";

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
    @apply w-[3.125rem] h-[3.125rem] rounded-[.625rem] flex items-center justify-center;
    @apply border-none;

    &:deep(.q-icon) {
      @apply w-[3.125rem] h-[3.125rem];
    }
  }

  @include phone-width {
    @apply flex-wrap px-[2.5rem];
  }
}

.share-community-link {
  @apply flex flex-col items-center gap-[.625rem] rounded-[.625rem] p-[1.25rem];
  background: $secondary02;
  border: 1px solid $primary06;

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
    border-color: $primary05;
  }

  .referral-link-icon {
    @apply cursor-pointer mr-2;
    color: $primary05;
  }
}
</style>
