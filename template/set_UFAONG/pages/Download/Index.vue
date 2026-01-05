<template>
  <div class="download-layout">
    <div class="flex flex-col items-center">
      <img :src="downloadPageImg" alt="download-page-image" />
      <div class="download-content">
        <div class="download-text py-[10px]">
          <p>{{ $t("app.appDownloadTitle") }}</p>
          <p>{{ $t("app.appDownloadDetail") }}</p>
        </div>
        <div class="flex gap-5">
          <div v-for="app in appList" :key="app.name" class="download-app">
            <img :src="app.title" :alt="app.name" />
            <div class="btn-download">
              <i class="fab" :class="app.icon"></i>
              <span>{{ app.name }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue"
import { useSiteImg } from "app/template/set_UFAONG/hooks/useSiteImg"

const { downloadPageImg, downloadPageAndroidQRImg, downloadPageAppleQRImg } = useSiteImg()

const appList = ref([
  {
    title: downloadPageAndroidQRImg,
    name: "Android",
    icon: "fa-android"
  },
  {
    title: downloadPageAppleQRImg,
    name: "Apple iOS",
    icon: "fa-apple"
  }
])
</script>

<style lang="scss" scoped>
@import "../../assets/css/variable.scss";

.download-layout {
  @apply flex flex-col pt-[30px] px-[10px] pb-20;
}

.download-content {
  @apply flex flex-col w-full h-full items-center p-[10px] pb-[20px];
  background: #2b2b2b;
  border-radius: 0.625rem;
  color: $primary;
}

.download-app {
  @apply flex flex-col items-center;
  img {
    @apply p-[10px] h-[100px] w-[100px];
    box-shadow: $primary 0 0.0625rem 0.375rem -0.0625rem;
    border-radius: 0.625rem;
    background: #fff;
  }
}

.btn-download {
  @apply flex justify-center items-center w-[110px] h-[40px] cursor-pointer mt-[30px];
  padding: 0.3125rem 0.625rem;
  border-radius: 1.25rem;
  color: #000;
  background: $gradient-to-bottom;

  i {
    margin-right: 0.25rem;
    font-size: 1.5rem;
  }
}
</style>
