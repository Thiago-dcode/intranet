import React, { useEffect } from "react";
import useAjax from "../../../hooks/useAjax";

export default function Eans() {
  const [eans, error, isPending] = useAjax("/api/modules/eans");

  useEffect(() => {
    // console.log(eans[0]);
  }, [eans, error]);
  return (
    <div
      className="overflow-scroll flex w-full items-center
    flex-col gap-6 mt-10"
    >
      <form action="">
        <div class="col-12 text-end px-3">
          <div id="buscar">
            <input type="text" placeholder="CodArticulo" name="codArticulo" />
            <select class="select2" name="codProveedor" placeholder="Proveedor">
              <option selected="selected" value="">
                -
              </option>

              <option value="{{ proveedor }}"></option>
            </select>
            <button id="btn-search" class="">
              Buscar
            </button>
          </div>
        </div>
      </form>

      {eans ? (
        
          <table>
            <thead>
              <tr>
                <th>FILA</th>

                {Object.keys(eans[0]).map((key) => {
                  return <th>{key}</th>;
                })}

                <th>CODBARRAS NUEVO</th>
              </tr>
            </thead>
            <tbody>
            <form action="">
              {eans.map((ean, i) => {
                return (
                  <tr>
                    <td>{i + 1}</td>
                    {Object.values(ean).map((value, i) => {
                      return (
                        <td>
                          <input type="text" readOnly value={value} />
                        </td>
                      );
                    })}
                    <td>
                      <input type="text" placeholder="cod barra nuevo" />
                    </td>
                  </tr>
                );
              })}
               </form>
            </tbody>
          </table>
       
      ) : null}
      {isPending && !error && !eans ? <div>Cargando</div> : null}
    </div>
  );
}
