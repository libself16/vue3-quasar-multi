<template>
  <q-file ref="imgFileRef" v-model="imgFile" class="hidden" @update:model-value="handleImgUpload" />
  <div class="relative" @click="selectFile">
    <q-avatar>
      <img src="https://lh3.googleusercontent.com/a/ACg8ocL9c_-bvoT5-NIlfoLaxeK4E6ijpflYMIbvd3dagZwXG8trs5O3=s96-c" />
    </q-avatar>
    <span v-if="$q.platform.is.mobile" class="icon-edit"></span>
  </div>
</template>

<script setup lang="ts">
import { QFile, useQuasar } from "quasar"
import { ref, Ref } from "vue"

const $q = useQuasar()

const imgFileRef = ref() as Ref<QFile>
const imgFile = ref<File>()

const selectFile = () => {
  imgFileRef.value.pickFiles()
}

const handleImgUpload = () => {
  if (imgFile.value) {
    // TODO: call api
  }
}
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";
@import "app/template/okbet_blackGold/assets/css/member.scss";

.q-avatar {
  width: 1.5rem;
  height: 1.5rem;

  @include pad-width {
    width: 7.375rem;
    height: 7.375rem;
  }

  @include phone-width {
    width: 5.125rem;
    height: 5.125rem;
  }
}
.icon-edit {
  @include useProfileIcon;
  position: absolute;
  right: -10px;
  bottom: -15px;
  background-position-x: -313.108px;
  width: 3.4456rem;
  height: 3.4456rem;
  @include phone-width {
    width: 1.875rem;
    height: 1.875rem;
    background-position-x: -175.308px;
    right: -5px;
    bottom: -5px;
  }
}
</style>
