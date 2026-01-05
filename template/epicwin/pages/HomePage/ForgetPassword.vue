<template>
  <!-- TODO: 為了符合 /ForgetPass/:token router，先硬刻背景，之後有時間再調整 -->
  <div class="home-content">
    <div class="game-show-area" v-for="(item, key) in gameAreaList" :key="key">
      <SlideArea :slide="item"></SlideArea>
    </div>
    <!-- <div class="game-show-area">
      <GameArea :list="gameDetailList"></GameArea>
    </div> -->
    <div class="game-show-area">
      <div class="game-title small">
        <p class="title-label">Real time transaction</p>
      </div>
      <ul class="game-list marquee">
        <MarqueeTag></MarqueeTag>
      </ul>
    </div>
    <div class="game-show-area">
      <div class="con-info">
        <div class="con">
          <h1>Top Slot Game Platform</h1>
          <p>
            Explore an extensive selection of Slot Games sourced from renowned vendors worldwide. Engage with
            award-winning slot games through our internationally acclaimed, game-centric platform – an exclusive
            experience brought to you solely by Epicwin!
          </p>
        </div>
        <div class="con">
          <h1>Affiliate Partnership with Epicwin</h1>
          <p>
            Here at Epicwin Affiliates, we acknowledge the paramount importance of our affiliate partners. Our amiable
            and skilled team is dedicated to supporting you throughout your endeavor to generate profits alongside us.
            Embark on your journey with us today!
          </p>
        </div>
      </div>
    </div>
  </div>

  <!-- 重設密碼彈窗 -->
  <Modal v-model="resetPasswordShow" :persistent="true">
    <template v-slot:title>
      <div class="logo-area">
        <img class="title" :src="logoImg" />
        <p class="label" style="font-size: 1.5rem">{{ $t("member.forgotPassword.updatePasswordDetails") }}</p>
      </div>
    </template>

    <template v-slot:form>
      <q-form class="modal-form px-4" @submit.prevent="resetPassword">
        <div class="mb-4">
          <q-input
            v-model="form.account"
            bg-color="white"
            outlined
            :label="$t('member.login.username')"
            lazy-rules
            :rules="[(val) => Rules.account(val)]"
          />
        </div>
        <div class="mb-4">
          <q-input
            bg-color="white"
            outlined
            v-model="form.password"
            :label="$t('member.register.password')"
            type="password"
            lazy-rules
            :rules="[(val) => Rules.password(val)]"
          />
        </div>
        <div class="mb-4">
          <q-input
            bg-color="white"
            outlined
            v-model="form.confirm_password"
            :label="$t('member.register.confirmPassword')"
            type="password"
            lazy-rules
            :rules="[(val) => val === form.password || $t('common.validate.consistentPassword')]"
          />
        </div>
        <div class="form-bottom">
          <q-btn class="form-btn login" type="submit" :loading="isLoading">SEND</q-btn>
        </div>
      </q-form>
    </template>
  </Modal>
</template>

<script lang="ts" setup>
import { computed, defineComponent, onMounted, reactive, ref, watch } from "vue"
import { useWindowSize } from "@vueuse/core"
import { useI18n } from "vue-i18n"
import Modal from "app/template/epicwin/layouts/modal/modalBase.vue"
import { useQuasar } from "quasar"
import { useAuth } from "src/common/hooks/useAuth"
import { useSiteImg } from "app/template/epicwin/hooks/useSiteImg"
import { useRule } from "src/common/hooks/useRule"
import { useRouter, useRoute } from "vue-router"
import MarqueeTag from "src/common/components/MarqueeTag.vue"
import SlideArea from "app/template/epicwin/layouts/SlideArea.vue"

import * as Request from "src/api/request.type"
import * as Response from "src/api/response.type"

import { MODAL_TYPE } from "src/common/utils/constants"

const { t } = useI18n()
const Rules = useRule()
const route = useRoute()
const router = useRouter()
const $q = useQuasar()
const { logoImg } = useSiteImg()
const { isLogin, isLoading, handleResetPassword } = useAuth()

interface GameItem {
  fileName: string
  title: string
}

interface GameDetail {
  gameType: string
  gameName: string
}

const gameDetailList = ref<GameDetail[]>([
  { gameType: "1148", gameName: "ANDAR_BAHAR" },
  { gameType: "1148", gameName: "BILLIONAIRE_PARTY" },
  { gameType: "1148", gameName: "BINGO_CARIBBEAN" },
  { gameType: "1148", gameName: "BINGO_KITTY" },
  { gameType: "1148", gameName: "BINGO_ROCKET" },
  { gameType: "1148", gameName: "CALL_UFO" },
  { gameType: "1148", gameName: "FATE_AND_LUCK" },
  { gameType: "1148", gameName: "FLOWERISH_FAIRY" },
  { gameType: "1148", gameName: "JACK_AND_THE_BEANSTALK" },
  { gameType: "1148", gameName: "MAGICIAN" },
  { gameType: "1148", gameName: "NIGHT_BAR" },
  { gameType: "1148", gameName: "ROTI_LAGI_SATU" },
  { gameType: "1148", gameName: "SECRET_SCROLL_OF_NINJA" },
  { gameType: "1148", gameName: "THORS_HAMMER" }
])
let gameAreaList = ref<GameItem[]>([
  {
    fileName: "m",
    title: "15 DAYS, 15 MISSIONS, 15 BONUSES"
  }
])

const resetPasswordShow = ref(true)
const token = computed<string>(() => route.params.token as string)
const checkToken = computed(() => {
  // TODO: 之後補上token規則驗證
  return !!token.value
})

async function resetPassword() {
  const { status } = await handleResetPassword({
    token: token.value,
    account: form.account,
    password: form.password,
    confirm_password: form.confirm_password
  })

  if (!status) {
    return
  }

  $q.notify({
    type: "positive",
    message: t("common.tip.updateCompleted"),
    position: "top",
    timeout: 1000
  })

  // TODO: 待後續優化時，將login、register做成router，調整為導回登入彈窗
  router.push({ name: "home" }).then(() => location.reload())
}

const form = reactive({
  account: "",
  password: "",
  confirm_password: ""
})

onMounted(() => {
  if (!checkToken.value || isLogin.value) {
    router.push({ name: "home" })
  }
})
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "../../assets/css/modal.sass";
</style>
