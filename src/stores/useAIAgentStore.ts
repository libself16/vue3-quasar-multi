import { ref, computed, reactive } from "vue"
import { defineStore } from "pinia"
import type * as Request from "src/api/request.type"
import * as Response from "src/api/response.type"
import { useApi } from "src/common/hooks/useApi"
import { getAIAgentConfigs, startAIAgentBetting, updateAIAgentSettings, stopAIAgentBetting } from "src/api/aiAgent"

const DEFAULT_PATTERN: Response.EnabledPatternList = {
  product_name: "",
  game_name: "",
  pattern_type: "",
  is_active: false,
  rule: {
    required_count: 0,
    bet_area_indices: [],
    agent_bet_chip: "",
    agent_bet_area_index: 0,
    conditions: []
  }
}

const DEFAULT_CONDITIONS: Response.ConditionType[] = [
  {
    mode: "GREATER",
    value: "0",
    min: "0",
    max: "0",
    agent_bet_area_index: 0,
    agent_bet_chip: ""
  }
]

export const useAIAgentStore = defineStore("useAIAgentStore", () => {
  const isLoading = ref(false)
  const aiAgentState = reactive<Response.PostLaunchAI>({
    status: false,
    agent_configs: [
      {
        currency: "",
        balance: "",
        daily_stop_profit: "",
        daily_stop_loss: "",
        enabled_pattern_list: []
      }
    ]
  })

  async function fetchAIAgentConfigs(params: Omit<Request.PostLaunchAI, "action_type" | "data">) {
    isLoading.value = true
    try {
      const { data } = await useApi(getAIAgentConfigs, params)
      if (data) {
        Object.assign(aiAgentState, data)
      }
      return data
    } finally {
      isLoading.value = false
    }
  }

  function getPattern(index: number): Response.EnabledPatternList {
    const patterns = currentConfig.value.enabled_pattern_list || []
    return patterns[index] || DEFAULT_PATTERN
  }

  function updatePatternActiveStatus(index: number, isActive: boolean) {
    if (
      aiAgentState.agent_configs[0] &&
      aiAgentState.agent_configs[0].enabled_pattern_list &&
      index < aiAgentState.agent_configs[0].enabled_pattern_list.length
    ) {
      aiAgentState.agent_configs[0].enabled_pattern_list[index].is_active = isActive
    }
  }

  async function fetchStartAIAgentBetting(
    params: Omit<Request.PostLaunchAI, "action_type"> & {
      data: NonNullable<Request.PostLaunchAI["data"]>
    }
  ) {
    isLoading.value = true
    try {
      const { data } = await useApi(startAIAgentBetting, params)
      return data
    } finally {
      isLoading.value = false
    }
  }

  // 更新 AI Agent 設定
  async function fetchUpdateAIAgentSettings(
    params: Omit<Request.PostLaunchAI, "action_type"> & {
      data: NonNullable<Request.PostLaunchAI["data"]>
    }
  ) {
    isLoading.value = true
    try {
      const { data } = await useApi(updateAIAgentSettings, params)
      if (data) {
        Object.assign(aiAgentState, data)
      }
      return data
    } finally {
      isLoading.value = false
    }
  }

  // 停止 AI Agent 投注
  async function fetchStopAIAgentBetting(
    params: Omit<Request.PostLaunchAI, "action_type"> & {
      data: NonNullable<Request.PostLaunchAI["data"]>
    }
  ) {
    isLoading.value = true
    try {
      const { data } = await useApi(stopAIAgentBetting, params)
      if (data) {
        Object.assign(aiAgentState, data)
      }
      return data
    } finally {
      isLoading.value = false
    }
  }

  // 更新投注盤面
  function updatePatternBettingDisk(index: number, diskValue: number) {
    if (
      aiAgentState.agent_configs[0] &&
      aiAgentState.agent_configs[0].enabled_pattern_list &&
      index < aiAgentState.agent_configs[0].enabled_pattern_list.length
    ) {
      aiAgentState.agent_configs[0].enabled_pattern_list[index].rule.agent_bet_area_index = diskValue
    }
  }

  // 更新投注金額
  function updatePatternBettingAmount(index: number, amount: string) {
    if (
      aiAgentState.agent_configs[0] &&
      aiAgentState.agent_configs[0].enabled_pattern_list &&
      index < aiAgentState.agent_configs[0].enabled_pattern_list.length
    ) {
      aiAgentState.agent_configs[0].enabled_pattern_list[index].rule.agent_bet_chip = amount
    }
  }

  const currentConfig = computed(
    () =>
      aiAgentState.agent_configs[0] || {
        currency: "",
        balance: "",
        daily_stop_profit: "",
        daily_stop_loss: "",
        enabled_pattern_list: []
      }
  )

  return {
    aiAgentState,
    isLoading,
    currentConfig,
    fetchAIAgentConfigs,
    fetchStartAIAgentBetting,
    fetchUpdateAIAgentSettings,
    fetchStopAIAgentBetting,
    getPattern,
    updatePatternActiveStatus,
    updatePatternBettingDisk,
    updatePatternBettingAmount
  }
})
