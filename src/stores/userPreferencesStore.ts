import { reactive } from "vue"
import { defineStore } from "pinia"
import type * as Response from "src/api/response.type"

type BetRestrictionFormState = Response.GetPreferencesExclusion

export const useUserPreferencesStoreStore = defineStore("userPreferencesStore", () => {
  const betRestrictionFormState = reactive<BetRestrictionFormState>({
    exclusion_at: null
  })

  const setBetRestrictionExclusion = (exclusion: Response.GetPreferencesExclusion["exclusion_at"]) => {
    betRestrictionFormState.exclusion_at = exclusion
  }

  return {
    betRestrictionFormState,
    setBetRestrictionExclusion
  }
})
