import { ref, computed } from "vue"
import { useQuasar } from "quasar"

export function usePlatform() {
  const $q = useQuasar()
  const platform = $q.platform.is

  const iOSPlatform = computed(() => $q.platform.is.ipad || $q.platform.is.iphone || $q.platform.is.ipod)

  const isBrowser = () => {
    if ($q.platform.is.chrome || $q.platform.is.opera || $q.platform.is.safari || $q.platform.is.edge) {
      return true
    } else {
      return false
    }
  }

  return {
    isBrowser,
    platform,
    iOSPlatform
  }
}
