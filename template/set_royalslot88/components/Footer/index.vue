<template>
  <div class="t-footer">
    <div class="footer">
      <div class="desktop_footer">
        <div class="desktop_footer_wrap">
          <div class="desktop_footer_wrap_left">
            <a
              class="d_product_wrap"
              v-for="cmsItem in h5BottomMenuList.slice(0, 3)"
              :key="cmsItem.id"
              @click="
                handleEntranceClick({
                  entrance: cmsItem.Entrance[0],
                  opening_method: cmsItem.Setting.payload.opening_method
                })
              "
            >
              <img :src="cmsItem.Setting.icon_path" />
              <div class="footer_p_name">{{ cmsItem.Setting.lang[nowLang as LANGUAGE_TYPE.Enums] }}</div>
            </a>
          </div>
          <div class="desktop_footer_wrap_middle">
            <div @click="redirectToHome" class="d_product_wrap d_product_wrap_custom footer-logo">
              <img v-if="getWideLogo()" :src="getWideLogo()" class="footer-logo-image" />
            </div>
          </div>
          <div class="desktop_footer_wrap_right">
            <a
              class="d_product_wrap"
              v-for="cmsItem in h5BottomMenuList.slice(3, 6)"
              :key="cmsItem.id"
              @click="
                handleEntranceClick({
                  entrance: cmsItem.Entrance[0],
                  opening_method: cmsItem.Setting.payload.opening_method
                })
              "
            >
              <img :src="cmsItem.Setting.icon_path" />
              <div class="footer_p_name">{{ cmsItem.Setting.lang[nowLang as LANGUAGE_TYPE.Enums] }}</div>
            </a>
          </div>
        </div>
      </div>
      <div class="mobile_footer">
        <div class="mobile_footer_t_wrap">
          <div class="footermobile_wrap_middle">
            <div @click="redirectToHome" class="mobile-footer-logo">
              <img v-if="getWideLogo()" :src="getWideLogo()" class="footer-logo-image" />
            </div>
          </div>
        </div>
        <div class="header_mobile_menu">
          <template v-for="cmsItem in h5BottomMenuList.slice(0, 6)" :key="cmsItem.id">
            <a
              class="d_product_wrap"
              @click="
                handleEntranceClick({
                  entrance: cmsItem.Entrance[0],
                  opening_method: cmsItem.Setting.payload.opening_method
                })
              "
            >
              <img :src="cmsItem.Setting.icon_path" :alt="cmsItem.Setting.lang[nowLang as LANGUAGE_TYPE.Enums]" />
              <div class="footer_p_name">{{ cmsItem.Setting.lang[nowLang as LANGUAGE_TYPE.Enums] }}</div>
            </a>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from "vue"
import { useRouter } from "vue-router"
import { useLogo } from "src/common/composables/useLogo"
import { useEntranceHandler } from "app/template/set_royalslot88/composables/useCms"
import { useCms } from "src/common/composables/useCms"
import { CMS_TYPE, LANGUAGE_TYPE } from "src/common/utils/constants"
import { useLanguage } from "src/common/composables/useLanguage"

const router = useRouter()
const { getWideLogo } = useLogo()
const { handleEntranceClick } = useEntranceHandler()
const { handleCmsList, h5BottomMenuList } = useCms()
const { nowLang } = useLanguage()

const redirectToHome = () => {
  router.push({ name: "home" })
}

onMounted(() => {
  handleCmsList(CMS_TYPE.Enums.H5_BOTTOM_MENU)
})
</script>

<style lang="scss" scoped>
.mobile-footer-logo {
  @apply flex justify-center items-center;
}
</style>
