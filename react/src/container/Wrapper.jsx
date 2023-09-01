import React, { ReactNode } from 'react';


const Wrapper= ({ children }) => {
    return (
        <main className=' overscroll-auto flex justify-center items-center h-screen bg-gray-100'>
            <div className=''>
                {children}
            </div>
        </main>
    );
};

export default Wrapper;