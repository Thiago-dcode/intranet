import React, { useEffect, useState } from "react";
import useAjax from "../../../hooks/useAjax";
import '../../assets/css/modules/eans.css'
import ls from 'localstorage-slim'
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import PopUp from "../../components/modules/eans/PopUp";
import EanSuccess from "../../components/modules/eans/EanSuccess";
import EanSearch from "../../components/modules/eans/EanSearch";
export default function Eans() {
  const navigate = useNavigate()

  const [url, setUrl] = useState(null)
  const [query, setQuery] = useState('');
  const [codarticulo, setCodArticulo] = useState('');
  const [proveedor, setProveedor] = useState('');
  const [searchParams] = useSearchParams();
  const [data, error, isPending, setConfig] = useAjax();
  const [update, errorUpdate, isPendingUpdate, setConfigUpdate] = useAjax();
  const [form, setForm] = useState(null);
  const [proveedores] = useAjax('/api/modules/eans/proveedores');
  const [eans, setEans] = useState(null);
  const [eanError, setEanError] = useState(null)
  const [eanSuccess, setEanSuccess] = useState(null)
  const [showPopUp, setShowPopUp] = useState(false)

  const handleSearch = (e) => {
    e.preventDefault()


    const newUrl= `/modules/eans?limit=${50}&codarticulo=${codarticulo}&proveedor=${proveedor}`

    if(url === newUrl ) return


    setUrl(newUrl);


  }

  const handleUpdate = (e) => {
    e.preventDefault()


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
    if (!eanError) return
    eanError?.data.forEach(ean => {
      const codBarraNuevoTd = document.getElementById(`${ean['num']}-CODBARRANUEVO`)
      if (codBarraNuevoTd) codBarraNuevoTd.classList.add('ean-error')


    });
    setShowPopUp(true)

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

      setEanSuccess(update.data);
    }
    if (errorUpdate) {

      setEanError(errorUpdate)
    }

  }, [update, errorUpdate])
  useEffect(() => {

    if (data && !error) {
      setEans(data);
      return;
    }


  }, [data, error]);

  useEffect(() => {
    console.log('hello')
    setUrl(`/modules/eans?limit=${50}&codarticulo=${codarticulo}&proveedor=${proveedor}`)

  }, [])
  useEffect(() => {
    console.log(url)
    if (!url) return
    setConfig('/api' + url)
  }, [url])



  useEffect(() => {

    if (eanSuccess) return

    navigate(`${query}`)


  }, [eanSuccess])


  return (
    <>
      {!eanSuccess ?



        (<div id="eans-module"
          className=" h-screen relative flex  items-center 
    flex-col gap-3 p-4"
        >

          {eanError ? <PopUp show={showPopUp} setShow={setShowPopUp} confirmMessage={'Actualizando...'} isPending={isPendingUpdate} message={eanError.message} handleConfirm={() => {
            const newForm = form.map(obj => {

              return { update: true, ...obj };

            })

            setForm(newForm);

          }} handleCancel={() => {
            setEanError(null)
            const codBarrasElements = document.querySelectorAll('.cod-barra-nuevo input')
            codBarrasElements.forEach(element => {
              element.readOnly = false;
            });
          }} /> : <EanSearch
            handleSearch={handleSearch}
            setCodArticulo={setCodArticulo}
            setProveedor={setProveedor}
            proveedores={proveedores}


          />
          }

          {!error && Array.isArray(eans) && eans.length > 0 && !isPending ? (
            <form onSubmit={(e) => {
              handleUpdate(e)
            }} className=" flex flex-col  h-3/4 items-center gap-3  z-10 w-full " >
              <div className="w-full  px-2  relative  overflow-auto gap-4">
                <table className="font-sans w-full text-sm rounded-lg border-collapse border border-slate-400">
                  <thead className=" py-2 sticky top-0 bg-bera-textil text-xs capitalize m-auto text-white">
                    <tr>
                      <th></th>

                      {Object.keys(eans[0]).map((key, i) => {
                        return <th id={i} className="">{key}</th>;
                      })}

                      <th>CODBARRAS NUEVO</th>
                    </tr>
                  </thead>
                  <tbody>

                    {eans.map((ean, i) => {
                      return (
                        <tr id={i} className="even:bg- odd:bg-white">
                          <td className=" border border-slate-300  text-xs  text-center w-2">{i + 1}</td>
                          {Object.entries(ean).map((value) => {
                            return (
                              <td className="border border-slate-300  text-center ">
                                <input name={`${i}-${value[0]}`} className=" text-xs" type="text" value={value[1]} />
                              </td>
                            );
                          })}
                          <td id={`${i}-CODBARRANUEVO`} className="  text-center cod-barra-nuevo border border-slate-300 ">
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
              {!eanError && <button type="submit " className="sticky bottom-0 bg-black text-white px-2">Actualizar</button>}


            </form>

          ) : (<div>{error?.message}</div>)}
          {isPending ? <div>Cargando</div> : null}
          {isPendingUpdate ? <div>Actualizando...</div> : null}

        </div>) : <EanSuccess handleSucess={setEanSuccess} num={eanSuccess.length} />}
    </>
  );
}
