import React from 'react'
import useAjax from '../../../hooks/useAjax';
import { useCompany } from '../../../Context/ContextProvider';
import { useEffect } from 'react';
import IsPending from '../../../components/pending/IsPending';
export default function PymeSearch({ isPending, handleBtn, handleSearch, setCodArticulo, setProveedor, codArticulo = '', proveedor = '' }) {
    const company = useCompany();
    const [proveedores, error, _isPending, setConfig] = useAjax();

    useEffect(() => {
        if (!company) return
        setConfig(`/api/${company.name}/modules/eans/proveedores`)

    }, [company])
    return (
        <>
            <form onSubmit={(e) => {
                handleSearch(e)
            }} method="GET" action="">
                <div className="flex lg:flex-row xl:flex-row flex-col items-center gap-2">
                    <div className='text-black border rounded-md border-black'>

                        <input defaultValue={codArticulo} className=' rounded-md outline-none text-center' id='codArticulo' onChange={(e) => {
                            setCodArticulo(e.target.value.trim().toUpperCase())
                        }} type="text" placeholder="CodArticulo" name="codArticulo" />
                    </div>
                    <div className=' bg-white text-black border rounded-md border-black'>

                        <select defaultValue={proveedor} className=' bg-white text-sm w-36 rounded-md outline-none text-center' id='proveedor' onChange={(e) => {

                            setProveedor(e.target.value.trim().toUpperCase())
                        }} name="codProveedor" placeholder="Proveedor">
                            <option value={''} >
                                Proveedor
                            </option>
                            {proveedores && <>{proveedores.map((_proveedor, i) => {
                                if (_proveedor.NOMBRECOMERCIAL) { return <option key={`proveedor-option-${i}`} id={`proveedor-option-${i}`} value={_proveedor.CODIGO}>{_proveedor.NOMBRECOMERCIAL}</option> }
                            })}</>}

                        </select>
                    </div>

                    {!isPending ? <button onClick={(e) => {
                        handleBtn(e)
                    }} name='search' className='bg-bera-textil px-2 rounded-md text-white ' type="submit">Buscar</button> : <IsPending size='24' color='bg-bera-textil' />}

                </div>
            </form></>
    )
}
