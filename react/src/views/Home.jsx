import { useEffect, useState } from "react";
import { userStateContext } from "../Context/ContextProvider";
import mantenimiento from "../assets/img/mantenimiento.png";

export default function Home() {
  const state = userStateContext();
  useEffect(()=>{

    console.log(state)
  },[])
  return (
    <div className="bg-arzumaBlack text-cyan-500 h-screen">
      <img
        className="object-cover"
        src={mantenimiento}
        alt="En mantenimiento"
      />
      <p></p>
    </div>
  );
}
