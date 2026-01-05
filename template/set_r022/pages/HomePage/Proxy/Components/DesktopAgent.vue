<template>
  <div class="proxy-content">
    <template v-for="item in proxyList" :key="item.titleI18n">
      <div v-if="item.show" class="proxy-card">
        <q-img :src="proxyImg(item.imgName)"></q-img>
        <h2>{{ $t(item.titleI18n) }}</h2>
        <q-btn :to="{ name: item.routerName }">{{ $t("common.btn.view") }}</q-btn>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from "vue"
import { useSiteImg } from "app/template/set_r022/hooks/useSiteImg"
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
@import "app/template/set_r022/assets/css/_variable.scss";
@import "app/template/set_r022/assets/css/button.scss";

.proxy-content {
  @apply flex items-center gap-[1.125rem];
  .proxy-card {
    @apply w-[17rem] h-[15.125rem] p-5 rounded-[1.25rem] flex flex-col items-center;
    background: var(--neutral-01);
    .q-img {
      @apply w-full h-auto;
    }
    h2 {
      font-family: OpenSans;
      color: var(--secondary-01);
      font-size: 1.25rem;
      font-weight: 600;
      margin-top: 1.25rem;
    }
    .q-btn {
      width: 100%;
      min-height: unset;
      line-height: normal;
      padding: 0.4375rem 0;
      background: var(--primary-01);
      color: var(--text-01);
      font-size: 1.25rem;
      border-radius: 0.5rem;
      margin-top: 0.75rem;
    }
  }
}
</style>
