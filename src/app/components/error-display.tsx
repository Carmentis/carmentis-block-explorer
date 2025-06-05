export const ErrorDisplay = ({error}: {error: unknown}) => {
    console.error(error);
    return (
        <div className="flex justify-center items-center min-h-[50vh]">
            <div className="bg-white rounded-lg shadow-md p-6 max-w-md w-full text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">An error occurred</h2>
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mt-4">
                    {typeof error === "string" ? error : "Unknown error"}
                </div>
            </div>
        </div>
    );
};
