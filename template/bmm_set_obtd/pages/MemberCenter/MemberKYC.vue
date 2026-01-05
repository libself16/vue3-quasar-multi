<template>
  <HeaderTitleBack v-if="$q.platform.is.mobile" titleI18n="member.kyc.kyc_verify">
    <div class="h5-kyc-cards">
      <template v-for="setting in kycSetting" :key="setting">
        <KycCard :setting="setting" :dragging="dragging" :handleWindowDragDrop="handleWindowDragDrop" />
      </template>
    </div>
  </HeaderTitleBack>

  <div v-else class="pc-kyc">
    <div class="pc-kyc-header">
      <q-btn flat class="pc-kyc-header-title hide-hover" :to="{ name: 'memberProfile' }">
        <q-icon name="arrow_back" class=""></q-icon>
        {{ $t("member.kyc.kyc_status") }}
      </q-btn>
      <div>
        <q-btn rounded flat icon="mail" class="top-btn" :to="{ name: 'memberInbox' }"></q-btn>
        <q-btn rounded flat class="top-btn btn-kyc">
          <template v-if="isKycVerified">
            <img :src="commonResult('kyc/v2_approved.png')" />
            KYC {{ $t("member.kyc.status_success") }}
          </template>
          <template v-else>
            <img :src="commonResult('kyc/v2_rejected.png')" />
            KYC {{ $t("member.kyc.status_unverified") }}
          </template>
        </q-btn>
      </div>
    </div>
    <div class="pc-kyc-body">
      <div class="pc-kyc-body-cards">
        <template v-for="setting in kycSetting" :key="setting">
          <KycCard :setting="setting" :dragging="dragging" :handleWindowDragDrop="handleWindowDragDrop" />
        </template>
      </div>

      <q-btn class="kyc-send" @click="handleSubmit">{{ $t("common.btn.submit") }}</q-btn>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted } from "vue"
import { useQuasar } from "quasar"
import { useI18n } from "vue-i18n"
import { useRouter } from "vue-router"
import { useCommonImg } from "src/common/hooks/useCommonImg"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useKyc } from "src/common/hooks/useKyc"
import HeaderTitleBack from "src/common/components/modal/HeaderTitleBack.vue"
import KycCard from "src/common/components/Kyc/Card.vue"

const { t } = useI18n()
const $q = useQuasar()
const router = useRouter()
const { isKycEnabled, isKycVerified } = useUserInfo()
const { commonResult } = useCommonImg()
const {
  handleSubmit,
  kycSetting,
  getKycItem,
  getKycSetting,
  isLoading,
  dragging,
  handleWindowDragEnter,
  handleWindowDragLeave,
  handleWindowDragDrop
} = useKyc()

onMounted(async () => {
  if (!isKycEnabled.value) {
    console.error("KYC is not available on this site.")
    router.push({ name: "memberProfile" })
    return
  }
  await getKycItem()
  await getKycSetting()
  window.addEventListener("dragenter", handleWindowDragEnter)
  window.addEventListener("dragleave", handleWindowDragLeave)
})

onUnmounted(() => {
  window.removeEventListener("dragenter", handleWindowDragEnter)
  window.removeEventListener("dragleave", handleWindowDragLeave)
})
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/bmm_set_obtd/assets/css/_variable.sass";
@import "app/template/bmm_set_obtd/assets/css/button.scss";

:deep(.dropzone-btn) {
  background-color: #025be8 !important;
}

.scontent {
  color: rgba($text-dark-color, 0.5);
  padding-left: 10px;
  padding-top: 10px;
  padding-bottom: 10px;
}
.stitle {
  font-size: 18px;
}
.pc-kyc {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-direction: column;
  width: 100%;
  height: 100%;
  border-radius: 20px;
  padding: 70px 45px;

  .pc-kyc-header {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    max-height: 54px;
    @apply w-full flex justify-between items-center;
    .pc-kyc-header-title {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      font-family: OpenSans;
      font-size: 40px;
      color: $primary-color;
      font-weight: 800;
      cursor: pointer;
      padding: 0;
      text-transform: none;
      font-weight: 800;
      .q-icon {
        font-size: 36px;
        margin-right: 12px;
      }
    }

    .top-btn {
      @include btn-common;
      .q-icon {
        margin-right: 5px;
        font-size: 1.25rem;
      }
      img {
        width: 20px;
        height: 20px;
        margin-right: 5px;
      }
    }
    .btn-kyc {
      font-family: OpenSans;
      font-weight: 600;
      margin-left: 10px;
      background: none !important;
      border: 2px solid;
      line-height: 0;
    }
  }

  .pc-kyc-body {
    @apply w-full mt-10 p-7 rounded-xl;
    border: 1px solid #e5ebf2;

    .pc-kyc-body-cards {
      @apply grid grid-cols-2 gap-4;
    }

    .kyc-send {
      @apply mt-7 py-[.4375rem] w-full rounded-lg;
      background-color: #025be8;
      min-height: auto;

      :deep(.q-btn__content) {
        font-family: NotoSansTC;
        font-weight: 350;
        font-size: 16px;
        line-height: 27.44px;
        text-align: center;
        vertical-align: middle;
        text-transform: capitalize;
        color: #ffffff;
      }
    }
  }
}

.h5-kyc-cards {
  @apply px-4 py-5 flex flex-col gap-4;
}

.hide-hover {
  :deep(.q-focus-helper) {
    opacity: 0 !important;
    background-color: transparent !important;
  }
}

.q-focus-helper {
  height: unset !important;
}
</style>
