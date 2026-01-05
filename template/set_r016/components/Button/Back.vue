<template>
  <q-btn class="btn-back hide-hover" @click="router.back()">
    <q-img :src="svgIcon('back')" loading="lazy"></q-img>
    <span> {{ $t("common.btn.back2") }} </span>
  </q-btn>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router"
import { useSiteImg } from "app/template/set_r016/hooks/useSiteImg"

const router = useRouter()
const { svgIcon } = useSiteImg()
</script>

<style scoped lang="scss">
@import "app/template/set_r016/assets/css/_variable.scss";
@import "app/template/set_r016/assets/css/button.scss";

.btn-back {
  padding: 0.625rem 1.25rem;
  box-shadow: $shadow01;
  background-color: $neutral01;
  border-radius: 0.625rem;

  :deep(.q-btn__content) {
    flex-wrap: nowrap;
    gap: 0.375rem;

    .q-img {
      width: 1.25rem;
      height: 1.25rem;
    }

    span {
      @include fontStyle();
      color: $primary04;
      text-transform: capitalize;
    }
  }
}
</style>
