import React, { useEffect, useState } from "react";
import useAjax from "../../../hooks/useAjax";
import '../../assets/css/modules/eans.css'
import ls from 'localstorage-slim'
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import EanError from "../../components/modules/eanError";
export default function Eans() {
  const navigate = useNavigate()

  const [url, setUrl] = useState(null)
  const [query, setQuery] = useState('');
  const [codarticulo, setCodArticulo] = useState(null);
  const [proveedor, setProveedor] = useState(null);
  const [searchParams] = useSearchParams();
  const [data, error, isPending, setFormData, setConfig] = useAjax();
  const [update, errorUpdate, isPendingUpdate, setFormUpdate, setConfigUpdate] = useAjax();
  const [form, setForm] = useState(null);
  const [proveedores] = useAjax('/api/modules/eans/proveedores');
  const [eans, setEans] = useState(null);
  const [eanError, setEanError] = useState(null)

  const handleSearch = (e) => {
    e.preventDefault()


    const codarticuloParam = searchParams.get('codarticulo');
    const proveedorParam = searchParams.get('proveedor');
    if (codarticuloParam !== codarticulo && proveedorParam !== proveedor) {
      setEans([])
      setEanError(null)
    }
    if (!proveedor & !codarticulo) {
      setQuery('')
      return
    }


    setQuery(`?limit=${50}&codarticulo=${codarticulo ? codarticulo : ''}&proveedor=${proveedor ? proveedor : ''}`);


  }
  const handleEanError = (e) => {

    e.preventDefault()
    const btn = e.nativeEvent.submitter;

    if (btn.name === 'cancelar') {
      setEanError(null)
      const codBarrasElements = document.querySelectorAll('.cod-barra-nuevo input')
      codBarrasElements.forEach(element => {
        element.readOnly = false;
      });
    }

  }
  const handleUpdate = (e) => {
    e.preventDefault()
    console.log(e.target)


    const inputsToSubmit = [];
    for (let i = 0; i < e.target.length; i++) {

      const [num, str] = e.target[i].name.split("-");
      if (str !== 'CODBARRANUEVO') continue

      if (!e.target[i].value) continue

      inputsToSubmit.push(num);


    }
    const toForm = [];
    for (let i = 0; i < inputsToSubmit.length; i++) {
      let obj = {


      }
      for (let f = 0; f < e.target.length; f++) {

        const [num, str] = e.target[f].name.split("-");
        if (num !== inputsToSubmit[i]) continue
        obj["num"] = num;
        obj[e.target[f].name] = e.target[f].value.trim()



      }
      if (Object.keys(obj).length === 0) continue


      toForm.push(obj);
    }

    setForm(toForm);

  }
  useEffect(() => {

    eanError?.data.forEach(ean => {
      const codBarraNuevoTd = document.getElementById(`${ean['num']}-CODBARRANUEVO`)
      if (codBarraNuevoTd) codBarraNuevoTd.classList.add('ean-error')




    });

  }, [eanError])

  useEffect(() => {

    if (!form || form.length < 1) return
    const codBarrasElements = document.querySelectorAll('.cod-barra-nuevo input')
    codBarrasElements.forEach(element => {
      element.readOnly = true;
    });
    setConfigUpdate('/api/modules/eans/update', form, 'POST');
  }, [form])

  useEffect(() => {
    if (update) {


    }
    if (errorUpdate) {

      setEanError(errorUpdate)
    }

  }, [update, errorUpdate])
  useEffect(() => {

    if (data && !error) {
      console.log(data)
      setEans(data);
      return;
    }


  }, [data, error]);

  useEffect(() => {

    const limit = searchParams.get('limit') ? searchParams.get('limit') : '';
    const codarticulo = searchParams.get('codarticulo') ? searchParams.get('codarticulo') : '';
    const proveedor = searchParams.get('proveedor') ? searchParams.get('proveedor') : '';

    setUrl("/modules/eans?limit=" + limit + "&codarticulo=" + codarticulo + '&proveedor=' + proveedor)

  }, [searchParams])
  useEffect(() => {
    setConfig('/api' + url)
  }, [url])

  useEffect(() => {


    navigate(`${query}`)


  }, [query])



  return (
    <>
      {!update ?



        (<div id="eans-module"
          className=" h-screen relative flex  items-center 
    flex-col gap-3 p-4"
        >

          {eanError ? <EanError error={eanError} handleEanError={handleEanError} /> : <form onSubmit={(e) => {
            handleSearch(e)
          }} method="GET" action="">
            <div class="col-12 text-end px-3">
              <div id="buscar">
                <input onChange={(e) => {
                  setCodArticulo(e.target.value)
                }} type="text" placeholder="CodArticulo" name="codArticulo" />
                <select onChange={(e) => {
                  setProveedor(e.target.value)
                }} class="select2" name="codProveedor" placeholder="Proveedor">
                  <option selected="selected" value="">
                    Proveedor
                  </option>
                  {proveedores && <>{proveedores.map(proveedor => {
                    if (proveedor.NOMBRECOMERCIAL) { return <option value={proveedor.CODIGO}>{proveedor.NOMBRECOMERCIAL}</option> }
                  })}</>}

                </select>
                <button type="submit">Buscar</button>
              </div>
            </div>
          </form>
          }

          {!error && Array.isArray(eans) && eans.length > 0 && !isPending ? (



            <form onSubmit={(e) => {
              handleUpdate(e)
            }} className=" flex flex-col items-center gap-3 h-full z-10 w-full " >
              <div className="w-full  h-3/4 px-2 border-4 relative  overflow-auto ">
                <table className="table-auto  font-sans w-full text-sm">
                  <thead className=" sticky top-0 bg-bera-textil text-xs capitalize m-auto text-white">
                    <tr>
                      <th></th>

                      {Object.keys(eans[0]).map((key) => {
                        return <th className="">{key}</th>;
                      })}

                      <th>CODBARRAS NUEVO</th>
                    </tr>
                  </thead>
                  <tbody>

                    {eans.map((ean, i) => {
                      return (
                        <tr id="" className="even:bg- odd:bg-white">
                          <td className=" text-xs  text-center w-2">{i + 1}</td>
                          {Object.entries(ean).map((value) => {
                            return (
                              <td className="text-center">
                                <input name={`${i}-${value[0]}`} className="  text-xs" type="text" value={value[1]} />
                              </td>
                            );
                          })}
                          <td id={`${i}-CODBARRANUEVO`} className="text-center cod-barra-nuevo">
                            <input onChange={(e) => {

                              document.getElementById(`${i}-CODBARRANUEVO`).classList.remove('ean-error')


                            }} name={`${i}-CODBARRANUEVO`} type="text w-full" placeholder="cod barra nuevo" />
                          </td>
                        </tr>
                      );
                    })}

                  </tbody>

                </table>
              </div>
              {!eanError && <button type="submit" className="sitcky bg-black text-white px-2">Actualizar</button>}


            </form>

          ) : (<div>{error?.message}</div>)}
          {isPending ? <div>Cargando</div> : null}

        </div>) : <div>Eans actualizados correctamente</div>}
    </>
  );
}
