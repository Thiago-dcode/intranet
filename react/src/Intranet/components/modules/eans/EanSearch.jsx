import React from 'react'

export default function EanSearch({ handleSearch, setCodArticulo, setProveedor, proveedores }) {
    return (
        <form onSubmit={(e) => {
            handleSearch(e)
        }} method="GET" action="">
            <div className="flex items-center gap-2">
                <div className='text-black border rounded-md border-black'>
               
                    <input className=' rounded-md outline-none text-center' id='codArticulo' onChange={(e) => {
                        setCodArticulo(e.target.value.trim().toUpperCase())
                    }} type="text" placeholder="CodArticulo" name="codArticulo" />
                </div>
                <div  className=' bg-white text-black border rounded-md border-black'>
               
                    <select  className=' bg-white text-sm w-36 rounded-md outline-none text-center' id='proveedor'  onChange={(e) => {
                        setProveedor(e.target.value.trim().toUpperCase())
                    }} name="codProveedor" placeholder="Proveedor">
                        <option selected="selected" value="">
                            Proveedor
                        </option>
                        {proveedores && <>{proveedores.map(proveedor => {
                            if (proveedor.NOMBRECOMERCIAL) { return <option value={proveedor.CODIGO}>{proveedor.NOMBRECOMERCIAL}</option> }
                        })}</>}

                    </select>
                </div>

                <button className='bg-bera-textil px-2 rounded-md text-white ' type="submit">Buscar</button>

            </div>
        </form>
    )
}
