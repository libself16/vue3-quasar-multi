<template>
  <HeaderTitleBack
    v-if="isLargeTablet"
    variant="setR022"
    class="mobile-information-content"
    :titleI18n="webInformationTitle"
  >
    <div class="detail-conteiner">
      <div class="detail" v-html="webInformationContent" />
    </div>
    <FooterArea class="footer-area" />
  </HeaderTitleBack>

  <div v-else class="web-information-content">
    <div class="title">
      {{ webInformationTitle }}
    </div>
    <div class="detail" v-html="webInformationContent" />
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from "vue"
import { CMS_TYPE } from "src/common/utils/constants"
import { useCms } from "src/common/composables/useCms"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import FooterArea from "app/template/set_r022/components/Footer/Index.vue"
import HeaderTitleBack from "src/common/components/modal/HeaderTitleBack.vue"

const { isLargeTablet } = useMediaQuery()
const { handleCmsList, webInformationTitle, webInformationContent } = useCms()

onMounted(async () => {
  await handleCmsList(CMS_TYPE.Enums.WEBSITE_INFORMATION)
})
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_r022/assets/css/_variable.scss";
.mobile-information-content {
  background: var(--neutral-01);
}

.web-information-content {
  width: 100%;
  max-width: 84.5rem;
  min-height: 70vh;
  margin: 1.5rem auto 9.1875rem;
  border-radius: 0.75rem;
  background: var(--neutral-01);
  padding: 1.0625rem 0.875rem;
}

.title {
  border-bottom: 1px solid var(--neutral-03);
  color: var(--secondary-01);
  font-size: 0.875rem;
  padding-bottom: 1.0625rem;
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: flex-start;

  &::before {
    content: "";
    display: inline-block;
    width: 0.25rem;
    height: 1rem;
    background-color: var(--primary-01);
    border-radius: 0.25rem;
    margin-right: 0.5rem;
  }
}

.detail {
  width: 100%;
  font-size: 0.875rem;
  color: var(--primary-02);
  word-wrap: break-word;

  @include pad-large-width {
    padding: 1.1875rem 0.76875rem;
    background: var(--neutral-01);
    border-radius: 0.75rem;
    font-size: 0.8125rem;
  }
}

.detail-conteiner {
  background: var(--bg-main-bg);
  padding: 0.75rem;
}
</style>
