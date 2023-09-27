import React from "react";

export default function EanError({ error, handleEanError }) {


    return (
        <form onSubmit={(e) => {

            handleEanError(e)
        }} className=" flex flex-col items-center justify-between  p-2 absolute border z-[99] top-1/3 border-black bg-black/80 text-white">

            <h1 className="font-semibold text-lg">{error.message}</h1>
            <div className="flex items-center gap-10 mt-4">
                <button className="bg-red-500 px-2 py-1  border rounded-sm" name="cancelar" type="submit">Cancelar</button>
                <button className="bg-bera-textil px-2 py-1  border rounded-sm" name="confirmar" type="submit">Confirmar</button>

            </div>



        </form>
    );
}
