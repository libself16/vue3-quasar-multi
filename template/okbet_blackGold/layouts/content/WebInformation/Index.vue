<template>
  <HeaderTitleBack v-if="$q.platform.is.mobile" class="hide-on-pc" variant="blackGold" :titleI18n="webInformationTitle">
    <div class="other-container">
      <div class="other-content">
        <div class="card">
            <div class="card-title">
            {{ webInformationTitle }}
          </div>
          <div>
            <div class="detail" v-html="webInformationContent"></div>
          </div>
        </div>
      </div>
    </div>
  </HeaderTitleBack>
  <div v-else class="web-information-content">
    <!--<div class="about-us-image"></div>-->
    <div class="other-container">
      <div class="other-content">
        <div class="about-us-wrapper">
          <div class="card">
              <div class="card-title">
              {{ webInformationTitle }}
            </div>
            <div>
              <div class="detail" v-html="webInformationContent"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from "vue"
import HeaderTitleBack from "src/common/components/modal/HeaderTitleBack.vue"
import { useQuasar } from "quasar"
import { useCms } from "src/common/composables/useCms"
import { CMS_TYPE } from "src/common/utils/constants"

const $q = useQuasar()
const { handleCmsList, webInformationTitle, webInformationContent } = useCms()

onMounted(async () => {
  await handleCmsList(CMS_TYPE.Enums.WEBSITE_INFORMATION)
})
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/okbet_blackGold/assets/css/_variable.sass";

.hide-on-pc {
  display: none;
  @include phone-width {
    display: block;
  }
}

.web-information-content {
  @include setFlex;
  flex-direction: column;
  cursor: pointer;
  padding-bottom: 20px;

  .about-us-image {
    background-image: url("../../../assets/images/about-us.png");
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    width: 90%;
    max-width: 1200px;
    height: 300px;
  }

  .about-container {
    background: #fff;
    border-radius: 12px;
    color: rgb(94, 109, 120);
    width: 95%;
    padding: 40px;

    .about-content {
      padding: 30px;
      border: 2px solid rgb(231, 234, 241);
      border-radius: 14px;
    }
  }

  .other-container {
    width: 90%;

    @include phone-width {
      width: 100%;
    }
  }
}

.other-content {
  @apply p-6;

   @include phone-width {
    @apply p-4;
  }
}

.card {
  background: $primary-black-color;
  @apply p-5 rounded-lg;

  @include phone-width {
    @apply p-4 rounded-none;
    border-radius: 0px;
  }

  .card-title {
    font-weight: 500;
    font-size: 20px;
    line-height: 1;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    color: $primary-white-color;
    padding-bottom: 10px;
    margin-bottom: 10px;
    border-bottom: 1px solid $gray-border-color;

    &::before {
      content: "";
      display: inline-block;
      width: 3px;
      height: 16px;
      background-color: $primary-gold-color;
      margin-right: 5px;
    }

    @include phone-width {
      font-size: 16px;
      line-height: 1;
    }
  }

  .detail {
    font-size: 20px;
    line-height: 1.8;
    font-weight: 400;
    color: $primary-white-color;
    margin-bottom: 15px;
    width: 100%;
    word-wrap: break-word;
    min-height: 50vh;
    min-height: 50dvh;

    @include phone-width {
      font-size: 16px;
    }

    :deep(> *) {
      padding-left: 0 !important;
      padding-right: 0 !important;
    }
  }
}
</style>
