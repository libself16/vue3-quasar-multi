<template>
  <q-card-section class="vip-layout">
    <div class="icon-container">
      <img :src="vipBadge('10')" alt="" />
      <div>
        <p class="vip-title">{{ $t("vip.title") }}</p>
        <p class="vip-level">{{ $t("vip.normal") }}</p>
      </div>
    </div>
    <div class="value-container">
      <div>
        <div class="flex justify-between text-xs mb-2">
          <div>{{ $t("member.withdrawal.deposit") }}</div>
          <div>$ 60/ $ 100</div>
        </div>
        <div>
          <q-linear-progress size=".75rem" :value="0.35" color="yellow" track-color="progress" rounded>
            <div class="absolute-full flex flex-center">
              <q-badge color="transparent" text-color="white" label="35%" class="progress-text" />
            </div>
          </q-linear-progress>
        </div>
      </div>
      <div>
        <div class="flex justify-between text-xs mb-2">
          <div>{{ $t("member.withdrawal.deposit") }}</div>
          <div>$ 60/ $ 100</div>
        </div>
        <div>
          <q-linear-progress size=".75rem" :value="0.35" color="yellow" track-color="progress" rounded>
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
import { useSiteImg } from "app/template/set33/hooks/useSiteImg"

const { vipBadge } = useSiteImg()
</script>

<style lang="sass" scoped>
@import 'src/common/css/_variable.sass'
@import 'app/template/set33/assets/css/progress.sass'

.vip-layout
  @apply flex justify-between items-center
  border-radius: .625rem
  padding: 0 1.8125rem
  background: #031729
  +pad-width
    @apply flex-wrap
    border-bottom: 1px solid #0f9fdc
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
      color: #008ff7
      font-size: .75rem
      font-weight: 700
    .vip-level
      color: #ffe300
      font-size: .875rem
      font-weight: 700
  .value-container
    @apply flex flex-col gap-5
    width: 51%
    +pad-width
      width: 100%
      padding: .625rem .9375rem 1.25rem
    .progress-text
      font-size: .5625rem
</style>
