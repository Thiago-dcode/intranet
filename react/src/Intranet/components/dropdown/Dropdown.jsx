import React from 'react'

export default function Dropdown({ Element = null, errors, classNameDrop = 'bg-black/70  rounded-md gap-2 p-2 w-full border-white', classNameBtn = 'bg-white flex items-center gap-2 px-2 rounded-md', id, title, children, arrow = true }) {

    const handleDropDown = () => {
        const element = document.querySelector(`#${id} .container`)
        const classList = element.classList;

        const dropDowns = document.querySelectorAll('.dropdown');
        if (classList.contains('class-' + id)) {
            const split = `class-${id}`.split('-')
            const isConfig = split.includes('config');
            const isEdit = split.includes('edit');
           const isView = split.includes('view')
        //    console.log(isView)
            if (isConfig) {
                console.log(document.querySelector(`.class-${id}`.replace('config','edit')+'.container'))

                document.querySelector(`.class-${id}`.replace('config','edit')+'.container').classList.remove('show')
                // document.querySelector(`.class-${id}`.replace('config','view')+'.container').classList.remove('show')
            }
            if (isEdit) {


                document.querySelector(`.class-${id}`.replace('edit','config')+'.container').classList.remove('show')
                // document.querySelector(`.class-${id}`.replace('edit','view')+'.container').classList.remove('show')
            }
            // if(isView){
            //     document.querySelector(`.class-${id}`.replace('view','config')+'.container').classList.remove('show')
            //     document.querySelector(`.class-${id}`.replace('view','edit')+'.container').classList.remove('show')
            // }
        }

        if (!classList.contains('show')) {


            classList.add('show');
            for (let i = 0; i < dropDowns.length; i++) {
                const element = dropDowns[i];

                if (element.id === id) {
                    element.style.zIndex = 98
                    continue
                }
                element.style.zIndex = 97
            }
            return;
        }
        classList.remove('show')

    }

    return (
        <div id={id} className={`relative flex flex-col w-full  items-start dropdown class-${id} z-[98]`}>
            <button onClick={(e) => {
                handleDropDown();
            }} type='button' className={`${classNameBtn}`}>{!Element ? (<span>{title}</span>) : Element}{arrow && <i class="arrow down"></i>}</button>
            <div className='flex flex-col'>
                <div className={`${classNameDrop} class-${id} z-[96] items-start container absolute top-10 flex flex-col`}>{children}</div>
                <div>
                    {errors && errors.map((error, i) => {
                        return <p id={`dropdown-error-${i}`} className='text-white'>{error}</p>
                    })}
                </div>

            </div>

        </div>
    )
}
