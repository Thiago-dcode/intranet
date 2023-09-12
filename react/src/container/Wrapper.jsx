import React, { ReactNode } from 'react';


const Wrapper= ({ children }) => {
    return (
        <main className=' overscroll-auto flex justify-center items-center h-screen bg-gray-100'>
          
                {children}
           
        </main>
    );
};

export default Wrapper;