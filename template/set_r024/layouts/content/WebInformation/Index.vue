<template>
  <HeaderTitleBack
    v-if="$q.platform.is.mobile"
    class="hide-on-pc"
    :titleI18n="webInformationTitle"
    variant="blueOrange"
  >
    <div class="other-container">
      <div class="other-content" :class="{ 'extra-padding': isUnderWebInformationGroup }">
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
    <div class="other-container">
      <div class="other-content" :class="{ 'extra-padding': isUnderWebInformationGroup }">
        <div class="about-us-wrapper">
          <div class="card">
            <div class="card-title">{{ webInformationTitle }}</div>
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
import { onMounted, computed } from "vue"
import HeaderTitleBack from "src/common/components/modal/HeaderTitleBack.vue"
import { useQuasar } from "quasar"
import { useCms } from "src/common/composables/useCms"
import { CMS_TYPE } from "src/common/utils/constants"
import { useRoute } from "vue-router"

const $q = useQuasar()
const route = useRoute()

const isUnderWebInformationGroup = computed(() => route.matched.some((record) => record.name === "webInformation"))

const { handleCmsList, webInformationTitle, webInformationContent } = useCms()

onMounted(async () => {
  await handleCmsList(CMS_TYPE.Enums.WEBSITE_INFORMATION)
})
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_r024/assets/css/_variable.sass";

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

  .other-container {
    width: 90%;

    @include phone-width {
      width: 100%;
    }
  }
}
.other-content {
  @apply p-6;

  &.extra-padding {
    @apply pt-[6.125rem] px-6 pb-6;
  }

  @include phone-width {
    @apply p-4;
  }
}
.card {
  background: $secondary-card;
  color: $neutral-01;
  @apply p-5 rounded-lg;

  @include phone-width {
    border-radius: 0px;
    @apply p-4 rounded-none;
  }

  .card-title {
    font-weight: 500;
    font-size: 20px;
    line-height: 1;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    padding-bottom: 10px;
    margin-bottom: 10px;
    border-bottom: 1px solid $functional-line;

    &::before {
      content: "";
      display: inline-block;
      width: 3px;
      height: 16px;
      background-color: $primary-01;
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
