<template>
  <div />
</template>

<script setup lang="ts">
import { onMounted } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useBank } from "src/common/composables/useBank"

const route = useRoute()
const router = useRouter()
const { handlerSendMayaToken } = useBank()

onMounted(async () => {
  // 從router的query取得code
  const code = route.query?.code
  if (code) {
    const mayaData = JSON.parse(localStorage.getItem("mayaData") || "{}")
    const params = {
      payment_gateway_name: mayaData.payment_gateway_name,
      code: code as string
    }

    // 傳送code給後端
    const result = await handlerSendMayaToken(params)
    if (result) {
      // 成功後跳轉至訂單頁面
      router.push({ name: "orders", query: { search_type: 2 } })
    } else {
      // 失敗後跳轉至出款頁面
      router.push({ name: "MemberWithdrawal" })
    }
  }
})
</script>
