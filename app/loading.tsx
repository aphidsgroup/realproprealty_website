export default function HomeLoading() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
            <div className="container mx-auto px-4 py-8 max-w-2xl animate-pulse">
                {/* Logo skeleton */}
                <div className="text-center mb-8">
                    <div className="w-32 h-32 mx-auto bg-gray-200 dark:bg-gray-700 rounded-full mb-4" />
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-3/4 mx-auto mb-2" />
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-lg w-1/2 mx-auto" />
                </div>

                {/* Search bar skeleton */}
                <div className="h-14 bg-white dark:bg-gray-800 rounded-xl shadow-md mb-6" />

                {/* CTA buttons skeleton */}
                <div className="space-y-4 mb-8">
                    <div className="h-14 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
                    <div className="h-14 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
                    <div className="grid grid-cols-2 gap-4">
                        <div className="h-14 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
                        <div className="h-14 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
                    </div>
                </div>

                {/* Featured properties skeleton */}
                <div className="mb-8">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-4" />
                    <div className="h-64 bg-white dark:bg-gray-800 rounded-2xl shadow-md" />
                </div>

                {/* Browse by type skeleton */}
                <div className="mb-8">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-40 mb-4" />
                    <div className="grid grid-cols-2 gap-4">
                        <div className="h-24 bg-white dark:bg-gray-800 rounded-xl shadow-md" />
                        <div className="h-24 bg-white dark:bg-gray-800 rounded-xl shadow-md" />
                    </div>
                </div>
            </div>
        </main>
    );
}
