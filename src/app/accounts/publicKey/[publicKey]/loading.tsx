import { PageTitle } from "@/app/components/pagetitle";

export default function Loading() {
    return (
        <div className="space-y-6">
            <PageTitle title="Account Details" />
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                    {/* Account State Loading */}
                    <div className="mb-8">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-start py-8">
                            <div className="flex flex-col items-center md:items-start">
                                <div className="h-4 bg-gray-200 rounded w-64 animate-pulse"></div>
                                <div className="h-4 bg-gray-200 rounded w-32 mt-2 animate-pulse"></div>
                            </div>

                            <div className="mt-6 md:mt-0">
                                <div className="h-6 bg-gray-200 rounded w-48 animate-pulse mb-4 mx-auto md:ml-auto"></div>
                                <div className="space-y-4">
                                    <div className="p-4 bg-gray-50 rounded-lg">
                                        <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                                        <div className="h-8 bg-gray-200 rounded w-32"></div>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-lg">
                                        <div className="h-4 bg-gray-200 rounded w-48 mb-2"></div>
                                        <div className="h-8 bg-gray-200 rounded w-40"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Transactions Loading */}
                    <div className="mt-8">
                        <div className="h-6 bg-gray-200 rounded w-48 animate-pulse mb-4"></div>
                        <div className="animate-pulse space-y-3">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="h-12 bg-gray-200 rounded"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
