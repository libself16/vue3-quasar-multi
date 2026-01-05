import { defineStore } from "pinia"
import type * as Response from "src/api/response.type"
import { computed } from "vue"
import { AUTH_REQUIRED } from "src/common/utils/constants"

type State = Response.login & {
  onBoarding: boolean
  totpStatus: Response.GetTotpStatus
  totpGenerate: Response.GetTotpGenerate
  toptVerified: boolean
}

export const useAuthStore = defineStore("authStore", {
  state: (): Partial<State> => ({
    access_token: undefined,
    agent_id: undefined,
    role_id: undefined,
    user_id: undefined,
    is_maya_login: false,
    maya_last_session_id: undefined,
    onBoarding: false,
    totpStatus: undefined,
    totpGenerate: undefined,
    toptVerified: false
  }),
  actions: {
    setTotpStatus(data: Response.GetTotpStatus) {
      this.totpStatus = data
    },
    setTotpGenerate(data: Response.GetTotpGenerate) {
      this.totpGenerate = data
    },
    setToptVerified(status: boolean) {
      this.toptVerified = status
    }
  },
  getters: {
    isLogin: (state) => !!state.access_token,
    isMayaLogin: (state) => computed(() => state.is_maya_login ?? false),
    isOnBoarding: (state) => computed(() => state.onBoarding ?? false),
    isToptEnabled: (state) => computed(() => state.totpStatus?.is_enabled ?? false),
    isToptVerified: (state) => computed(() => state.toptVerified ?? false)
  },
  persist: true
})
