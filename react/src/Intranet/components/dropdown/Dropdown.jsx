import React from 'react'

export default function Dropdown({ classNameDrop = 'absolute top-10 bg-black/40  flex flex-col rounded-md gap-2 p-2 w-full container border-2 border-white', classNameBtn = 'flex items-center gap-5 bg-white px-2 rounded-md', id, title, children, arrow = true }) {

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
            }} type='button' className={classNameBtn}><span>{title}</span>{arrow && <i class="arrow down"></i>}</button>
            <div className={classNameDrop}>{children}</div>
        </div>
    )
}
