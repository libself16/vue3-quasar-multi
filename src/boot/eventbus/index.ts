import { EventBus } from "quasar"
import { boot } from "quasar/wrappers"
import { EventBusKey } from "src/symbols"

import { Events } from "boot/eventbus/types"

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $eventbus: EventBus<Events>
  }
}

export default boot(({ app }) => {
  const bus = new EventBus<Events>()

  // options
  app.config.globalProperties.$eventbus = bus

  // composition
  app.provide(EventBusKey, bus)
})
