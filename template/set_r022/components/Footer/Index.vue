<template>
  <footer class="flex footer-wrapper">
    <div v-if="cmsFooterLogos && cmsFooterLogos.length" class="mx-auto logo-list-wrapper">
      <ul class="flex flex-row justify-center provider-list">
        <li
          class="flex justify-center flex-initial px-0 py-2 sm:px-4 provider-item"
          v-for="item in cmsFooterLogos"
          :key="item"
        >
          <img :src="item" :alt="item.toString()" @error="setDefaultProductTabImg" />
        </li>
      </ul>
    </div>
    <div v-if="cmsFooterTextContent?.content" class="mx-auto mt-4 text-content-wrapper">
      <div class="content" v-html="cmsFooterTextContent?.content"></div>
    </div>
  </footer>
  <div class="footer-wrapper">
    <FooterNav />
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from "vue"
import { useSiteImg } from "../../hooks/useSiteImg"
import FooterNav from "./FooterNav.vue"
import { useCms } from "src/common/composables/useCms"
import { CMS_TYPE } from "src/common/utils/constants"

const { setDefaultProductTabImg } = useSiteImg()
const { cmsFooterLogos, cmsFooterTextContent, handleCmsList } = useCms()

onMounted(async () => {
  await handleCmsList(CMS_TYPE.Enums.WEBSITE_INFORMATION)
  await handleCmsList(CMS_TYPE.Enums.FOOTER_SETTINGS)
})
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_r022/assets/css/_variable.scss";

footer.footer-wrapper {
  padding-top: 1vw;
  padding-bottom: 1vw;

  @include pad-large-width {
    padding-bottom: 10vw;
  }

  @include iphone-width {
    padding-bottom: 25vw;
  }
}

.footer-wrapper {
  width: 100%;
  background: var(--secondary-04);
  color: var(--primary-05);

  @include pad-width {
    .q-size {
      font-size: 0.9vw;
      padding: 0;
    }
  }

  @include pad-large-width {
    height: auto;
    flex-direction: column;
    position: relative;

    .footer_left {
      margin: 0 0;
      width: 100%;
    }
  }

  .logo-list-wrapper,
  .text-content-wrapper {
    width: 90%;
    max-width: 87.5rem;
  }

  .logo-list-wrapper {
    .provider-item {
      @include iphone-width {
        flex: 0 0 50%;
      }
    }
  }

  .text-content-wrapper {
    .content {
      width: 100%;
    }
  }
}
</style>
