<template>
  <div class="container common-page-wrapper">
    <div class="page-title">
      {{ $t("home.infoCenter") }}
    </div>
    <div class="about-sec-in">
      <div class="about-left">
        <div class="info-menu-wrapper">
          <a
            v-for="menu in webInformationMenuList"
            :key="menu.id"
            :class="{ active: menu.id === currentTab }"
            @click="changeTab(menu.id)"
          >
            {{ menu.title }}
          </a>
        </div>
      </div>
      <div class="about-right">
        <section class="info-wrapper">
          <h3>{{ webInformationTitle }}</h3>
          <div class="detail" v-html="webInformationContent"></div>
        </section>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useCms } from "src/common/composables/useCms"
import { CMS_TYPE } from "src/common/utils/constants"

const router = useRouter()
const route = useRoute()
const currentTab = ref(0)
const isInternalRouteChange = ref(false)
const { handleCmsList, webInformationData, webInformationMenuList, webInformationTitle, webInformationContent } =
  useCms()

const changeTab = (id: number) => {
  currentTab.value = id
  isInternalRouteChange.value = true
  router.push({ name: "WebInformationCms", params: { id: id.toString() } })
}

watch(
  () => route.params.id,
  () => {
    if (isInternalRouteChange.value) {
      isInternalRouteChange.value = false
      return
    }
    // 從 url params 取得 id
    const id = route.params.id ? parseInt(route.params.id.toString()) : webInformationMenuList.value[0].id
    if (id) {
      currentTab.value = id
    }
  }
)

onMounted(async () => {
  await handleCmsList(CMS_TYPE.Enums.WEBSITE_INFORMATION)

  const id = route.params.id ? parseInt(route.params.id.toString()) : webInformationMenuList.value[0].id

  if (id) {
    changeTab(id)
  }
})
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_DBO88/assets/css/common.scss";
@import "app/template/set_DBO88/assets/css/text.scss";

.page-title {
  @include pad-large-width {
    width: 90%;
    margin: 0 auto;
  }
}

.container {
  .about-sec-in {
    @apply flex w-[90%] pt-[1.25rem];
    @include pad-large-width {
      justify-content: center;
      flex-direction: column;
      margin: 0 auto;
    }
    .about-left {
      flex: 0 0 auto;
      width: 14%;
      .info-menu-wrapper {
        overflow: hidden;
        line-height: 1.2;
        padding-left: 0;
        margin-bottom: 0;
        @include pad-large-width {
          background: transparent;
        }
        a {
          @apply rounded-[.3125rem] mb-[.5rem] cursor-pointer;
          background: $deep-slate-bg;
          color: $text-white;
          text-shadow: 0.0625rem 0.0625rem 0.0625rem #000;
          display: block;
          text-transform: uppercase;
          font-size: 0.8rem;
          font-weight: 600;
          padding: 0.75rem 0.9375rem;
          @include pad-large-width {
            height: 50px;
            align-items: center;
            display: flex;
            border-radius: 5px;
            padding: 10px 15px;
            margin: 0.5rem 0rem;
            margin-right: 1rem;
            text-transform: uppercase;
            font-size: 13px;
            font-weight: 700;
          }
        }
        .active {
          background: $primary-color;
        }
      }
      @include pad-large-width {
        width: 100%;
        max-width: 100%;
        .info-menu-wrapper {
          display: flex;
          width: 100%;
          flex-wrap: wrap;
          flex-direction: row;
          justify-content: flex-start;
          margin-bottom: 0.9375rem;
          border-radius: 0;
        }
      }
    }
    .about-right {
      flex: 0 0 auto;
      width: 79%;
      @include pad-large-width {
        width: 100%;
        max-width: 100%;
      }
      .info-wrapper {
        margin-left: 1vw;
        padding: 1.5625rem 1.875rem;
        margin-bottom: 1.875rem;
        min-height: 31.25rem;
        font-size: 0.9375rem;
        background: $dark-navy-bg;
        border-radius: 10px;
        min-height: 700px;
        @include pad-large-width {
          margin-left: 0;
        }
        h3 {
          color: $text-sky-blue;
          text-transform: uppercase;
          position: relative;
          font-size: 2.5rem;
          font-weight: 700;
        }
        .detail {
          font-size: 1rem;
          color: $text-white;
        }
      }
    }
  }
}
</style>
