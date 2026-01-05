<template>
  <div class="cover" v-if="props.modelValue">
    <div class="modal menu">
      <img @click="emit('update:modelValue', false)" class="close" :src="cancelImg" />
      <div class="modal-menu">
        <ul class="tab-list">
          <li
            class="game-box sgfilter"
            v-for="(item, key) in props.list"
            :key="key"
            @click="selectProduct(item.product_code)"
          >
            <img :src="getTabProductImages(item.product_code)" @error="setDefaultProductTabImg" />
          </li>
        </ul>
        <slot name="copyright"></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useSiteImg } from "app/template/epicwin/hooks/useSiteImg"
import { useCommonImg } from "src/common/hooks/useCommonImg"
const props = defineProps(["modelValue", "list"])
const emit = defineEmits(["update:modelValue", "changeProduct"])

const { cancelImg, setDefaultProductTabImg } = useSiteImg()
const { getTabProductImages } = useCommonImg()

const selectProduct = (code: number) => {
  emit("changeProduct", code)
  emit("update:modelValue", false)
}
</script>

<style lang="sass" scoped>
@import "../../assets/css/modal.sass"
</style>
