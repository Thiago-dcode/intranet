import React, { ReactNode } from 'react';

interface WrapperProps {
    children: ReactNode;
}

const Wrapper: React.FC<WrapperProps> = ({ children }) => {
    return (
        <main className='flex justify-center items-center h-screen bg-gray-100'>
            <div className=''>
                {children}
            </div>
        </main>
    );
};

export default Wrapper;