<template>
  <section class="contact-wrapper px-[10px] pt-[20px] pb-[80px]">
    <div
      class="contact-box"
      v-for="(cmsItem, cmsIndex) in cmsListState[CMS_TYPE.Enums.CONTACT_US]"
      :key="cmsIndex"
      @click="handleEntranceClick(cmsItem.Entrance[0])"
    >
      <q-img :src="cmsItem.Setting.icon_lang[nowLang as LANGUAGE_TYPE.Enums]" class="icon-img" contain />
      <h4>{{ cmsItem.Setting.lang[nowLang as LANGUAGE_TYPE.Enums] }}</h4>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue"
import { useEntranceHandler } from "app/template/set_UFAONG/composables/useCms"
import { useEnv } from "src/common/hooks/useEnv"
import { useCms } from "src/common/composables/useCms"
import { useLanguage } from "src/common/composables/useLanguage"
import { CMS_TYPE, LANGUAGE_TYPE } from "src/common/utils/constants"

const { nowHost } = useEnv()
const { nowLang } = useLanguage()
const { cmsListState, handleCmsList } = useCms()
const { handleEntranceClick } = useEntranceHandler()

const contactList = ref([
  {
    title: "Zalo",
    icon: "fas fa-sms",
    link: ""
  },
  {
    title: "common.btn.telegram",
    icon: "fab fa-telegram",
    link: ""
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
    @apply font-bold text-base cursor-pointer bg-[#2b2b2b];
    border: 1px solid $primary;
    color: $primary;
    transition: all 0.3s ease;

    &:hover {
      @apply text-white;
      transform: scale(1.01);
      box-shadow: 1px 1px 10px 1px $primary;
    }

    .contact-icon {
      @apply w-[50px] h-[50px] text-black;
      @apply rounded-[50%] text-[30px] p-[10px];
      background: $gradient-to-bottom;
    }
  }
}
</style>
