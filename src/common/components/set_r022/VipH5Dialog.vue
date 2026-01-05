<template>
  <q-dialog
    v-model="isShow"
    transition-show="fade"
    transition-hide="fade"
    :transition-duration="$q.platform.is.mobile ? '0' : '300'"
    :maximized="$q.platform.is.mobile"
  >
    <q-card :class="['full-screen-container', variant && `variant-${variant}`]">
      <q-card-section class="h5-vip-header">
        <div class="title-container">
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
        </div>
        <slot name="header"></slot>
      </q-card-section>
      <slot name="body"></slot>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, useSlots, watchEffect } from "vue"
import { useRouter } from "vue-router"

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
  }
})
const slots: Record<string, any> = useSlots()
const router = useRouter()

const isShow = ref(true)

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
  .h5-vip-header {
    @apply p-0  w-full;

    .title-container {
      @apply w-full flex justify-between items-center shrink-0 sticky left-0 top-0 py-0 px-6;
      height: 5.625rem;
      z-index: 10;
      background: var(--bg-headerbottom);

      .title {
        color: var(--secondary-01);
        font-size: 2.25rem;
        text-transform: capitalize;
        font-family: Helvetica;
      }
      .btn-back {
        :deep(.q-icon) {
          font-size: 3rem;
          color: var(--secondary-01);
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
    .user-info-content {
      @apply flex items-center;
      padding: 3rem 3.5rem;
      .q-avatar {
        width: 6.875rem;
        height: 6.875rem;
      }
      .user-info {
        @apply ml-8;
        h3 {
          font-size: 2.5rem;
          line-height: 3.5rem;
          color: rgb(255, 230, 179);
          padding-bottom: 0.625rem;
          display: inline;
        }

        .user-info-row {
          @apply flex items-center;
          p {
            font-size: 1.5rem;
            line-height: 2rem;
            color: rgb(255, 255, 255);
          }
        }
      }
      @include iphone-width {
        padding: 1.5rem 1.75rem;
        .q-avatar {
          width: 3.4375rem;
          height: 3.4375rem;
        }
        .user-info {
          @apply ml-4;
          h3 {
            font-size: 1.25rem;
            line-height: 1.75rem;
            padding-bottom: 0.3125rem;
          }

          .user-info-row {
            p {
              font-size: 0.75rem;
              line-height: 1rem;
            }
          }
        }
      }
    }
  }
}

.variant-purple {
  background-color: #1e1b39;
  .user-info-content {
    .user-info {
      h3 {
        color: #f2f2f2 !important;
      }
    }
  }
}

.variant-green {
  background-color: #224f3f;
  .user-info-content {
    .user-info {
      h3 {
        color: #fafafa !important;
      }
    }
  }
}

.variant-red {
  background-color: #980300;
  .user-info-content {
    .user-info {
      h3 {
        color: #fafafa !important;
      }
    }
  }
}

.variant-redBlack {
  background-color: #980300;
  .user-info-content {
    .user-info {
      h3 {
        color: #fafafa !important;
      }
    }
  }
}
</style>
