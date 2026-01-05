export interface UserMenuItem {
  label: string
  value: string
  icon: string
}

export type UserMenuValue =
  | "deposit"
  | "withdrawal"
  | "history"
  | "pending"
  | "logout"
  | "changePassword"
  | "profile"
  | "bankDetails"
  | "inbox"
  | "setWithdrawalPassword"

export const getUserMenuItems = (t: (key: string) => string, needWithdrawalPassword = false): UserMenuItem[] => {
  const menuItems = [
    {
      label: t("menu.deposit"),
      value: "deposit",
      icon: "fas fa-wallet"
    },
    {
      label: t("menu.withdrawal"),
      value: "withdrawal",
      icon: "fas fa-money-bill"
    },
    {
      label: t("menu.history"),
      value: "history",
      icon: "fas fa-history"
    },
    {
      label: t("menu.order"),
      value: "pending",
      icon: "fas fa-hourglass"
    },
    {
      label: t("menu.password"),
      value: "changePassword",
      icon: "fas fa-unlock"
    },
    {
      label: t("menu.profile"),
      value: "profile",
      icon: "fas fa-users"
    },
    {
      label: t("menu.bank"),
      value: "bankDetails",
      icon: "fas fa-file-invoice"
    },
    {
      label: t("menu.inbox"),
      value: "inbox",
      icon: "fas fa-inbox"
    },
    {
      label: t("member.changePassword.setWithdrawalPassword"),
      value: "setWithdrawalPassword",
      icon: "fas fa-lock"
    },
    {
      label: t("menu.logout2"),
      value: "logout",
      icon: "fas fa-sign-out-alt"
    }
  ]

  return needWithdrawalPassword ? menuItems : menuItems.filter((item) => item.value !== "setWithdrawalPassword")
}
