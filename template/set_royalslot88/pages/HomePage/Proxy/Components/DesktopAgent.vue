<template>
  <div class="proxy-content">
    <template v-for="item in proxyList" :key="item.titleI18n">
      <div v-if="item.show" class="proxy-card">
        <q-img :src="proxyImg(item.imgName)"></q-img>
        <h2>{{ $t(item.titleI18n) }}</h2>
        <q-btn class="detail-btn" :to="{ name: item.routerName }">{{ $t("common.btn.view") }}</q-btn>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from "vue"
import { useSiteImg } from "app/template/set_royalslot88/hooks/useSiteImg"
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

.proxy-content {
  @apply flex items-center gap-[1.125rem];
  .proxy-card {
    @apply w-[17rem] h-[15.125rem] p-5 rounded-[1.25rem] flex flex-col items-center;
    background: #53356B;
    .q-img {
      @apply w-full h-auto;
    }
    h2 {
      @apply mt-5 text-xl font-normal;
      font-family: OpenSans;
    }
    .q-btn {
      @apply w-full h-[2.5625rem] min-h-[2.5625rem] rounded-[3.125rem] mt-3 capitalize;
      color: #fff;
      box-shadow: 0px -4px 4px 0px #00000066 inset;
      box-shadow: 0px 4px 4px 0px #FFFFFF4D inset;
      background: #AA1E74;
      border: 1px solid #5831D7;
    }
  }
}
</style>
