import { useEffect, useState } from 'react'
import { Button } from 'antd'
import { Download, X } from 'lucide-react'

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

const INSTALL_PROMPT_KEY = 'cointracker_install_prompt_seen'

const isStandalone = () =>
  window.matchMedia('(display-mode: standalone)').matches ||
  (window.navigator as Navigator & { standalone?: boolean }).standalone === true

const InstallPrompt = () => {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (isStandalone() || localStorage.getItem(INSTALL_PROMPT_KEY)) return

    const fallbackTimer = window.setTimeout(() => setVisible(true), 2200)

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault()
      setInstallEvent(event as BeforeInstallPromptEvent)
      setVisible(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    return () => {
      window.clearTimeout(fallbackTimer)
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const dismiss = () => {
    localStorage.setItem(INSTALL_PROMPT_KEY, 'true')
    setVisible(false)
  }

  const install = async () => {
    if (!installEvent) {
      dismiss()
      return
    }

    await installEvent.prompt()
    await installEvent.userChoice
    dismiss()
  }

  if (!visible) return null

  return (
    <div className="fixed inset-x-3 bottom-24 z-40 mx-auto max-w-md rounded-3xl border border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_94%,transparent)] p-4 shadow-2xl backdrop-blur-xl sm:bottom-6">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--primary)] text-white">
          <Download size={20} />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-bold text-[var(--foreground)]">Install CoinTracker</h3>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Add it to your device for a faster app-like launch.
          </p>
          <div className="mt-3 flex gap-2">
            <Button type="primary" onClick={install}>
              {installEvent ? 'Install app' : 'Got it'}
            </Button>
            <Button onClick={dismiss}>Not now</Button>
          </div>
        </div>
        <button
          onClick={dismiss}
          aria-label="Dismiss install prompt"
          className="rounded-full p-1 text-[var(--muted)] hover:bg-[var(--surface-muted)]"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  )
}

export default InstallPrompt
