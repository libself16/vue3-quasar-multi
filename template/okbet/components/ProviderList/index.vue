<template>
  <q-tabs
    v-model="activeTab"
    :class="cx('provider-list-container', 'w-full', SCROLLBAR_HIDDEN)"
    dense
    :mobile-arrows="false"
    :outside-arrows="false"
    align="left"
    :shrink="false"
    no-caps
    indicator-color="transparent"
  >
    <q-tab
      v-for="(product, key) in productState.list"
      :key="key"
      :name="product.product_code"
      :class="
        cx(
          'provider-unit',
          'flex-shrink-0',
          'w-[10.5rem] phone:w-[7.375rem] h-[4.375rem] phone:h-[3.375rem]',
          'overflow-hidden',
          'rounded-xl',
          'px-3.5 py-3'
        )
      "
      @click="emit('handleTabClick', product.integration_id, product.product_code)"
    >
      <img
        :src="getProductTabImage({ ...product, siteKey: 'okbet' })"
        :class="cx('provider-img', 'w-full')"
        :alt="product.product_name"
        @error="setDefaultProductTabImg"
      />
    </q-tab>
  </q-tabs>
</template>

<script lang="ts" setup>
import { ref } from "vue"
import { injectStrict } from "src/common/utils/injectTyped"
import { EventBusKey } from "src/symbols"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import { cx } from "src/common/utils/cx"
import { FLEX_CENTER, FLEX_ITEMS_CENTER, SCROLLBAR_HIDDEN } from "src/common/utils/constants/styles"
import { useGame } from "src/common/composables/useGame"
import { useSiteImg } from "app/template/okbet/hooks/useSiteImg"

const { productState, getProductTabImage } = useGame()

const { setDefaultProductTabImg } = useSiteImg()

const emit = defineEmits(["handleTabClick"])

const { isDown } = useMediaQuery()

const eventbus = injectStrict(EventBusKey)

const activeIndex = ref(0)
const activeTab = ref("")
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/okbet/assets/css/_variable.sass";

.provider-list-container {
  .provider-unit {
    background-color: $white-color;
  }

  :deep(.q-tabs__content) {
    @apply gap-[1.125rem] phone:gap-[0.625rem];
  }

  :deep(.q-tab__content) {
    @apply min-w-[initial] justify-start h-auto p-0;
  }
}
</style>
