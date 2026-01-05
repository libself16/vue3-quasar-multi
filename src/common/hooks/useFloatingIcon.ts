import { EventBusKey } from "src/symbols"
import { injectStrict } from "src/common/utils/injectTyped"

export function useFloatingIcon() {
  const eventbus = injectStrict(EventBusKey)
  const allowAgentCode = ["zlb1", "mta1", "vvc1", "nbl1", "dobt", "ns41", "vp01", "tle1"]

  const open = (show: boolean) => {
    eventbus.emit("openFloatingIconDialog", show)
  }

  return {
    allowAgentCode,
    open
  }
}
