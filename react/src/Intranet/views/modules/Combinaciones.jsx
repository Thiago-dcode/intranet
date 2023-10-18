import React, { useState } from 'react';
import Icon from '../../components/icon/Icon';
import PymeSearch from '../../components/pyme/PymeSearch';
import { useCompany } from '../../../Context/ContextProvider';
import { useEffect } from 'react';
import useAjax from '../../../hooks/useAjax';
import { roundTo } from '../../../utils/Utils';
import IsPending from '../../../components/pending/IsPending';
export default function Combinaciones() {

  const company = useCompany();
  const [combinaciones, setCombinaciones] = useState([]);
  const [codArticulo, setCodArticulo] = useState('');
  const [proveedor, setProveedor] = useState('');
  const [url, setUrl] = useState('')

  const [data, error, isPending, setConfig] = useAjax();

  const handleSearch = (e) => {
    e.preventDefault()

    const newUrl = `${company.name}/modules/combinaciones?codarticulo=${codArticulo}&proveedor=${proveedor}`

    setUrl(newUrl);


  }
  const handleArticulos = (articulo) => {

    setCodArticulo(articulo);
    setProveedor('');


  }
  const handleProveedor = (prov) => {

    setProveedor(prov);
    setCodArticulo('');
  }


  useEffect(() => {
    if (!url) return

    setConfig('/api/' + url)

  }, [url])
  useEffect(() => {

    if (data && !error) {

      setCombinaciones(data.data);
    }

  }, [data, error])

  useEffect(() => {

    if (!combinaciones) return
    // console.log(Object.keys(combinaciones[0]).map((key, i) => key))
    console.log(combinaciones)
  }, [combinaciones])

  return <div id="combinaciones-module"
    className=" h-screen relative flex  items-center 
flex-col gap-3 p-4"
  >
    <PymeSearch
      handleBtn={() => {

      }}
      isPending={isPending}
      handleSearch={handleSearch}
      setCodArticulo={handleArticulos}
      setProveedor={handleProveedor}
      codArticulo={codArticulo}
      proveedor={proveedor}



    />


    {Array.isArray(combinaciones) && combinaciones.length > 0 && !isPending ? <form onSubmit={(e) => {

    }} className=" flex flex-col  h-3/4 items-center gap-3  z-10 w-full " >
      <div className="w-full  px-2  relative  overflow-auto gap-4">
        <table className="font-sans w-full text-sm rounded-lg border-collapse border border-slate-400">
          <thead className=" py-2 sticky top-0 bg-bera-textil text-xs capitalize m-auto text-white">
            <tr>
              <th></th>

              {Object.keys(combinaciones[0]).map((key, i) => {
                return <th key={'th-combinaciones-' + key + '-' + i} id={'th-' + i} className="">{key}</th>;
              })}


            </tr>
          </thead>
          <tbody>
            {combinaciones.map((comb, _i) => {

              return (
                <tr key={'tr-combinaciones-' + _i} id={'tr-' + _i} className="even:bg- odd:bg-white">
                  <td className=" border border-slate-300  text-xs  text-center w-2">{_i + 1}</td>
                  {Object.entries(comb).map(([key, value], i) => {
                    return (
                      <td key={'td-combinaciones-' + key + '-' + i} id={"td-2-" + i} className="border border-slate-300  w-4 text-center ">
                        <input readOnly name={`${_i}-${key}`} className=" text-xs w-full" type="text" defaultValue={key === 'STOCK1' ? roundTo(value, 0) : value} />
                      </td>
                    );
                  })}

                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </form> : null}


  </div>;
}