<template>
  <div class="player-number" :style="customStyle">
    <img :src="gamePlayerImg" class="player-img" />
    <span>
      {{ getRandom(1, 150) }}
    </span>
  </div>
</template>
<script lang="ts" setup>
import { computed } from "vue"
import { useCommon } from "src/common/hooks/useCommon"
import { useCommonImg } from "src/common/hooks/useCommonImg"

const { getRandom } = useCommon()
const { gamePlayerImg } = useCommonImg()
const props = defineProps({
  right: {
    type: String,
    default: ""
  }
})

const customStyle = computed(() => {
  return {
    right: props.right
  }
})
</script>
<style lang="scss" scoped>
@import "src/common/css/_variable.sass";

.player-number {
  position: absolute;
  right: 0.5rem;
  bottom: 0.25rem;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 0.625rem;
  padding: 0 0.25rem;
  height: 1.4375rem;
  color: #56ff80;
  font-size: 0.75rem;
  font-weight: 400;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 100%;

  @include phone-width {
    right: 0.25rem;
  }

  .player-img {
    margin-right: 0.0625rem;
    width: 0.625rem;
    height: 0.729375rem;
  }
}
</style>
