<template>
  <section class="contact-us-wrapper">
    <div class="page-title">
      {{ $t("common.btn.customerService") }}
    </div>
    <p class="contact-description">{{ $t("common.tip.contactTip2") }}</p>
    <ul v-if="cmsListState[CMS_TYPE.Enums.CONTACT_US].length > 0" class="contact-list-wrapper">
      <li
        v-for="(cmsItem, index) in cmsListState[CMS_TYPE.Enums.CONTACT_US]"
        :key="index"
        class="contact-item"
        @click="handleEntranceClick({ entrance: cmsItem.Entrance[0] })"
      >
        <q-img :src="cmsItem.Setting.icon_lang[nowLang as LANGUAGE_TYPE.Enums]" class="item-icon" fit="contain" />
        <p class="item-title">{{ cmsItem.Setting.lang[nowLang as LANGUAGE_TYPE.Enums] }}</p>
        <span class="item-text">{{ cmsItem.Setting.contact_lang[nowLang as LANGUAGE_TYPE.Enums] }}</span>
      </li>
    </ul>
  </section>
</template>

<script lang="ts" setup>
import { onMounted } from "vue"
import { useCms } from "src/common/composables/useCms"
import { useLanguage } from "src/common/composables/useLanguage"
import { useEntranceHandler } from "app/template/set_r022/composables/useCms"
import { CMS_TYPE } from "src/common/utils/constants"
import { LANGUAGE_TYPE } from "src/common/utils/constants"

const { cmsListState, handleCmsList } = useCms()
const { nowLang } = useLanguage()
const { handleEntranceClick } = useEntranceHandler()

onMounted(async () => {
  await handleCmsList(CMS_TYPE.Enums.CONTACT_US)
})
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_r022/assets/css/_variable.scss";

.contact-us-wrapper {
  @apply w-full mx-auto flex flex-col gap-[1.25rem];
  @apply max-w-[87.5rem] py-[1.875rem] px-[.625rem];

  @include pad-large-width {
    @apply py-4 gap-[.625rem];
  }

  .page-title {
    @apply text-2xl font-bold;
    color: var(--secondary-01);
  }
}

.contact-description {
  @apply font-medium text-base mb-12;
  color: var(--primary-02);
}

.contact-list-wrapper {
  @apply grid grid-cols-4 gap-2;

  @include phone-width {
    @apply grid-cols-3 gap-4;
  }

  @include iphone-width {
    @apply grid-cols-2 gap-4;
  }

  .contact-item {
    @apply relative w-full h-[9rem] max-w-[15rem] max-h-[12.8125rem] rounded-[.75rem];
    background: var(--neutral-02);

    @include phone-width {
      @apply h-[10rem];
    }

    .item-image {
      @apply w-full h-full;
    }

    .item-icon {
      @apply absolute left-1/2 w-16 h-16;
      top: -1rem;
      transform: translateX(-50%);
    }

    .item-title,
    .item-text {
      @apply w-full text-center absolute left-1/2;
      transform: translateX(-50%);
      color: var(--secondary-01);
    }

    .item-title {
      @apply font-extrabold text-[1.375rem] uppercase mb-[.3125rem];
      top: 3.5rem;
    }

    .item-text {
      @apply text-sm font-semibold;
      top: 6rem;

      @include phone-width {
        @apply text-[.75rem];
      }
    }
  }
}
</style>
