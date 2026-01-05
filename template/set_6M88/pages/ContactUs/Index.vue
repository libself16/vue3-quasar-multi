<template>
  <HeaderTitleBack titleI18n="home.contact_us" v-bind="HTBConfig">
    <section class="contact-wrapper px-[10px] pt-[20px] pb-[80px]">
      <div
        class="contact-box"
        v-for="(cmsItem, cmsIndex) in cmsListState[CMS_TYPE.Enums.CONTACT_US]"
        :key="cmsIndex"
        @click="handleEntranceClick(cmsItem.Entrance[0])"
      >
        <!-- <i class="contact-icon" :class="contact.icon"></i>
        <span class="mt-[10px] font-bold">{{ $t(contact.title as string) }}</span>
        <span class="text-[14px]">{{ contact.link }}</span> -->
        <q-img :src="cmsItem.Setting.icon_lang[nowLang as LANGUAGE_TYPE.Enums]" class="icon-img" contain />
        <h4>{{ cmsItem.Setting.lang[nowLang as LANGUAGE_TYPE.Enums] }}</h4>
      </div>
    </section>
  </HeaderTitleBack>
</template>

<script lang="ts" setup>
import { useEntranceHandler } from "app/template/set_6M88/composables/useCms"
import HeaderTitleBack from "src/common/components/modal/HeaderTitleBack.vue"
import { useCms } from "src/common/composables/useCms"
import { useLanguage } from "src/common/composables/useLanguage"
import { useEnv } from "src/common/hooks/useEnv"
import { CMS_TYPE, LANGUAGE_TYPE } from "src/common/utils/constants"
import { onMounted, ref } from "vue"
import { useHTBConfig } from "../../hooks/useHTBConfig"

const { HTBConfig } = useHTBConfig()
const { nowLang } = useLanguage()
const { nowHost } = useEnv()
const { cmsListState, handleCmsList } = useCms()
const { handleEntranceClick } = useEntranceHandler()

const contactList = ref([
  {
    title: "Zalo",
    icon: "fas fa-sms",
    link: "https://t.me/onyx2play"
  },
  {
    title: "common.btn.telegram",
    icon: "fab fa-telegram",
    link: "https://t.me/onyx2play"
  },
  {
    title: "member.profile.email",
    icon: "fa-solid fa-envelope",
    link: `info@${nowHost.value}`
  },
  {
    title: "member.register.phone",
    icon: "fa-solid fa-phone",
    link: "+639278077337"
  },
  {
    title: "member.register.contact1",
    icon: "fab fa-skype",
    link: ""
  },
  {
    title: "member.register.contact2",
    icon: "fab fa-line",
    link: ""
  },
  {
    title: "common.btn.whatsapp",
    icon: "fab fa-whatsapp",
    link: ""
  }
])

const contactLink = (link: string) => {
  if (link && link.includes("http")) {
    window.open(link, "_blank")
  }
}

onMounted(async () => {
  await handleCmsList(CMS_TYPE.Enums.CONTACT_US)
})
</script>

<style lang="scss" scoped>
@import "../../assets/css/_variable.scss";
@import "../../assets/css/main.scss";

.contact-wrapper {
  @apply grid grid-cols-2 gap-[20px];

  .contact-box {
    @apply flex flex-col items-center p-[10px] rounded-[20px];
    @apply text-base cursor-pointer;
    border: 1px solid $secondary;
    color: $secondary;
    transition: all 0.3s ease;

    .contact-icon {
      @apply w-[50px] h-[50px] text-white;
      @apply rounded-[50%] text-[30px] p-[10px];
      background: $gradient-to-bottom;
    }

    span {
      @apply break-all;
    }
  }
}
</style>
