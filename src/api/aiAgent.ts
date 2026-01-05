import { requestApi } from "src/common/utils/request"
import { AgentStatusEnum } from "src/common/utils/constants/AIAgentType"
import * as Request from "./request.type"
import * as Response from "./response.type"

// 取得 AI Agent 列表
export const getAIAgentConfigs = (params: Omit<Request.PostLaunchAI, "action_type" | "data">) => {
  return requestApi<Request.PostLaunchAI, Response.PostLaunchAI>(
    "/platform/v1/player/game/ai_agent/launch",
    { ...params, action_type: AgentStatusEnum.GET_CONFIG },
    {
      name: "getAIAgentConfigs",
      method: "post"
    }
  )
}

// 開始投注
export const startAIAgentBetting = (
  params: Omit<Request.PostLaunchAI, "action_type"> & { data: NonNullable<Request.PostLaunchAI["data"]> }
) => {
  return requestApi<Request.PostLaunchAI, Response.PostLaunchAI>(
    "/platform/v1/player/game/ai_agent/launch",
    { ...params, action_type: AgentStatusEnum.START_BETTING },
    {
      name: "startAIAgentBetting",
      method: "post"
    }
  )
}

// 更新設定資料
export const updateAIAgentSettings = (
  params: Omit<Request.PostLaunchAI, "action_type"> & { data: NonNullable<Request.PostLaunchAI["data"]> }
) => {
  return requestApi<Request.PostLaunchAI, Response.PostLaunchAI>(
    "/platform/v1/player/game/ai_agent/launch",
    { ...params, action_type: AgentStatusEnum.UPDATE_CONFIG },
    {
      name: "updateAIAgentSettings",
      method: "post"
    }
  )
}

// 停止投注
export const stopAIAgentBetting = (
  params: Omit<Request.PostLaunchAI, "action_type"> & { data: NonNullable<Request.PostLaunchAI["data"]> }
) => {
  return requestApi<Request.PostLaunchAI, Response.PostLaunchAI>(
    "/platform/v1/player/game/ai_agent/launch",
    { ...params, action_type: AgentStatusEnum.STOP_BETTING },
    {
      name: "stopAIAgentBetting",
      method: "post"
    }
  )
}
