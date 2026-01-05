export enum AgentBetEnum {
  Banker = 0, // 莊
  Player = 1, // 閒
  Tie = 2, // 和
  BankerPair = 3, // 莊對
  PlayerPair = 4 // 閒對
}

/*
  action_type
  0: 取得投注設定(等於是 GET method 取得列表)
  1: 開始投注(選 1 時，data 必填, status 為 true)
  2: 更新設定資料(選 2 時，data 必填, status 為 false)
  3: 停止投注(選 3 時，data 必填, status 為 false)
*/
export enum AgentStatusEnum {
  GET_CONFIG = 0,
  START_BETTING = 1,
  UPDATE_CONFIG = 2,
  STOP_BETTING = 3
}
