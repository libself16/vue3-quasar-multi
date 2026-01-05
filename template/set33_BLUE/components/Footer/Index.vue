<template>
  <div class="footer-wrapper">
    <footer class="layout-footer">
      <ul v-if="cmsFooterLogos && cmsFooterLogos.length" class="footer-logo-list">
        <li class="logo-item" v-for="footer in cmsFooterLogos" :key="footer">
          <q-img class="logo-image" :src="footer" fit="contain" :error-src="productDefaultImg" />
        </li>
      </ul>
      <div class="content-wrapper" v-if="cmsFooterTextContent?.content">
        <div class="content" v-html="cmsFooterTextContent?.content"></div>
      </div>
    </footer>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from "vue"
import { useCommonImg } from "src/common/hooks/useCommonImg"
import { useCms } from "src/common/composables/useCms"
import { CMS_TYPE } from "src/common/utils/constants"

const { productDefaultImg } = useCommonImg()
const { cmsFooterLogos, cmsFooterTextContent, handleCmsList } = useCms()

onMounted(async () => {
  await handleCmsList(CMS_TYPE.Enums.FOOTER_SETTINGS)
})
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set33_BLUE/assets/css/_variable.sass";

.footer-wrapper {
  @apply bg-black text-white pb-[3rem];

  @include phone-width {
    @apply pb-[7.5rem];
  }

  @include iphone-width {
    @apply pb-[6rem];
  }

  .layout-footer {
    @apply flex flex-col;
    font-size: 0.6875rem;
    padding: 0 0.8125rem;
    max-width: 85.375rem;
    align-self: center;
    background-color: var(--neutral-2);
    margin: 0 auto;
  }
}

.footer-logo-list {
  @apply flex flex-wrap justify-center py-4;
  border-bottom: 1px dashed #fff;
}

.logo-image {
  @apply w-[10.125rem] h-[3.375rem] mb-[.625rem];

  @include iphone-width {
    @apply mx-[.3125rem];
  }
}

.content-wrapper {
  @apply mt-4;
}
</style>
