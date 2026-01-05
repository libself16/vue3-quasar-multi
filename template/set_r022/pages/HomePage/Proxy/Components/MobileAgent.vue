<template>
  <div class="proxy-content">
    <template v-for="item in proxyList" :key="item.titleI18n">
      <div v-if="item.show" class="proxy-card">
        <q-img :src="proxyImg(item.imgName)"></q-img>
        <div class="proxy-row">
          <h2>{{ $t(item.titleI18n) }}</h2>
          <q-btn :to="{ name: item.routerName }">{{ $t("common.btn.view") }}</q-btn>
        </div>
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
  @apply flex flex-col items-center gap-3;

  .proxy-card {
    width: 100%;
    background: var(--neutral-01);
    padding: 0.75rem;
    border-radius: 0.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;

    .q-img {
      width: 100%;
    }

    .proxy-row {
      width: 100%;
      margin-top: 0.75rem;
      display: flex;
      align-items: center;
      justify-content: space-between;

      h2 {
        @apply text-sm font-semibold;
        color: var(--secondary-01);
      }

      .q-btn {
        height: 2.3125rem;
        min-height: unset;
        background: var(--primary-01);
        color: var(--text-01);
        border-radius: 0.5rem;
        padding: 0 1.89rem;
      }
    }
  }
}
</style>
