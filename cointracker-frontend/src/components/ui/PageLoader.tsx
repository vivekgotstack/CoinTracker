const PageLoader = () => {
    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-[#f5f7fb]">

            {/* subtle pulse system */}
            <div className="space-y-4 text-center">

                <div className="mx-auto h-10 w-10 animate-pulse rounded-xl bg-violet-400/30" />

                <div className="h-3 w-40 animate-pulse rounded bg-neutral-200" />

                <div className="h-2 w-28 animate-pulse rounded bg-neutral-100" />

            </div>

        </div>
    )
}

export default PageLoader