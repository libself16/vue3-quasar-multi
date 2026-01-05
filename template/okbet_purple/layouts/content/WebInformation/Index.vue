<template>
  <HeaderTitleBack v-if="$q.platform.is.mobile" class="hide-on-pc" :titleI18n="title" variant="purple-dark">
    <div class="other-container">
      <div class="other-content">
        <div class="card">
          <div class="title">
            {{ title }}
          </div>
          <div>
            <div class="detail" v-html="content"></div>
          </div>
        </div>
      </div>
    </div>
  </HeaderTitleBack>
  <div v-else class="web-information-content">
    <div class="other-container">
      <div class="other-content">
        <div class="about-us-wrapper">
          <div class="card">
            <div class="title">
              {{ title }}
            </div>
            <div>
              <div class="detail" v-html="content"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted, ref, watch } from "vue"
import { useRoute } from "vue-router"
import HeaderTitleBack from "src/common/components/modal/HeaderTitleBack.vue"
import { useQuasar } from "quasar"
import { useCms } from "src/common/composables/useCms"
import { useLanguage } from "src/common/composables/useLanguage"
import { CMS_TYPE, LANGUAGE_TYPE, CMS_ENTRANCE_TYPE } from "src/common/utils/constants"
import type * as Response from "src/api/response.type"

export default defineComponent({
  name: "HomeWebInformation",
  components: {
    HeaderTitleBack
  },
  setup() {
    const route = useRoute()
    const { nowLang } = useLanguage()
    const $q = useQuasar()
    const { cmsListState, handleCmsList } = useCms()
    //route.params.id
    const informationData = ref<Response.CmsItem>()

    onMounted(async () => {
      await handleCmsList(CMS_TYPE.Enums.WEBSITE_INFORMATION)
      const websiteInformation = cmsListState.value[CMS_TYPE.Enums.WEBSITE_INFORMATION]
      informationData.value = websiteInformation.find((item) => item.id === Number(route.params.id))
    })

    const title = computed(() => {
      return informationData.value?.Page.find((pages: { lang: string }) => pages.lang === nowLang.value)?.title || ""
    })
    const content = computed(() => {
      return informationData.value?.Page.find((pages: { lang: string }) => pages.lang === nowLang.value)?.content || ""
    })
    watch(
      () => route.params.id,
      () => {
        informationData.value = cmsListState.value[CMS_TYPE.Enums.WEBSITE_INFORMATION].find(
          (item) => item.id === Number(route.params.id)
        )
      }
    )

    return {
      informationData,
      title,
      content
    }
  }
})
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/okbet_purple/assets/css/_variable.sass";

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
    background: $bg-dark-secondary;
    border-radius: 12px;
    color: $text-light-primary;
    width: 95%;
    padding: 40px;

    .about-content {
      padding: 30px;
      border: 2px solid $border-dark;
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
  background: $bg-dark-secondary;
  box-shadow: rgba(162, 162, 180, 0.1) 0px 3px 10px;
  border-radius: 8px;
  margin: 10px 0px;
  padding: 10px 20px;

  @include phone-width {
    background: $bg-dark;
    border-radius: 0px;
  }

  .title {
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    color: $text-light-secondary;
    padding-bottom: 10px;
    margin-bottom: 10px;
    border-bottom: 1px solid $border-dark;

    &::before {
      content: "";
      display: inline-block;
      width: 3px;
      height: 16px;
      background-color: $bg-secondary;
      margin-right: 5px;
    }
  }

  .detail {
    font-size: 14px;
    line-height: 24px;
    font-weight: 400;
    color: $text-light-secondary !important;
    margin-bottom: 15px;
    width: 100%;
    word-wrap: break-word;
  }
}
</style>
