<template>
  <div class="fullscreen not-found-wrapper">
    <q-img v-if="getWideLogo" :src="getWideLogo()" fit="contain" class="logo" lazy-load />
    <q-img :src="error404Img" fit="contain" class="error-img" lazy-load />
    <p class="error-text">{{ $t("menu.pageNotFound") }}</p>
    <q-btn to="/" class="btn-home">
      <span>{{ $t("menu.backToHome") }}</span>
    </q-btn>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from "vue"
import { useLogo } from "src/common/composables/useLogo"
import { useSiteImg } from "app/template/set_r022/hooks/useSiteImg"

const { error404Img } = useSiteImg()
const { getWideLogo, handleLogoList } = useLogo()

onMounted(() => {
  handleLogoList()
})
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_r022/assets/css/_variable.scss";

.not-found-wrapper {
  @apply flex flex-col gap-5 items-center justify-center;
  background: var(--bg-main-bg);

  .logo {
    @apply w-[12.5rem] h-[6.25rem];
  }

  .error-img {
    @apply w-[25rem] h-[25rem];
  }

  .error-text {
    @apply text-[1.5rem];
    color: var(--secondary-01);
  }

  .btn-home {
    @apply w-[10.5rem] h-[2.75rem] rounded-[.5rem];
    background: var(--primary-01) !important;
    color: var(--text-01) !important;
  }
}
</style>
