<template>
  <q-card-section class="vip-layout">
    <div class="icon-container">
      <!-- <img :src="vipBadge('10')" alt="" /> -->
      <div>
        <p class="vip-title">{{ $t("vip.title") }}</p>
        <p class="vip-level">{{ $t("vip.normal") }}</p>
      </div>
    </div>
    <div class="value-container">
      <div>
        <div class="flex justify-between text-xs mb-2">
          <div>{{ $t("menu.credit") }}</div>
          <div>$ 60/ $ 100</div>
        </div>
        <div>
          <q-linear-progress size=".75rem" :value="0.35" color="#E2B854" track-color="progress" rounded>
            <div class="absolute-full flex flex-center">
              <q-badge color="transparent" text-color="white" label="35%" class="progress-text" />
            </div>
          </q-linear-progress>
        </div>
      </div>
    </div>
  </q-card-section>
</template>

<script setup lang="ts">
import { useSiteImg } from "app/template/set_sjpn2/hooks/useSiteImg"
</script>

<style lang="sass" scoped>
@import 'src/common/css/_variable.sass'
@import 'app/template/set_sjpn2/assets/css/progress.sass'

.vip-layout
  @apply flex justify-between items-center
  border-radius: .625rem !important
  padding: 0 1.8125rem
  background: #000
  +pad-width
    @apply flex-wrap
    border-bottom: 1px solid #7777
    border-radius:0 !important
  .icon-container
    @apply w-1/2 flex items-end gap-5
    padding: .625rem 0
    +pad-width
      @apply w-full justify-center
    img
      height: 5.625rem
      width: auto
    .vip-title
      color: #fff
      font-size: .75rem
      font-weight: 700
    .vip-level
      color: #E2B854
      font-size: .875rem
      font-weight: 700
  .value-container
    @apply flex flex-col gap-5 mt-8
    width: 51%
    +pad-width
      width: 100%
      padding: .625rem .9375rem 1.25rem
    .progress-text
      font-size: .5625rem
    :deep(.q-linear-progress__model--determinate)
      background: #E2B854
</style>
