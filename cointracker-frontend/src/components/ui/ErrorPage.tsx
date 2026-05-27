import {
  isRouteErrorResponse,
  useNavigate,
  useRouteError,
} from 'react-router'

import { RefreshCcw, Home, ArrowLeft } from 'lucide-react'

const RouteErrorPage = () => {
  const error = useRouteError()
  const navigate = useNavigate()

  const isRouteError = isRouteErrorResponse(error)

  const status = isRouteError ? error.status : 500

  const title =
      status === 404
          ? 'Page not found'
          : status === 401
              ? 'Unauthorized access'
              : status === 403
                  ? 'Access denied'
                  : 'Unexpected system error'

  const message =
      isRouteError
          ? error.statusText
          : error instanceof Error
              ? error.message
              : 'Something broke unexpectedly'

  const handleRetry = () => {
      window.location.reload()
  }

  const handleHome = () => {
      navigate('/', { replace: true })
  }

  const handleBack = () => {
      navigate(-1)
  }

  return (
      <main className="relative flex min-h-screen items-center justify-center bg-[#f5f7fb] px-6">

          {/* global glow system (consistent with app theme) */}
          <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-violet-300/20 blur-3xl" />
          <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-blue-300/20 blur-3xl" />

          <section className="relative z-10 w-full max-w-xl rounded-4xl border border-white/50 bg-white/70 backdrop-blur-2xl shadow-[0_20px_80px_rgba(15,23,42,0.08)] p-8">

              {/* status badge */}
              <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-rose-500">
                      Error {status}
                  </span>

                  <span className="text-xs text-neutral-500">
                      request_failed
                  </span>
              </div>

              {/* title */}
              <h1 className="mt-6 text-3xl font-semibold tracking-tight text-neutral-900">
                  {title}
              </h1>

              <p className="mt-3 text-sm text-neutral-500 leading-relaxed">
                  {message}
              </p>

              {/* actions */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3">

                  <button
                      onClick={handleRetry}
                      className="flex items-center justify-center gap-2 rounded-2xl bg-neutral-900 text-white py-3 text-sm font-semibold hover:bg-neutral-800 transition"
                  >
                      <RefreshCcw size={16} />
                      Retry
                  </button>

                  <button
                      onClick={handleBack}
                      className="flex items-center justify-center gap-2 rounded-2xl border border-neutral-200 bg-white py-3 text-sm font-semibold text-neutral-800 hover:bg-neutral-50 transition"
                  >
                      <ArrowLeft size={16} />
                      Back
                  </button>

                  <button
                      onClick={handleHome}
                      className="flex items-center justify-center gap-2 rounded-2xl border border-neutral-200 bg-white py-3 text-sm font-semibold text-neutral-800 hover:bg-neutral-50 transition"
                  >
                      <Home size={16} />
                      Home
                  </button>

              </div>

              {/* dev diagnostics */}
              {import.meta.env.DEV && (
                  <details className="mt-8 rounded-2xl bg-neutral-50 p-4 text-xs text-neutral-600">
                      <summary className="cursor-pointer font-medium">
                          Debug details
                      </summary>

                      <pre className="mt-3 overflow-auto whitespace-pre-wrap wrap-break-word text-[11px]">
                          {JSON.stringify(error, null, 2)}
                      </pre>
                  </details>
              )}

          </section>
      </main>
  )
}

export default RouteErrorPage