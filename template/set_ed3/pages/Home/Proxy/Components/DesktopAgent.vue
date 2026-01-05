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
import { useSiteImg } from "app/template/set_ed3/hooks/useSiteImg"
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
@import "app/template/set_ed3/assets/css/_variable.scss";
@import "app/template/set_ed3/assets/css/button.scss";

.proxy-content {
  @apply flex items-center gap-[1.125rem];
  .proxy-card {
    @apply w-[17rem] h-[15.125rem] p-5 rounded-[0.5rem] flex flex-col items-center;
    background: #009770;
    color: #fff;
    .q-img {
      @apply w-full h-auto;
    }
    h2 {
      @apply mt-5 text-xl font-normal;
    }
    .q-btn {
      @apply w-full h-[2.5625rem] min-h-[2.5625rem] rounded-[0.5rem] mt-3 capitalize;
      background: linear-gradient(90deg, #1FC88F 0%, #F4EE70 100%);
      color: #0B5544;
    }
  }
}
</style>
