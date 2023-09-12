import { useParams } from "react-router-dom";
export default function Home() {
  const { company } = useParams();
  return (
    <div className="bg-arzumaBlack text-cyan-500 h-screen">
      <p>Hola {company}, bienvenido a la Intranet</p>
    </div>
  );
}
