import React from 'react'

export default function Dropdown({ Element = null, errors, classNameDrop = 'bg-black/70  rounded-md gap-2 p-2 w-full border-white', classNameBtn = 'bg-white flex items-center gap-2 px-2 rounded-md', id, title, children, arrow = true }) {

    const handleDropDown = () => {

        const classList = document.querySelector(`#${id} .container`).classList;
        const dropDowns = document.querySelectorAll('.dropdown');
        if (!classList.contains('show')) {


            classList.add('show');
            for (let i = 0; i < dropDowns.length; i++) {
                const element = dropDowns[i];

                if (element.id === id) {
                    element.style.zIndex = 99
                    continue
                }
                element.style.zIndex = 98
            }
            return;
        }
        classList.remove('show')

    }

    return (
        <div id={id} className={`relative flex flex-col w-full  items-start dropdown class-${id} z-[99]`}>
            <button onClick={(e) => {
                handleDropDown();
            }} type='button' className={`${classNameBtn}`}>{!Element ? (<span>{title}</span>) : Element}{arrow && <i class="arrow down"></i>}</button>
            <div className='flex flex-col'>
                <div className={`${classNameDrop}  z-[99] items-start container absolute top-10 flex flex-col`}>{children}</div>
                <div>
                    {errors && errors.map((error, i) => {
                        return <p id={`dropdown-error-${i}`} className='text-white'>{error}</p>
                    })}
                </div>

            </div>

        </div>
    )
}
