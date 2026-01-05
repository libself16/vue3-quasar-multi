<template>
  <div class="common-page-wrapper">
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
        <q-img
          :src="cmsItem.Setting.contact_img_lang[nowLang as LANGUAGE_TYPE.Enums]"
          class="item-image"
          fit="contain"
        />
        <q-img :src="cmsItem.Setting.icon_lang[nowLang as LANGUAGE_TYPE.Enums]" class="item-icon" fit="contain" />
        <p class="item-title">{{ cmsItem.Setting.lang[nowLang as LANGUAGE_TYPE.Enums] }}</p>
        <span class="item-text">{{ cmsItem.Setting.contact_lang[nowLang as LANGUAGE_TYPE.Enums] }}</span>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from "vue"
import { useCms } from "src/common/composables/useCms"
import { useLanguage } from "src/common/composables/useLanguage"
import { useEntranceHandler } from "app/template/set_DBO88/composables/useCms"
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
@import "app/template/set_DBO88/assets/css/_variable.scss";
@import "app/template/set_DBO88/assets/css/common.scss";
@import "app/template/set_DBO88/assets/css/text.scss";

.contact-description {
  @apply font-medium text-base text-[#55657e] mb-12;
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
    background: $dark-slate-bg;

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
      @apply text-white w-full text-center absolute left-1/2;
      transform: translateX(-50%);
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
