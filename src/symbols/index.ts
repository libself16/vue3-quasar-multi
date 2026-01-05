import { InjectionKey } from "vue"
import { type EventBus } from "quasar"
import { Events } from "src/boot/eventbus/types"

export const EventBusKey: InjectionKey<EventBus<Events>> = Symbol("eventbus")
