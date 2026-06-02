import {
  ArrowLeft,
  Home,
  RefreshCcw,
} from 'lucide-react'
import {
  isRouteErrorResponse,
  useNavigate,
  useRouteError,
} from 'react-router'
import BrandMark from '@/components/shared/BrandMark'

const ErrorPage = () => {
  const error = useRouteError()
  const navigate = useNavigate()
  const isRouteError = isRouteErrorResponse(error)
  const status = isRouteError ? error.status : 500

  const title =
    status === 404
      ? 'Page not found'
      : status === 401
        ? 'Please sign in again'
        : status === 403
          ? 'This area is locked'
          : 'Something needs a refresh'

  const message =
    status === 404
      ? 'That page moved, vanished, or never existed.'
      : isRouteError
        ? error.statusText
        : error instanceof Error
          ? error.message
          : 'CoinTracker hit a rough edge while opening this view.'

  return (
    <main className="flex min-h-screen items-center justify-center bg-transparent px-4 py-10">
      <section className="glass-panel w-full max-w-2xl overflow-hidden rounded-3xl">
        <div className="bg-(--hero) p-6 sm:p-8">
          <BrandMark />
          <div className="mt-8 inline-flex rounded-full bg-[color-mix(in_srgb,var(--surface)_70%,transparent)] px-4 py-2 text-sm font-bold text-rose-600">
            Error {status}
          </div>
          <h1 className="brand-font mt-4 text-4xl font-extrabold text-(--foreground)">{title}</h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-(--muted)">{message}</p>
        </div>

        <div className="grid grid-cols-1 gap-3 p-6 sm:grid-cols-3 sm:p-8">
          <button
            onClick={() => window.location.reload()}
            className="flex items-center justify-center gap-2 rounded-2xl bg-(--primary) py-3 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5"
          >
            <RefreshCcw size={16} />
            Retry
          </button>

          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 rounded-2xl border border-(--border) bg-(--surface-muted) py-3 text-sm font-bold text-(--foreground) transition hover:-translate-y-0.5"
          >
            <ArrowLeft size={16} />
            Back
          </button>

          <button
            onClick={() => navigate('/', { replace: true })}
            className="flex items-center justify-center gap-2 rounded-2xl border border-(--border) bg-(--surface-muted) py-3 text-sm font-bold text-(--foreground) transition hover:-translate-y-0.5"
          >
            <Home size={16} />
            Home
          </button>
        </div>

        {import.meta.env.DEV && (
          <details className="mx-6 mb-6 rounded-2xl bg-(--surface-muted) p-4 text-xs text-(--muted) sm:mx-8 sm:mb-8">
            <summary className="cursor-pointer font-semibold text-(--foreground)">Debug details</summary>
            <pre className="mt-3 overflow-auto whitespace-pre-wrap text-[11px]">
              {JSON.stringify(error, null, 2)}
            </pre>
          </details>
        )}
      </section>
    </main>
  )
}

export default ErrorPage
