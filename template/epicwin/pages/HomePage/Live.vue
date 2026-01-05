<template>
  <div class="home-layout">
    <ContentLive></ContentLive>
  </div>
</template>
<script>
import { defineComponent, ref, watch, computed } from "vue"
import { useUserInfoStore } from "stores/userInfoStore"
import { useRouter } from "vue-router"
import ContentLive from "app/template/epicwin/layouts/content/Live.vue"
// import { useQuasar } from 'quasar';
// import { ref } from 'vue';

export default defineComponent({
  name: "HomePage",
  components: {
    ContentLive
  },
  setup() {
    const slide = ref(1)
    const router = useRouter()
    let isLogin = ref(false)
    let screenWidth = ref(window.innerWidth)
    let isMobile = computed(() => {
      if (screenWidth.value < 768) return true
      else return false
    })
    let { userInfo } = useUserInfoStore()

    const goLobby = () => {
      if (isLogin.value) router.push({ path: "/SlotLobby" })
      else router.push({ path: "/Login" })
    }

    watch(
      () => userInfo.username,
      (value) => {
        if (value !== null) isLogin.value = value !== ""
      },
      { immediate: true }
    )

    return {
      goLobby,
      isLogin,
      slide,
      router,
      isMobile
    }
  },
  mounted() {
    console.log("mounted")
  }
})
</script>

<style lang="sass" scoped>
.home-layout
  width: 100%
  height: 70%
  // padding-bottom: 20vw
</style>
