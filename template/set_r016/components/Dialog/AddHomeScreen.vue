<template>
  <q-dialog
    v-model="isShow"
    persistent
    :maximized="true"
    transition-show="slide-up"
    transition-hide="slide-down"
    class="z-[9000]"
  >
    <div class="home-screen-area">
      <div class="title">
        <div>{{ $t("common.btn.addHomeScreen") }}</div>
        <q-btn class="close" icon="close" flat dense @click="closeDialog" />
      </div>
      <img v-if="iOSPlatform" :src="commonResult('home-screen/ios-home-screem.png')" />
      <div v-else class="flex items-center justify-center flex-col">
        <img :src="commonResult('home-screen/android-home-screem.png')" />
        <img :src="commonResult('home-screen/android-home-screem-2.png')" />
      </div>
    </div>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from "vue"
import { useCommonImg } from "src/common/hooks/useCommonImg"
import { usePlatform } from "src/common/hooks/usePlatform"

const { commonResult, commonSvgIcon } = useCommonImg()
const { iOSPlatform } = usePlatform()

const props = defineProps({ modelValue: Boolean })
const emit = defineEmits(["update:modelValue"])

const isShow = ref(false)

const closeDialog = () => {
  isShow.value = false
  emit("update:modelValue", false)
}

watch(
  () => props.modelValue,
  (newValue) => {
    isShow.value = newValue
  }
)

watch(isShow, (newValue) => {
  emit("update:modelValue", newValue)
})
</script>

<style lang="scss" scoped>
@import "app/template/set_r016/assets/css/_variable.scss";

.home-screen-area {
  background: $neutral03;
  width: auto;
  height: auto;
  padding: 1.25rem;
  box-shadow: $shadow03;
  border-radius: 0.625rem !important;

  .title {
    @include fontStyle(1.5rem);
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: $primary04;
    margin-bottom: 1.875rem;

    .close {
      font-size: 1rem;
    }
  }
}
</style>
