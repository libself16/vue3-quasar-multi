<template>
  <div>
    <template v-if="props.isPc">
      <q-btn
        v-if="props.isKycEnabled"
        rounded
        flat
        class="top-btn-badge btn-kyc-badge ml-2.5"
        :to="props.shouldNavigate ? { name: 'MemberKyc' } : null"
        @click="handleClick"
      >
        <template v-if="props.approvalStatus">
          <img :class="`${desktopImgStyle}`" :src="commonResult('kyc/v2_approved.png')" />
          {{ kycPrefix }} {{ $t(verifiedLang) }}
        </template>

        <template v-else>
          <img :class="`${desktopImgStyle}`" :src="commonResult('kyc/v2_rejected.png')" />
          {{ kycPrefix }} {{ $t(unverifiedLang) }}
        </template>
      </q-btn>
    </template>

    <template v-else>
      <div v-if="props.isKycEnabled" class="ml-4 mb-1">
        <q-btn
          class="mobile-kyc-btn"
          rounded
          flat
          :to="props.shouldNavigate ? { name: 'MemberKyc' } : null"
          @click="handleClick"
        >
          <template v-if="props.approvalStatus">
            <img :class="`${mobileImgStyle}`" :src="commonResult('kyc/v2_approved.png')" />
            {{ kycPrefix }} {{ $t(verifiedLang) }}
          </template>

          <template v-else>
            <img :class="`${mobileImgStyle}`" :src="commonResult('kyc/v2_rejected.png')" />
            {{ kycPrefix }} {{ $t(unverifiedLang) }}
          </template>
        </q-btn>
      </div>
    </template>
  </div>
</template>

<script setup>
import { useCommonImg } from "src/common/hooks/useCommonImg"

const props = defineProps({
  isPc: {
    type: Boolean,
    default: false
  },
  isKycEnabled: {
    type: Boolean,
    required: true
  },
  approvalStatus: {
    type: String,
    required: true
  },
  shouldNavigate: {
    type: Boolean,
    default: true
  }
})
const emit = defineEmits(["click-action"])

const { commonResult } = useCommonImg()
const kycPrefix = "KYC"
const mobileImgStyle = "w-4 mr-1"
const desktopImgStyle = "w-5 h-5 mr-1"
const verifiedLang = "member.kyc.status_success"
const unverifiedLang = "member.kyc.status_unverified"

const handleClick = () => {
  if (!props.shouldNavigate) {
    emit("click-action")
  } else {
    router.push({ name: "MemberKyc" })
  }
}
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/okbet_blue/assets/css/_variable.sass";
@import "app/template/okbet_blue/assets/css/button.scss";
@import "app/template/okbet_blue/assets/css/member.scss";

.top-btn-badge {
  @include btn-common;
  background-color: transparent !important;
  .q-icon {
    margin-right: 5px;
    font-size: 1.25rem;
  }
}

.btn-kyc-badge {
  background: transparent;
  border: 2px solid $text-light-primary;
  color: $text-white-color !important;
  line-height: 0;
}

.mobile-kyc-btn {
  @apply py-[.25rem] text-base;
  background: none !important;
  border: 1px solid $text-light-primary;
  line-height: 0;
  min-height: auto;
  color: $text-white-color;
}
</style>
