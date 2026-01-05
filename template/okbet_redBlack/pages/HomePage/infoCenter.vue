<template>
  <HeaderTitleBack title-i18n="menu.about_us" variant="redBlack">
    <div class="info-container">
      <q-btn
        class="info-row"
        flat
        v-for="(cmsItem, cmsIndex) in webInformationList"
        :key="cmsIndex"
        :to="{ path: '/webInformationCms/' + cmsItem.id }"
      >
        <span class="title">{{ getLocaleTitle(cmsItem) }}</span>
        <q-icon name="navigate_next" class="icon-navigate"></q-icon>
      </q-btn>
    </div>
  </HeaderTitleBack>
</template>

<script setup lang="ts">
import { onMounted } from "vue"
import { useRouter } from "vue-router"
import { useQuasar } from "quasar"
import { CMS_TYPE } from "src/common/utils/constants"
import { useCms } from "src/common/composables/useCms"
import { useLanguage } from "src/common/composables/useLanguage"
import HeaderTitleBack from "src/common/components/modal/HeaderTitleBack.vue"
import type * as Response from "src/api/response.type"

const router = useRouter()
const $q = useQuasar()

const { nowLang } = useLanguage()
const { webInformationList, handleCmsList } = useCms()

const getLocaleTitle = (cmsItem: Response.CmsItem) => {
  return cmsItem.Page.find((page) => page.lang === nowLang.value)?.title
}

onMounted(async () => {
  if (!$q.platform.is.mobile) {
    router.push({ name: "AboutUs" })
  }
  await handleCmsList(CMS_TYPE.Enums.WEBSITE_INFORMATION)
})
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";
@import "app/template/okbet_redBlack/assets/css/_variable.sass";

.info-container {
  margin-top: 10px;
  width: 100%;
  list-style: none;
  background: $background-light-color;
  // border: 0.5px solid $border-light-color;
  // box-shadow: rgba($box-shadow-soft-blue-gray-color, 0.12) 0px 4px 10px,
  //   rgba($box-shadow-light-color, 0.8) 0px 2px 2px inset;

  .info-row {
    padding-left: 5px;
    height: 6.25rem;
    width: 100%;

    :deep(.q-btn__content) {
      justify-content: space-between;

      .title {
        font-size: 1.75rem;
        line-height: 2.5rem;
        color: $text-steel-blue-color;
        padding-left: 1.25rem;
        text-transform: capitalize;
        font-weight: 400;
      }

      .q-icon {
        margin-right: 0.75rem;
        font-size: 2.5rem;
        color: $text-steel-blue-color;
        font-weight: 600;
      }
    }

    @include phone-width {
      height: 3.4375rem;

      :deep(.q-btn__content) {
        .title {
          font-size: 0.875rem;
          line-height: 1.25rem;
          padding-left: 0.625rem;
        }

        .q-icon {
          margin-right: 0.375rem;
          font-size: 1.25rem;
        }
      }
    }
  }

  .q-separator {
    margin-left: 1.75rem;
    margin-right: 1.75rem;
    height: 2px;
    background-color: $background-pale-gray-color;

    @include phone-width {
      margin-left: 0.875rem;
      margin-right: 0.875rem;
      height: 1px;
    }
  }
}
</style>
