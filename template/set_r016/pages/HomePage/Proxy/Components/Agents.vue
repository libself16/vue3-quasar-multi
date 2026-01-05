<template>
  <div class="agent-content">
    <template v-for="item in proxyList" :key="item.titleI18n">
      <div v-if="item.show" class="agent-card">
        <q-img :src="proxyImg(item.imgName)"></q-img>
        <h2>{{ $t(item.titleI18n) }}</h2>
        <q-btn :to="{ name: item.routerName }">{{ $t("common.btn.view") }}</q-btn>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue"
import { useSiteImg } from "app/template/set_r016/hooks/useSiteImg"
import { useCollaboration } from "src/common/composables/useCollaboration"
import { useApi } from "src/common/hooks/useApi"
import { proxyDisplay } from "src/api/site"
import type * as Response from "src/api/response.type"

const { proxyImg } = useSiteImg()
const { showCollaboration, handleGetCollaborationVisibility } = useCollaboration()

const proxyList = computed(() => [
  {
    imgName: "member-proxy.png",
    titleI18n: "menu.memberAgent",
    routerName: "Referral",
    show: false
  },
  {
    imgName: "collaboration-proxy.png",
    titleI18n: "menu.jointVentureAgent",
    routerName: "Collaboration",
    show: showCollaboration.value
  },
  {
    imgName: "commission-dividends.png.png",
    titleI18n: "menu.revenueSharing",
    routerName: "",
    show: false
  },
  {
    imgName: "shareholder-dividends.png",
    titleI18n: "menu.shareholderDividend",
    routerName: "",
    show: false
  },
  {
    imgName: "shareholder-dividends.png",
    titleI18n: "menu.shareholder",
    routerName: "ShareholderPlatform",
    show: proxyDisplayConfig.value?.shareholder_detail
  }
])
const proxyDisplayConfig = ref<Response.ProxyDisplayConfig>()

const getProxyDisplay = async () => {
  try {
    const { status, data } = await useApi(proxyDisplay)
    if (status && data) {
      proxyDisplayConfig.value = data
    }
  } catch (error) {}
}

onMounted(async () => {
  await handleGetCollaborationVisibility()
  await getProxyDisplay()
})
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";
@import "app/template/set_r016/assets/css/_variable.scss";
@import "app/template/set_r016/assets/css/button.scss";

.agent-content {
  @apply flex flex-wrap items-center gap-5;

  .agent-card {
    @apply p-5  flex flex-col items-center gap-3;
    width: 21.625rem;
    border-radius: 0.625rem;
    background: $primary06;

    @include phone-width {
      width: 100%;
    }

    .q-img {
      @apply w-full h-auto;
      border-radius: 0.625rem;
    }

    h2 {
      @apply mt-2;
      @include fontStyle(1.25rem, 400);
      color: $neutral01;
    }

    .q-btn {
      @apply w-full h-[2.25rem] min-h-[2.25rem] rounded-[.625rem] capitalize;
      @include fontStyle();
      background: $neutral01;
      color: $primary04;
    }
  }
}
</style>
