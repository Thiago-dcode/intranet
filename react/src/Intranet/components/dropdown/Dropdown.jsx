import React from 'react'

export default function Dropdown({ Element = null, errors, classNameDrop = 'bg-black/70  rounded-md gap-2 p-2 w-full border-white', classNameBtn = 'bg-white flex items-center gap-2 px-2 rounded-md', id, title, children, arrow = true }) {

    const handleDropDown = () => {

        const classList = document.querySelector(`#${id} .container`).classList;
        if (!classList.contains('show')) {
            classList.add('show');
            return;
        }
        classList.remove('show')

    }
    return (
        <div id={id} className='relative flex flex-col gap-1 w-full items-start dropdown z-[99]'>
            <button onClick={(e) => {
                handleDropDown();
            }} type='button' className={classNameBtn}>{!Element ? (<span>{title}</span>): Element}{arrow && <i class="arrow down"></i>}</button>
            <div className='flex w-full flex-col'>
                <div className={` container absolute top-10 flex flex-col ${classNameDrop} `}>{children}</div>
                <div>
                    {errors && errors.map(error => {
                        return <p className='text-white'>{error}</p>
                    })}
                </div>

            </div>

        </div>
    )
}
