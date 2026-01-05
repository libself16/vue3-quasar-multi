<template>
  <q-dialog
    v-model="isShow"
    transition-show="fade"
    transition-hide="fade"
    :transition-duration="isMobile ? '0' : '300'"
    :class="dialogClass"
    :maximized="maximizedMode"
  >
    <q-card :class="['full-screen-container', variant && `variant-${variant}`, qCardClass]">
      <q-card-section class="title-container">
        <div class="left">
          <slot v-if="!!slots['left']" name="left"></slot>
          <q-btn
            v-else
            icon="arrow_back_ios"
            class="btn-back hide-hover"
            size="md"
            flat
            round
            dense
            @click="handleBackBtn"
          />
        </div>
        <div class="middle">
          <slot v-if="!!slots['middle']" name="middle"></slot>
          <h2 v-else class="title">{{ $t(props.titleI18n) }}</h2>
        </div>
        <div class="right">
          <slot v-if="!!slots['right']" name="right"></slot>
          <div v-else class="invisible w-8"></div>
        </div>
      </q-card-section>
      <q-card-section class="p-0 h-full">
        <slot></slot>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, computed, useSlots, watchEffect, toRef } from "vue"
import { useQuasar } from "quasar"
import { useRouter } from "vue-router"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"

const props = defineProps({
  titleI18n: {
    type: [String],
    required: false,
    default: () => ""
  },
  variant: {
    type: [String],
    required: false,
    validator: (value: string) => ["purple"].includes(value)
  },
  dialogClass: {
    type: [String],
    required: false,
    default: () => ""
  },
  qCardClass: {
    type: [String],
    required: false,
    default: () => ""
  }
})

const $q = useQuasar()
const slots = useSlots()
const router = useRouter()
const { isLargeTablet } = useMediaQuery()

const { isDown } = useMediaQuery()
const isMobile = toRef(isDown, "phone")

const isShow = ref(true)

const maximizedMode = computed(() => {
  if (props.variant === "setR022") {
    return isLargeTablet.value
  }

  return isMobile.value
})

function handleBackBtn() {
  if (window.history.length > 1) {
    router.back()
    return
  }
  router.push("/")
}

// 因為replace會自動關掉dialog，強制永遠開啟
watchEffect(() => {
  if (!isShow.value) {
    isShow.value = true
  }
})
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";

.full-screen-container {
  background-color: rgb(240, 245, 250);
  .title-container {
    @apply w-full flex justify-between items-center shrink-0 sticky left-0 top-0 py-0 px-6;
    background-color: rgb(255, 255, 255);
    border-bottom: 1px solid rgb(237, 237, 237);
    height: 5.625rem;
    z-index: 10;
    .title {
      color: rgb(65, 70, 85);
      font-size: 2.25rem;
      text-transform: capitalize;
      font-family: Helvetica;
    }
    .btn-back {
      :deep(.q-icon) {
        font-size: 3rem;
        color: rgb(65, 70, 85);
      }
    }

    @include iphone-width {
      @apply px-3;
      height: 2.875rem;
      .title {
        font-size: 1.125rem;
      }
      .btn-back {
        :deep(.q-icon) {
          font-size: 1.25rem;
        }
      }
    }
  }
}
.variant-purple {
  background-color: #140433;
  color: #f2f2f2;
  .title-container {
    background-color: #2e1557;
    border-bottom: none;
  }
  .title {
    color: #f2f2f2 !important;
  }
  .btn-back :deep(.q-icon) {
    color: #f2f2f2 !important;
  }
}

.variant-purple-dark {
  background-color: #121212;
  color: #f2f2f2;
  .title-container {
    background-color: #2e1557;
    border-bottom: none;
  }
  .title {
    color: #f2f2f2 !important;
  }
  .btn-back :deep(.q-icon) {
    color: #f2f2f2 !important;
  }
}

.variant-green {
  background-color: #fff;
  color: #000;
  .title-container {
    background-color: #457950;
    border-bottom: none;
  }
  .title {
    color: #f2f2f2 !important;
  }
  .btn-back :deep(.q-icon) {
    color: #fff !important;
  }
}

.variant-green-member {
  background-color: #f3f8f4;
  color: #000;
  .title-container {
    background-color: #457950;
    border-bottom: none;
  }
  .title {
    color: #f2f2f2 !important;
  }
  .btn-back :deep(.q-icon) {
    color: #fff !important;
  }
}

.variant-blue {
  background-color: #050537;
  color: #fff;
  .title-container {
    background-color: #1a2b8a;
    border-bottom: none;
  }
  .title {
    color: #fff !important;
  }
  .btn-back :deep(.q-icon) {
    color: #fff !important;
  }
}

.variant-blackGold {
  background-color: #0a0a0a;
  color: #ffffffe5;
  .title-container {
    background-color: #161616;
    border-bottom: none;
  }
  .title {
    color: #ffffffe5 !important;
  }
  .btn-back :deep(.q-icon) {
    color: #ffffffe5 !important;
  }
}

.variant-red {
  background-color: #980300;
  color: #ffffffe5;
  .title-container {
    background-color: #700e0e;
    border-bottom: none;
  }
  .title {
    color: #f2f2f2 !important;
  }
  .btn-back :deep(.q-icon) {
    color: #fff4f4 !important;
  }
}

.variant-redBlack {
  background: #0d0000;
  color: #fff;
  .title-container {
    background-color: #700e0e;
    border-bottom: none;
  }
  .title {
    color: #fff !important;
  }
  .btn-back :deep(.q-icon) {
    color: #fff !important;
  }
}

.variant-setR022 {
  background-color: var(--bg-headerbottom) !important;

  .title-container {
    height: 2.625rem !important;
    background-color: var(--bg-headerbottom) !important;
    border-color: var(--primary-07) !important;

    .title {
      height: 100% !important;
      line-height: normal !important;
      color: var(--secondary-01) !important;
      font-size: 1.125rem !important;
    }

    .btn-back :deep(.q-icon) {
      color: var(--secondary-01) !important;
      font-size: 1.125rem !important;
    }
  }
}

.variant-blueOrange {
  background: #261d20;
  color: #fff;
  .title-container {
    background-color: #0a3372;
    border-bottom: none;
  }
  .title {
    color: #fff !important;
  }
  .btn-back :deep(.q-icon) {
    color: #fff !important;
  }
}

.variant-setR025 {
  background-color: #031006;
  color: #fff;
  .title-container {
    background-color: #1a3c2e;
    border-bottom: none;
  }
  .title {
    color: #fff !important;
  }
  .btn-back :deep(.q-icon) {
    color: #fff !important;
  }
}
</style>
