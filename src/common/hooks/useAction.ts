import { useStore } from '@/store';

export function useAction (pageName: string | null) {
  const store = useStore()
  const pageAction = store.state.action.filter(actionItem => actionItem.name === pageName)[0]

  return { pageAction }
}