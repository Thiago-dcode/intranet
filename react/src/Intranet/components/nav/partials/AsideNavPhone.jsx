import React, { useEffect, useState } from 'react'
import Icon from '../../icon/Icon'
import NavLink from '../NavLink';
import { capitalize } from '../../../../utils/Utils';
export default function AsideNavPhone({ company, modules, setModule }) {
    const [display, setDisplay] = useState(false);


    useEffect(() => {
        const main = document.getElementById('intranet-main')
        const mainW = main.style.width;
        // if (display) {

        //     main.style.marginLeft = '5rem'
        //     main.style.width = '825px';
        //     console.log(main.style.width)
        //     return
        // }
        // main.style.marginLeft = '0'
        // main.style.width = '100%'

    }, [display])

    return (
        <>
            <div className="lg:hidden xl:hidden z-50 absolute top-0  mt-14 left-1 btn-mobile">

                <button onClick={() => {

                    setDisplay(!display)

                }} className="btn-mobile bg-white px-1  border border-black/70 hover:cursor-pointer  rounded-sm"><Icon className={'btn-mobile'} color='black' icon={display ? 'ArrowLeft' : 'ArrowRight'} /></button>
            </div>
            {display && <aside className=" z-[99] mt-[5.5rem] text-xs top-0 text-nav fixed  h-screen flex  flex-col items-center justify-between border-r-slate-400 bg-white shadow-md ">
                <nav className="overflow-auto  w-full mt-4 h-full flex flex-col gap-5 px-3">
                    {modules.map((module) => {
                        return (
                            <NavLink to={`/${company}/${module.route}`}>
                                <Icon icon={module.logo} />
                                <button
                                    onClick={(e) => {
                                        setModule(module.name);
                                    }}
                                    className=" text-center"
                                >
                                    {capitalize(module.name)}
                                </button>

                            </NavLink>
                        );
                    })}
                </nav>
                <div className=" hidden border-t border-t-slate-400 w-full lg:flex  xl:flex  items-center justify-center">
                    <button className="">expand</button>
                </div>
            </aside>}
        </>
    )
}
