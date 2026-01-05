<template>
  <HeaderTitleBack v-if="$q.platform.is.mobile" class="hide-on-pc" :titleI18n="webInformationTitle">
    <div class="other-container">
      <div class="other-content">
        <div class="card">
          <div class="title">
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
            <div class="title">
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
@import "app/template/bmm_set_obtd/assets/css/_variable.sass";

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
    background: $background-light-color;
    border-radius: 12px;
    color: $text-smoke-gray-color;
    width: 95%;
    padding: 40px;

    .about-content {
      padding: 30px;
      border: 2px solid $border-pale-gray-color;
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
.card {
  background: $background-light-color;
  box-shadow: rgba($box-shadow-soft-slate-gray-color, 0.1) 0px 3px 10px;
  border-radius: 8px;
  margin: 10px 0px;
  padding: 10px 20px;

  @include phone-width {
    border-radius: 0px;
  }

  .title {
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    color: $text-charcoal-gray-color;
    padding-bottom: 10px;
    margin-bottom: 10px;
    border-bottom: 1px solid $border-pale-gray-color;

    &::before {
      content: "";
      display: inline-block;
      width: 3px;
      height: 16px;
      background-color: $primary-color;
      margin-right: 5px;
    }
  }

  .detail {
    font-size: 14px;
    line-height: 24px;
    font-weight: 400;
    color: $text-charcoal-gray-color-light;
    margin-bottom: 15px;
    width: 100%;
    word-wrap: break-word;
  }
}
</style>
