<template>
  <q-dialog
    v-model="dialog"
    v-bind="attrs"
    transition-show="fade"
    transition-hide="fade"
    class="roulette-game-dialog-wrapper"
    persistent
  >
    <q-card class="roulette-game-content">
      <q-btn class="close-btn" flat round v-close-popup>
        <q-img :src="rouletteGameImg('btn-close.svg')" loading="lazy"></q-img>
      </q-btn>
      <q-card-section class="roulette-game-main">
        <RouletteGameFortuneGodComp />
      </q-card-section>
      <q-card-section class="roulette-game-footer" @click="handleFooterClick">
        <q-img :src="rouletteGameImg('fortune-god/free-spin.png')" loading="lazy"></q-img>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { useAttrs, defineProps, ref, onMounted } from "vue"
import { useRouter } from "vue-router"
import { useAuth } from "src/common/hooks/useAuth"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useEventBus } from "src/common/hooks/useEventBus"
import { useReferralWheel } from "src/common/composables/useReferralWheel"
import { useCommonImg } from "src/common/hooks/useCommonImg"
import RouletteGameFortuneGodComp from "src/common/components/rouletteGame/FortuneGod.vue"

const props = defineProps<{
  footerClickRouteName?: string
}>()

const router = useRouter()
const { isLogin } = useAuth()
const { loginByUserClick } = useUserInfo()
const { eventOn } = useEventBus()
const { referralWheelState, handleReferralWheelMemberInfo, handleReferralWheelCurrent, syncReferralWheelSpinInfo } =
  useReferralWheel()

const { rouletteGameImg } = useCommonImg()
const attrs = useAttrs()
const dialog = ref(false)

const handleFooterClick = () => {
  if (isLogin.value) {
    const name = props.footerClickRouteName ? props.footerClickRouteName : "RouletteGame"
    router.push({ name })
    dialog.value = false
    return
  }
  router.push({ name: "Login" })
  dialog.value = false
}

const showDialog = async () => {
  await handleReferralWheelCurrent()
  await handleReferralWheelMemberInfo()
  syncReferralWheelSpinInfo()
  dialog.value = true
}

onMounted(async () => {
  if (referralWheelState.value.status && !isLogin.value) {
    dialog.value = true
    await handleReferralWheelCurrent()
  }

  if (referralWheelState.value.status && loginByUserClick.value) {
    showDialog()
  }

  eventOn("openRouletteGameDialog", async (show) => {
    if (show) {
      showDialog()
      return
    }

    dialog.value = show
  })
})
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";

.roulette-game-content {
  @apply flex flex-col justify-center items-center;
  position: relative;
  max-width: 900px;
  width: 100%;
  height: 686px;
  max-height: initial !important;
  overflow: hidden;
  border-radius: 0px;
  background-color: transparent;
  box-shadow: none;

  .close-btn {
    @apply absolute right-[1.875rem] top-[1.875rem] z-10 min-w-0 min-h-0;

    .q-img {
      width: 38px;
      height: 38px;
    }
  }

  .roulette-game-main {
    @apply p-0 relative;
    width: 375px;

    :deep(.roulette-wrapper) {
      border-radius: 0px;
      aspect-ratio: 375 / 505.22;

      // 背景
      &:after {
        border-radius: 0px;
        background-image: url("src/common/assets/images/roulette-game/fortune-god/bg-light.png");
        width: 700px;
        height: 700px;
        left: -160px;
        top: -4px;
      }

      .roulette-border {
        width: 291px;
        height: 300px;
        bottom: 20.47px;

        &:before {
          width: 100px;
          height: 70px;
          left: -40.5px;
          bottom: -5px;
        }
      }

      .roulette {
        width: 252px;
        height: 252px;
        bottom: 42.47px;
      }

      .dealer-wrapper {
        width: 290px;
        height: 268.27px;
        top: 0px;
      }

      .btn-spin {
        width: 73.26px;
        font-size: 40px;

        &.text-small {
          font-size: 30px;
        }

        &.text-mini {
          font-size: 16px;
        }
      }
    }
  }

  .roulette-game-footer {
    @apply flex justify-center items-center p-0 cursor-pointer;
    width: 375px;
    height: 153px;

    .q-img {
      width: 342px;
      height: 153px;
    }
  }
}
</style>

<style lang="scss">
@import "src/common/css/_variable.sass";
@import "app/template/set_r016/assets/css/_variable.scss";

.roulette-game-dialog-wrapper {
  .q-dialog__backdrop {
    background: $secondary01 !important;
  }
  .q-dialog__inner {
    @include phone-width {
      &.q-dialog__inner--minimized {
        padding: 0;
      }
    }
  }
}
</style>
