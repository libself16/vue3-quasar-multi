<template>
  <q-dialog
    v-model="show"
    transition-show="fade"
    transition-hide="fade"
    :transition-duration="$q.platform.is.mobile ? '0' : '300'"
    :maximized="$q.platform.is.mobile"
    :no-backdrop-dismiss="true"
  >
    <q-card class="bg-transparent shadow-none flex justify-center items-center w-full relative !max-w-[800px]">
      <div class="first-deposit-card-container">
        <q-btn class="first-deposit-close-btn" icon="close" flat round dense v-close-popup @click="closeDialog" />
        <!-- 使用原生img标签作为备选方案 -->
        <q-img
          :src="firstDepositLayout"
          loading="lazy"
          fit="contain"
          class="first-deposit-image"
          spinner-color="primary"
          spinner-size="50px"
        />
        <a
          href="javascript:void(0)"
          class="first-deposit-btn"
          @click="
            openGame(
              firstDepositPromotion?.integration_id,
              firstDepositPromotion?.product_code,
              firstDepositPromotion?.game_code,
              firstDepositPromotion?.game_type_id,
              true,
              firstDepositPromotion?.currency_code
            )
          "
        >
          <p>{{ `恭喜获得首充${firstDepositPromotion?.rounds}次免费旋转` }}</p>
          <p>{{ "点击即可进入领取" }}</p>
        </a>
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue"
import { useQuasar } from "quasar"
import { useEnvInfoStore } from "src/stores/envStore"
import { useSiteImg } from "app/template/set_r016/hooks/useSiteImg"
import { injectStrict } from "src/common/utils/injectTyped"
import { EventBusKey } from "src/symbols"
import { useGame } from "src/common/composables/useGame"
import * as Response from "src/api/response.type"

const eventbus = injectStrict(EventBusKey)
const { envInfo } = useEnvInfoStore()
const { openGame } = useGame()
const { firstDepositLayout } = useSiteImg()
const $q = useQuasar()

const show = ref(false)
const firstDepositPromotion = ref<Response.FirstDepositPromotion | null>(null)

// 響應式圖片尺寸計算
// const imageStyle = computed(() => {
//   if ($q.platform.is.mobile) {
//     return {
//       width: "280px",
//       height: "auto",
//       maxWidth: "90vw",
//       maxHeight: "60vh"
//     }
//   } else {
//     return {
//       width: "400px",
//       height: "auto",
//       maxWidth: "80vw",
//       maxHeight: "70vh"
//     }
//   }
// })

function closeDialog() {
  eventbus.emit("openFirstDepositDialog" as any, false)
}

// 判断是否显示首次存款弹窗
const shouldShowFirstDepositDialog = computed(() => {
  // 如果API还没有给first_deposit字段，默认返回true
  if (envInfo.first_deposit === undefined) {
    return true
  }
  // 如果有first_deposit字段且为false，则显示弹窗
  return !envInfo.first_deposit
})

onMounted(async () => {
  eventbus.on("openFirstDepositDialog" as any, (value: boolean, data: Response.FirstDepositPromotion) => {
    show.value = value
    firstDepositPromotion.value = data
  })

  // 页面加载后延迟一秒显示弹窗，确保用户体验
  // setTimeout(() => {
  //   console.log("=== 1秒后检查弹窗显示条件 ===")
  //   // 检查是否应该显示首次存款弹窗
  //   if (shouldShowFirstDepositDialog.value) show.value = true
  // }, 1000)
})
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";
@import "app/template/set_r016/assets/css/_variable.scss";

.first-deposit-card-container {
  @apply relative flex flex-col items-center justify-center p-4;
  width: 100%;
  min-width: 300px;
  max-width: 500px;

  .first-deposit-close-btn {
    @apply absolute top-2 right-2 z-10;
    color: $primary01;
    background: #ff3939;
    border-radius: 50%;
    width: 32px;
    height: 32px;
  }

  .first-deposit-btn {
    @apply absolute bottom-2 z-10 flex items-center justify-center;
    flex-direction: column;
    width: 80%;
    height: 150px;
    background-image: url("app/template/set_r016/assets/images/firstDepositBottom.png");
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-position: center;
    color: #7a3c0a;
    font-size: 16px;
    p {
      @apply text-center;
      width: 100%;
      font-weight: bold;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .first-deposit-image {
    border-radius: 8px;

    // q-img 的內部 img 元素樣式調整
    :deep(.q-img__image) {
      border-radius: 8px;
      object-fit: contain;
    }

    // loading 動畫樣式
    :deep(.q-img__loading) {
      color: rgba(255, 255, 255, 0.7);
    }
  }
}
</style>
