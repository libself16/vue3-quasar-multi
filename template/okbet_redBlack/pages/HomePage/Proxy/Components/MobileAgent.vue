<template>
  <div class="proxy-content">
    <template v-for="item in proxyList" :key="item.titleI18n">
      <div v-if="item.show" class="proxy-card">
        <q-img :src="proxyImg(item.imgName)"></q-img>
        <div class="proxy-row">
          <h2>{{ $t(item.titleI18n) }}</h2>
          <q-btn color="primary" text-color="black" :to="{ name: item.routerName }">{{ $t("common.btn.view") }}</q-btn>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from "vue"
import { useSiteImg } from "app/template/okbet_redBlack/hooks/useSiteImg"
import { useCollaboration } from "src/common/composables/useCollaboration"

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
  }
])

onMounted(async () => {
  await handleGetCollaborationVisibility()
})
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";
@import "app/template/okbet_redBlack/assets/css/_variable.sass";
@import "app/template/okbet_redBlack/assets/css/button.scss";

.proxy-content {
  @apply flex flex-col items-center gap-8;
  .proxy-card {
    @apply w-full;
    .q-img {
      @apply w-full h-auto;
    }
    .proxy-row {
      @apply flex justify-between items-center py-2;
      h2 {
        @apply text-sm font-semibold;
        color: $white-color;
      }
      .q-btn {
        @apply min-h-0 px-3 py-[.2813rem] rounded-[2.1344rem] capitalize;
      }
    }
  }
}
</style>
