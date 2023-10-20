import React, { useState } from 'react';
import Icon from '../../components/icon/Icon';
import '../../assets/css/modules/combinaciones.css'
import PymeSearch from '../../components/pyme/PymeSearch';
import { useCompany } from '../../../Context/ContextProvider';
import { useEffect } from 'react';
import useAjax from '../../../hooks/useAjax';
import Button from '../../components/button/Button';
import IsPending from '../../../components/pending/IsPending';
import RenderTd from '../../components/modules/combinaciones/RenderTd';
export default function Combinaciones() {

  const company = useCompany();
  const [combinaciones, setCombinaciones] = useState([]);
  const [codArticulo, setCodArticulo] = useState('');
  const [proveedor, setProveedor] = useState('');
  const [url, setUrl] = useState('')
  const [updateForm, setUpdateForm] = useState({});

  const [data, error, isPending, setConfig] = useAjax();

  const handleSearch = (e) => {
    e.preventDefault()

    const newUrl = `${company.name}/modules/combinaciones?codarticulo=${codArticulo}&proveedor=${proveedor}`
    console.log(newUrl);
    setUrl(newUrl);


  }
  const handleSubmitUpdate = (e) => {
    e.preventDefault()

    let rows = [];
    for (let i = 0; i < e.target.length; i++) {
      const element = e.target[i];
      const [index, name] = element.name.split("-")

      if (rows.includes(parseInt(index))) continue;

      rows.push(parseInt(index));
    }

    let form = [];
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      if (isNaN(row)) continue;
      let obj = {}

      for (let j = 0; j < e.target.length; j++) {
        const element = e.target[j];

        const [index, key] = element.name.split("-")

        if (isNaN(parseInt(index))) continue;
        if (parseInt(index) !== row) continue;

        obj[key] = element.value;


      }
      form.push(obj);

    }
    console.log(form);

  }

  const handleUpdateForm = (row, key, value) => {


    console.log(row, key, value);

    let obj = updateForm;

    obj[row] = value;


    setUpdateForm(obj);

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
  useEffect(() => {



  }, [updateForm])

  return <div id="combinaciones-module"
    className="table-pyme h-screen relative flex w-full  items-center 
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
      handleSubmitUpdate(e)


    }} className=" flex flex-col  h-3/4 items-center gap-3  z-10 w-full " >
      <div className="w-full  px-2  relative  overflow-auto gap-4">
        <table className="font-sans w-full text-sm rounded-lg border-collapse border border-slate-400">
          <thead className=" py-2 sticky top-0 bg-bera-textil text-xs capitalize m-auto text-white">
            <tr>
              <th></th>

              {Object.keys(combinaciones[0]).map((_key, i) => {

                const key = _key.split('_');
                return <th key={'th-combinaciones-' + + '-' + i} id={'th-' + i} className="px-2 text-sm">{key.length > 1 ? key[1] : key[0]}</th>;


              })}


            </tr>
          </thead>
          <tbody>
            {combinaciones.map((comb, _i) => {

              return (
                <tr key={'tr-combinaciones-' + _i} id={'tr-' + _i} className="h-9 pb-2 odd:bg-white">
                  <td className=" border border-slate-300  text-xs  text-center w-2">{_i + 1}</td>
                  {Object.entries(comb).map(([key, value], i) => {

                    return (
                      <RenderTd company={company} handleForm={handleUpdateForm} i={_i} key={'td-combinaciones-' + key + '-' + i} _key={key} value={value} />
                    );

                  })}

                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {!error && !isPending ? <Button type="submit" content="Actualizar" /> : <div className=' flex  flex-row  items-start justify-start'><IsPending size="25" color={company.color} /></div>}
    </form> : null}


  </div>;
}