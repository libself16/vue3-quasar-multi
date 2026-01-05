<template>
  <div v-if="cmsDetail" class="cms-container">
    <template v-if="isMobile">
      <HeaderTitleBack>
        <template #middle>
          <h2 class="title">
            {{ cmsDetailData.Setting.lang[nowLang as LANGUAGE_TYPE.Enums] }}
          </h2>
        </template>
        <CmsHomeDetail :cms-detail="cmsDetailData" />
        <FooterNav />
      </HeaderTitleBack>
    </template>
    <template v-else>
      <CmsHomeDetail :cms-detail="cmsDetailData" />
    </template>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed, watch, toRef } from "vue"
import { useQuasar } from "quasar"
import { useRoute } from "vue-router"
import { useLanguage } from "src/common/composables/useLanguage"
import { LANGUAGE_TYPE } from "src/common/utils/constants"
import HeaderTitleBack from "src/common/components/modal/HeaderTitleBack.vue"
import CmsHomeDetail from "./Cms/CmsHomeDetail.vue"
import FooterNav from "../../components/Footer/FooterNav.vue"
import { useDetailCms } from "src/common/apiHooks/cms/useDetailCms"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"

const { isDown } = useMediaQuery()
const isMobile = toRef(isDown, "padXl")

const $q = useQuasar()
const route = useRoute()
const { nowLang } = useLanguage()
const cmsId = computed(() => Number(route.params.cmsId))

// 主要打 API 獲取 cms detail
const { cmsDetailData } = useDetailCms({ id: cmsId.value })
</script>
