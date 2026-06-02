const CHUNK_RECOVERY_KEY = 'cointracker_chunk_recovery_attempted'

const isMissingChunkError = (reason: unknown) => {
  const message = reason instanceof Error ? reason.message : String(reason ?? '')
  return /Failed to fetch dynamically imported module|Importing a module script failed|Loading chunk/i.test(message)
}

const clearServiceWorkerState = async () => {
  const registrations = await navigator.serviceWorker?.getRegistrations?.()
  await Promise.all(registrations?.map((registration) => registration.unregister()) ?? [])

  if ('caches' in window) {
    const cacheNames = await caches.keys()
    await Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName)))
  }
}

export const registerChunkRecovery = () => {
  window.addEventListener('unhandledrejection', (event) => {
    if (!isMissingChunkError(event.reason)) return

    const hasRetried = sessionStorage.getItem(CHUNK_RECOVERY_KEY) === 'true'
    if (hasRetried) return

    event.preventDefault()
    sessionStorage.setItem(CHUNK_RECOVERY_KEY, 'true')

    clearServiceWorkerState().finally(() => {
      window.location.reload()
    })
  })
}
