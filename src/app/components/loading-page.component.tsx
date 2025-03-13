import React from 'react';

interface SpinnerProps {
    text?: string;
}

const Spinner: React.FC<SpinnerProps> = ({text}) => {
    return (
        <div className="flex items-center justify-center h-screen">
            <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
                {text && <p className="mt-4 text-gray-600">{text}</p>}
            </div>
        </div>
    );
};

export default Spinner;