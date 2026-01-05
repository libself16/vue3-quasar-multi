import { onBeforeUnmount } from "vue"
import { injectStrict } from "src/common/utils/injectTyped"
import { EventBusKey } from "src/symbols"
import { Events } from "src/boot/eventbus/types"

interface EventBus {
  on: (event: string, handler: (...args: any[]) => void) => void
  off: (event: string, handler: (...args: any[]) => void) => void
  emit: (event: string, ...args: any[]) => void
}

export function useEventBus() {
  const eventbus = injectStrict<EventBus>(EventBusKey)
  const listeners: [string, (...args: any[]) => void][] = []

  function eventOn<K extends keyof Events>(event: K, handler: Events[K]) {
    eventbus.on(event, handler)
    listeners.push([event, handler])
  }

  function eventOff<K extends keyof Events>(event: K, handler: Events[K]) {
    eventbus.off(event, handler)
  }

  function eventEmit<K extends keyof Events>(event: K, ...args: Parameters<Events[K]>) {
    eventbus.emit(event, ...args)
  }

  function eventOnce<K extends keyof Events>(event: K, handler: Events[K]) {
    type Args = Parameters<Events[K]>
    const wrapper = (...args: Args) => {
      eventOff(event, wrapper as Events[K])
      // 明確宣告 handler 是 (...args: Args) => void
      ;(handler as (...args: Args) => void)(...args)
    }
    eventOn(event, wrapper as Events[K])
  }

  onBeforeUnmount(() => {
    for (const [event, handler] of listeners) {
      eventbus.off(event, handler)
    }
    listeners.length = 0
  })

  return { eventOn, eventOff, eventEmit, eventOnce }
}
