import React from "react";

export default function PopUp({ id, isPending, message, handleSubmit, confirmMessage }) {


    return (
        <form id={id} onSubmit={(e) => {

            handleSubmit(e)

        }} className=" hidden flex-col items-center justify-between  p-2 absolute border z-[99] top-1/3 border-black bg-black/80 text-white rounded-md">

            <h1 className="font-semibold text-lg">{message}</h1>
            {!isPending ? <div className="flex items-center gap-10 mt-4">
                <button className="bg-red-500 px-2 py-1  border rounded-md " name="cancelar" type="submit">Cancelar</button>
                <button className="bg-bera-textil px-2 py-1  border rounded-md" name="confirmar" type="submit">Confirmar</button>

            </div> : <div className="flex items-center gap-10 mt-4"><p>{confirmMessage}</p></div>}



        </form>
    );
}
