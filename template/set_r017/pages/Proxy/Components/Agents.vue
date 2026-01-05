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
import { onMounted, computed } from "vue"
import { useSiteImg } from "app/template/set_r017/hooks/useSiteImg"
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
@import "app/template/set_r017/assets/css/_variable.scss";

.agent-content {
  @apply flex flex-wrap items-center gap-5;

  .agent-card {
    @apply flex flex-col items-center gap-3;
    padding: 1.25rem 1.31rem 1.125rem;
    width: 17.8125rem;
    border-radius: 1.25rem;
    background: $secondary01;

    @include phone-width {
      width: 100%;
      padding: 1.25rem 1.6638rem 1.4375rem;
    }

    .q-img {
      @apply w-full h-auto;
      border-radius: 0.5rem;

      @include phone-width {
        max-height: 6.375rem;
      }
    }

    h2 {
      @apply mt-2;
      font-family: NotoSansTC;
      font-weight: 400;
      font-size: 1.25rem;
      line-height: 1.8125rem;
      color: $neutral01;

      @include phone-width {
        line-height: 1.5rem;
      }
    }

    .q-btn {
      @apply w-full h-[2.5625rem] min-h-[2.5625rem] rounded-[.25rem] capitalize;
      background: $gradient01;
      color: $neutral01;
      font-family: Noto Sans TC;
      font-weight: 700;
      font-size: 1rem;
      line-height: 1.1875rem;
      padding: 0.6875rem 0;
    }
  }
}
</style>
