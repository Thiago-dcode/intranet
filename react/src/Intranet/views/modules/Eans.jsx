import React, { useEffect, useState } from "react";
import useAjax from "../../../hooks/useAjax";
import '../../assets/css/modules/eans.css'
import { Link, useSearchParams } from "react-router-dom";
export default function Eans() {
  const [url, setUrl] = useState(null)
  const [query, setQuery] = useState('');
  const [codarticulo, setCodArticulo] = useState(null);
  const [proveedor, setProveedor] = useState(null);
  const [searchParams] = useSearchParams();
  const [data, error, isPending, setForm, setConfig] = useAjax();
  const [eans, setEans] = useState(null);

  useEffect(() => {
    if (data && !error) {
      setEans(data);
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
    console.log(codarticulo)
    setQuery(`?limit=${50}&codarticulo=${codarticulo?codarticulo:''}&proveedor=${proveedor?proveedor:''}`);

  }, [codarticulo, proveedor])

  return (
    <div id="eans-module"
      className=" h-screen  flex  items-center 
    flex-col gap-3 p-4"
    >
      <form method="GET" action="">
        <div class="col-12 text-end px-3">
          <div id="buscar">
            <input onChange={(e) => {
              setCodArticulo(e.target.value)
            }} type="text" placeholder="CodArticulo" name="codArticulo" />
            <select onChange={(e) => {
              setProveedor(e.target.value)
            }} class="select2" name="codProveedor" placeholder="Proveedor">
              <option selected="selected" value="">
                -
              </option>

              <option value="{{ proveedor }}"></option>
            </select>
            <Link to={query}>
              Buscar
            </Link>
          </div>
        </div>
      </form>

      {eans ? (



        <form className=" flex flex-col items-center gap-3 h-full  w-full " >
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
                    <tr className="even:bg- odd:bg-white">
                      <td className=" text-xs  text-center w-2">{i + 1}</td>
                      {Object.values(ean).map((value, i) => {
                        return (
                          <td className="text-center">
                            <input className="  text-xs" type="text" value={value} />
                          </td>
                        );
                      })}
                      <td className="text-center cod-barra-nuevo">
                        <input type="text w-full" placeholder="cod barra nuevo" />
                      </td>
                    </tr>
                  );
                })}

              </tbody>

            </table>
          </div>
          <button type="submit" className="sitcky bg-black text-white px-2">Actualizar</button>

        </form>

      ) : null}
      {isPending && !error && !eans ? <div>Cargando</div> : null}

    </div>
  );
}
