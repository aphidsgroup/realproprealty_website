export default function PropertyLoading() {
    return (
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24">
            {/* Header skeleton */}
            <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30 shadow-sm">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-6 max-w-4xl animate-pulse">
                {/* Title skeleton */}
                <div className="mb-6">
                    <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                        <div className="h-7 w-24 bg-gray-200 dark:bg-gray-700 rounded-full flex-shrink-0" />
                    </div>
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
                </div>

                {/* 360 Tour skeleton */}
                <div className="mb-8">
                    <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-4" />
                    <div className="relative w-full bg-gray-900 rounded-2xl overflow-hidden shadow-2xl md:pb-[56.25%] pb-[133%]" />
                </div>

                {/* Specs skeleton */}
                <div className="mb-8">
                    <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-40 mb-4" />
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i}>
                                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-12 mb-2" />
                                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Facilities skeleton */}
                <div className="mb-8">
                    <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-36 mb-4" />
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
                        <div className="flex gap-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex-shrink-0 w-48 h-16 bg-gray-100 dark:bg-gray-700 rounded-lg" />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Technical services skeleton */}
                <div className="mb-8">
                    <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-64 mb-4" />
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 space-y-4">
                        <div className="h-20 bg-gray-100 dark:bg-gray-700 rounded-lg" />
                        <div className="h-20 bg-gray-100 dark:bg-gray-700 rounded-lg" />
                        <div className="h-20 bg-gray-100 dark:bg-gray-700 rounded-lg" />
                    </div>
                </div>
            </div>
        </main>
    );
}
