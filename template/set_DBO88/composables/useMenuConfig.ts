interface RouteConfig {
  name?: string
  path?: string
  query?: Record<string, string>
  params?: Record<string, string>
  isModal?: boolean
  isAction?: boolean
}

const routeConfigs: Record<string, RouteConfig> = {
  deposit: {
    name: "DepositWithdrawal",
    query: { type: "deposit" }
  },
  withdrawal: {
    name: "DepositWithdrawal",
    query: { type: "withdrawal" }
  },
  history: {
    name: "TransactionHistory"
  },
  pending: {
    name: "PendingTransaction"
  },
  changePassword: {
    name: "ChangePassword"
  },
  profile: {
    name: "Profile"
  },
  bankDetails: {
    name: "bankDetails",
    isModal: true
  },
  inbox: {
    name: "Inbox"
  },
  setWithdrawalPassword: {
    name: "SetWithdrawalPassword"
  },
  logout: {
    name: "Logout",
    isAction: true
  }
}

export const useMenuConfig = () => {
  return {
    routeConfigs
  }
}
