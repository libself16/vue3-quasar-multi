<template>
  <q-dialog v-model="dialogModel" position="right" persistent class="side-menu-wrapper">
    <q-card class="side-menu-card">
      <q-card-section class="row items-center no-wrap">
        <div class="list-wrapper">
          <ul class="list-container">
            <q-btn @click="closeDialog" class="menu-close-icon"></q-btn>
            <li
              v-for="(cmsItem, cmsIndex) in fliterDisplayDeviceAndLogin"
              @click="handleMenuClick(cmsItem)"
              :key="cmsIndex"
              class="list-item"
            >
              <q-img v-if="cmsItem.Setting.icon_path" :src="cmsItem.Setting.icon_path" class="list-icon" contain />
              <span class="list-label">
                {{ limitWordLength(cmsItem.Setting.lang[nowLang as LANGUAGE_TYPE.Enums] as string) }}
              </span>
            </li>
            <li class="list-item" @click="changeLanguage">
              <q-img :src="headerImg('language')" class="list-icon" contain />
              <span class="list-label">
                {{ $t("menu.language") }}
              </span>
            </li>
            <li v-if="isLogin" class="list-item" @click="handleLogout">
              <q-img :src="headerImg('Logout-Icon')" class="list-icon" contain />
              <span class="list-label">
                {{ $t("menu.logout2") }}
              </span>
            </li>
          </ul>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue"
import { useAuth } from "src/common/hooks/useAuth"
import { useCms } from "src/common/composables/useCms"
import { useEntranceHandler } from "app/template/set_royalslot88/composables/useCms"
import { useSiteImg } from "app/template/set_royalslot88/hooks/useSiteImg"
import { CMS_TYPE, LANGUAGE_TYPE } from "src/common/utils/constants"
import { useLanguage } from "src/common/composables/useLanguage"
import type * as Response from "src/api/response.type"
import { injectStrict } from "src/common/utils/injectTyped"
import { EventBusKey } from "src/symbols"

const { handleEntranceClick } = useEntranceHandler()
const { handleCmsList, fliterDisplayDeviceAndLogin } = useCms()
const { headerImg } = useSiteImg()
const { isLogin, handleLogout } = useAuth()
const { nowLang } = useLanguage()
const eventbus = injectStrict(EventBusKey)

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: "update:isOpen", value: boolean): void
}>()

const dialogModel = computed({
  get: () => props.isOpen,
  set: (value) => emit("update:isOpen", value)
})

const limitWordLength = (word: string) => {
  return word.length > 14 ? word.slice(0, 14) + "..." : word
}

const closeDialog = () => {
  dialogModel.value = false
}

const changeLanguage = () => {
  eventbus.emit("openSwitchLanguage", true)
}

const handleMenuClick = (cmsItem: Response.CmsItem) => {
  handleEntranceClick({
    entrance: cmsItem.Entrance[0]
  })

  closeDialog()
}

onMounted(async () => {
  await handleCmsList(CMS_TYPE.Enums.MENU)
})
</script>

<style lang="scss" scoped>
.side-menu-wrapper {
  ::v-deep(.q-dialog__inner) {
    background: transparent !important;
  }
}

.side-menu-card {
  background: transparent !important;
  box-shadow: none !important;

  ::v-deep(.q-card__section--vert) {
    padding: 0;
  }
}

.list-wrapper {
  @apply w-[21.875rem] py-[2rem] pl-[3rem];
  background-image: url(../../../assets/images/header/subnav_bg.png);
  background-position: center center;
  background-repeat: no-repeat;
  background-size: 100% 100%;

  .list-container {
    @apply grid gap-[1.25rem];

    padding: 0.625rem 0rem 0.625rem 0.625rem;

    .menu-close-icon {
      @apply absolute top-0 left-0;
      background-image: url(../../../assets/images/icon/closebutton.png);
      background-size: contain;
      background-repeat: no-repeat;
      filter: drop-shadow(rgb(0, 0, 0) 0px 0px 4px);
    }
  }

  .list-item {
    @apply flex items-center gap-x-[1.25rem] relative cursor-pointer;

    &::after {
      content: "";
      height: 0.125rem;
      width: 100%;
      position: absolute;
      bottom: -0.625rem;
      background-color: rgb(160 26 255 / 53%);
      box-shadow: rgba(0, 0, 0, 0.44) 0rem 0.0625rem;
    }
  }

  .list-icon {
    @apply w-full h-full max-w-[2.625rem];
  }

  .list-label {
    @apply text-[1.25rem] font-bold capitalize;
  }
}
</style>
