import BrandMark from '@/components/shared/BrandMark'

const PageLoader = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-(--app-bg) px-4">
      <div className="glass-panel w-full max-w-md rounded-3xl p-8 text-center">
        <div className="flex justify-center">
          <BrandMark compact />
        </div>
        <h1 className="brand-font mt-5 text-2xl font-bold text-(--foreground)">CoinTracker</h1>
        <p className="mt-2 text-sm text-(--muted)">Warming up your money view</p>
        <div className="mt-6 space-y-3">
          <div className="skeleton-shimmer h-3 rounded-full" />
          <div className="skeleton-shimmer mx-auto h-3 w-4/5 rounded-full" />
          <div className="skeleton-shimmer mx-auto h-3 w-2/3 rounded-full" />
        </div>
      </div>
    </div>
  )
}

export default PageLoader
