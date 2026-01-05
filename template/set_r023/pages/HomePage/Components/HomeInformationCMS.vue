<template>
  <div v-if="informationList.length" class="information-wrapper">
    <div :class="['information-container', layoutClass]">
      <div class="container-left-item">
        <q-img v-if="firstImage" :src="firstImage" class="left-item-image" />
      </div>
      <div v-if="informationList.length > 1" class="container-right-item">
        <q-img v-if="secondImage" :src="secondImage" class="right-item-image" />
        <q-img v-if="thirdImage" :src="thirdImage" class="right-item-image" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted } from "vue"
import { CMS_TYPE, LANGUAGE_TYPE } from "src/common/utils/constants"
import { useCms } from "src/common/composables/useCms"
import { useLanguage } from "src/common/composables/useLanguage"
import { CmsItem } from "src/api/response.type"

const { cmsListState, handleCmsList, shouldDisplayDevice } = useCms()
const { nowLang } = useLanguage()

const informationList = computed(() =>
  (cmsListState.value[CMS_TYPE.Enums.HOME_INFORMATION_IMAGE] ?? []).filter(shouldDisplayDevice.value)
)

const layoutClass = computed(() => {
  const count = informationList.value.length
  if (count === 1) return "layout-single"
  if (count === 2) return "layout-double"
  return "layout-triple"
})

const getImageUrl = (item: CmsItem | undefined) => {
  if (!item) return null
  return item.Setting.img_lang[nowLang.value as LANGUAGE_TYPE.Enums]
}

const firstImage = computed(() => getImageUrl(informationList.value[0]))
const secondImage = computed(() => getImageUrl(informationList.value[1]))
const thirdImage = computed(() => getImageUrl(informationList.value[2]))

onMounted(async () => {
  await handleCmsList(CMS_TYPE.Enums.HOME_INFORMATION_IMAGE)
})
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";

.information-container {
  @apply flex gap-4;

  @include pad-large-width {
    @apply flex-col;
  }
}

.left-item-image {
  @apply h-full w-full max-h-[20rem] rounded-[.75rem];
  @include pad-large-width {
    @apply max-h-[10.625rem];
  }
}

.right-item-image {
  @apply w-full max-h-[20rem] rounded-[.75rem];
  @include pad-large-width {
    @apply max-h-[10.625rem];
  }
}

.layout-single {
  .container-left-item {
    @apply w-full;
  }
}

.layout-double,
.layout-triple {
  .container-left-item {
    @apply flex-1;
  }
  .container-right-item {
    @apply flex w-[21.125rem] flex-shrink-0;

    @include pad-large-width {
      @apply w-full flex-shrink;
    }
  }
}

.layout-double {
  .right-item-image {
    @apply h-full max-h-[20rem];

    @include pad-large-width {
      @apply h-auto;
    }
  }
}

.layout-triple {
  .container-right-item {
    @apply flex-col gap-4;
  }
  .right-item-image {
    @apply flex-1;

    @include pad-large-width {
      @apply flex-none;
    }
  }
}
</style>
