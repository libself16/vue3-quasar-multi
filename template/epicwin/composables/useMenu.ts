import { useGame } from "src/common/composables/useGame"
import { useAuth } from "src/common/hooks/useAuth"
import { GAME_TYPE, MENU } from "src/common/utils/constants"
import { computed } from "vue"

export type Menu = {
  label: string
  cssSuffix: string
  routerName: string
  gameTypeId: number
}
export type Menus = Menu[]

type MenuState = {
  reward: Menus
  pc: {
    top: Menus
    middle: Menus
    bottom: Menus
  }
  mobile: {
    right: Menus
    left: Menus
    bottom: Menus
  }
}

export function useMenu() {
  const { gameTypeState } = useGame()
  const { isLogin } = useAuth()
  const MenuState = computed<MenuState>(() => {
    let reward: Menus = []
    const pc = {
      top: [] as Menus,
      middle: [] as Menus,
      bottom: [] as Menus
    }
    const mobile = {
      right: [] as Menus,
      left: [] as Menus,
      bottom: [] as Menus
    }

    // TODO: useAuth 登入前後
    if (isLogin.value) {
      reward = [
        {
          label: MENU.I18nKeys[MENU.Enums.Inbox],
          cssSuffix: MENU.FrontendKey[MENU.Enums.Inbox],
          routerName: MENU.FrontendKey[MENU.Enums.Inbox],
          gameTypeId: 0
        }
      ]
      pc.top = [
        {
          label: MENU.I18nKeys[MENU.Enums.Promotion],
          cssSuffix: MENU.FrontendKey[MENU.Enums.Promotion],
          routerName: MENU.FrontendKey[MENU.Enums.Promotion],
          gameTypeId: 0
        },
        {
          label: MENU.I18nKeys[MENU.Enums.Order],
          cssSuffix: MENU.FrontendKey[MENU.Enums.Order],
          routerName: MENU.FrontendKey[MENU.Enums.Order],
          gameTypeId: 0
        },
        {
          label: MENU.I18nKeys[MENU.Enums.Inbox],
          cssSuffix: MENU.FrontendKey[MENU.Enums.Inbox],
          routerName: MENU.FrontendKey[MENU.Enums.Inbox],
          gameTypeId: 0
        },
        {
          label: MENU.I18nKeys[MENU.Enums.Profile],
          cssSuffix: MENU.FrontendKey[MENU.Enums.Profile],
          routerName: MENU.FrontendKey[MENU.Enums.Profile],
          gameTypeId: 0
        },
        {
          label: MENU.I18nKeys[MENU.Enums.DepositWthdrawal],
          cssSuffix: MENU.FrontendKey[MENU.Enums.Deposit],
          routerName: MENU.FrontendKey[MENU.Enums.Deposit],
          gameTypeId: 0
        },
        {
          label: MENU.I18nKeys[MENU.Enums.History],
          cssSuffix: MENU.FrontendKey[MENU.Enums.History],
          routerName: MENU.FrontendKey[MENU.Enums.History],
          gameTypeId: 0
        }
      ]
      mobile.right = [
        {
          label: MENU.I18nKeys[MENU.Enums.Deposit],
          cssSuffix: MENU.FrontendKey[MENU.Enums.Deposit],
          routerName: MENU.FrontendKey[MENU.Enums.Deposit],
          gameTypeId: 0
        },
        {
          label: MENU.I18nKeys[MENU.Enums.Wthdrawal],
          cssSuffix: MENU.FrontendKey[MENU.Enums.Wthdrawal],
          routerName: MENU.FrontendKey[MENU.Enums.Wthdrawal],
          gameTypeId: 0
        },
        {
          label: MENU.I18nKeys[MENU.Enums.History],
          cssSuffix: MENU.FrontendKey[MENU.Enums.History],
          routerName: MENU.FrontendKey[MENU.Enums.History],
          gameTypeId: 0
        },
        {
          label: MENU.I18nKeys[MENU.Enums.Support],
          cssSuffix: MENU.FrontendKey[MENU.Enums.Support],
          routerName: MENU.FrontendKey[MENU.Enums.Support],
          gameTypeId: 0
        },
        {
          label: MENU.I18nKeys[MENU.Enums.Facebook],
          cssSuffix: MENU.FrontendKey[MENU.Enums.Facebook],
          routerName: MENU.FrontendKey[MENU.Enums.Facebook],
          gameTypeId: 0
        },
        {
          label: MENU.I18nKeys[MENU.Enums.Telegram],
          cssSuffix: MENU.FrontendKey[MENU.Enums.Telegram],
          routerName: MENU.FrontendKey[MENU.Enums.Telegram],
          gameTypeId: 0
        },
        {
          label: MENU.I18nKeys[MENU.Enums.Instagram],
          cssSuffix: MENU.FrontendKey[MENU.Enums.Instagram],
          routerName: MENU.FrontendKey[MENU.Enums.Instagram],
          gameTypeId: 0
        },
        {
          label: MENU.I18nKeys[MENU.Enums.Youtube],
          cssSuffix: MENU.FrontendKey[MENU.Enums.Youtube],
          routerName: MENU.FrontendKey[MENU.Enums.Youtube],
          gameTypeId: 0
        },
        {
          label: MENU.I18nKeys[MENU.Enums.News],
          cssSuffix: MENU.FrontendKey[MENU.Enums.News],
          routerName: MENU.FrontendKey[MENU.Enums.News],
          gameTypeId: 0
        },
        {
          label: MENU.I18nKeys[MENU.Enums.Language],
          cssSuffix: MENU.FrontendKey[MENU.Enums.Language],
          routerName: MENU.FrontendKey[MENU.Enums.Language],
          gameTypeId: 0
        }
      ]
    } else {
      reward = []
      pc.top = [
        {
          label: MENU.I18nKeys[MENU.Enums.Promotion],
          cssSuffix: MENU.FrontendKey[MENU.Enums.Promotion],
          routerName: MENU.FrontendKey[MENU.Enums.Promotion],
          gameTypeId: 0
        }
      ]
      mobile.right = [
        {
          label: MENU.I18nKeys[MENU.Enums.Support],
          cssSuffix: MENU.FrontendKey[MENU.Enums.Support],
          routerName: MENU.FrontendKey[MENU.Enums.Support],
          gameTypeId: 0
        },
        {
          label: MENU.I18nKeys[MENU.Enums.Facebook],
          cssSuffix: MENU.FrontendKey[MENU.Enums.Facebook],
          routerName: MENU.FrontendKey[MENU.Enums.Facebook],
          gameTypeId: 0
        },
        {
          label: MENU.I18nKeys[MENU.Enums.Telegram],
          cssSuffix: MENU.FrontendKey[MENU.Enums.Telegram],
          routerName: MENU.FrontendKey[MENU.Enums.Telegram],
          gameTypeId: 0
        },
        {
          label: MENU.I18nKeys[MENU.Enums.Instagram],
          cssSuffix: MENU.FrontendKey[MENU.Enums.Instagram],
          routerName: MENU.FrontendKey[MENU.Enums.Instagram],
          gameTypeId: 0
        },
        {
          label: MENU.I18nKeys[MENU.Enums.Youtube],
          cssSuffix: MENU.FrontendKey[MENU.Enums.Youtube],
          routerName: MENU.FrontendKey[MENU.Enums.Youtube],
          gameTypeId: 0
        },
        {
          label: MENU.I18nKeys[MENU.Enums.News],
          cssSuffix: MENU.FrontendKey[MENU.Enums.News],
          routerName: MENU.FrontendKey[MENU.Enums.News],
          gameTypeId: 0
        },
        {
          label: MENU.I18nKeys[MENU.Enums.Language],
          cssSuffix: MENU.FrontendKey[MENU.Enums.Language],
          routerName: MENU.FrontendKey[MENU.Enums.Language],
          gameTypeId: 0
        }
      ]
    }

    const gameTypeMenu = gameTypeState.list.map((e) => {
      const gameTypeCategory = GAME_TYPE.Category[e.id]
      const routerName =
        gameTypeCategory === GAME_TYPE.CategoryEnums.LobbyOpen
          ? MENU.FrontendKey[MENU.Enums.GameLobby]
          : MENU.FrontendKey[MENU.Enums.GameList]

      return {
        label: e.label || "",
        cssSuffix: e.frontendKey || "",
        routerName: routerName,
        gameTypeId: e.id
      }
    })
    // TODO: hot，預留待討論
    // gameTypeMenu.unshift({
    //   label: MENU.I18nKeys[MENU.Enums.Hot],
    //   cssSuffix: MENU.FrontendKey[MENU.Enums.Hot],
    //   routerName: MENU.FrontendKey[MENU.Enums.Hot],
    //   gameTypeId: 0
    // })
    pc.middle = gameTypeMenu
    mobile.left = gameTypeMenu

    pc.bottom = [
      // {
      //   label: MENU.I18nKeys[MENU.Enums.News],
      //   cssSuffix: MENU.FrontendKey[MENU.Enums.News],
      //   routerName: MENU.FrontendKey[MENU.Enums.News],
      //   gameTypeId: 0
      // },
      {
        label: MENU.I18nKeys[MENU.Enums.FollowUs],
        cssSuffix: MENU.FrontendKey[MENU.Enums.FollowUs],
        routerName: MENU.FrontendKey[MENU.Enums.FollowUs],
        gameTypeId: 0
      }
    ]

    mobile.bottom = [
      {
        label: MENU.I18nKeys[MENU.Enums.Home],
        cssSuffix: MENU.FrontendKey[MENU.Enums.Home],
        routerName: MENU.FrontendKey[MENU.Enums.Home],
        gameTypeId: 0
      },
      {
        label: MENU.I18nKeys[MENU.Enums.Promotion],
        cssSuffix: MENU.FrontendKey[MENU.Enums.Promotion],
        routerName: MENU.FrontendKey[MENU.Enums.Promotion],
        gameTypeId: 0
      },
      {
        label: MENU.I18nKeys[MENU.Enums.Vip],
        cssSuffix: MENU.FrontendKey[MENU.Enums.Vip],
        routerName: MENU.FrontendKey[MENU.Enums.Vip],
        gameTypeId: 0
      },
      {
        label: MENU.I18nKeys[MENU.Enums.Profile],
        cssSuffix: MENU.FrontendKey[MENU.Enums.Profile],
        routerName: MENU.FrontendKey[MENU.Enums.Profile],
        gameTypeId: 0
      }
    ]

    // live stream => slots
    const slotInfo = gameTypeState.list.find((e) => e.id === GAME_TYPE.Enums.SLOT)
    if (slotInfo) {
      const slotMenu = {
        label: slotInfo.label || "",
        cssSuffix: slotInfo.frontendKey || "",
        routerName: MENU.FrontendKey[MENU.Enums.GameList],
        gameTypeId: slotInfo.id
      }
      // pc.bottom.splice(1, 0, slotMenu)
      mobile.bottom.splice(3, 0, slotMenu)
    }

    return {
      reward,
      pc,
      mobile
    }
  })

  return { gameTypeState, MenuState }
}
