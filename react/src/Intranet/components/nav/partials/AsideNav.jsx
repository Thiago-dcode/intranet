import React from 'react'
import { capitalize } from '../../../../utils/Utils';
import NavLink from '../NavLink';
import Icon from '../../icon/Icon';
export const AsideNav = ({ company, modules, setModule }) => {
    return (
        <aside className="z-30 text-xs top-0 text-nav fixed  h-screen flex  flex-col w-40 items-center justify-between border-r-slate-400 bg-white shadow-md ">
            <nav className="overflow-auto mt-16 w-full h-full flex flex-col gap-3 px-5">
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
        </aside>
    )
}
