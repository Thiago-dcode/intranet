import { useEffect } from "react";
import useAjax from "../../hooks/useAjax";
import { Link } from "react-router-dom";

export default function Middle() {
  const [user, error, isPending] = useAjax("/api/me");

  useEffect(() => {
    console.log(user);
  }, [isPending]);

  return (
    <>
      {!isPending && user ? (
        <div className="flex flex-col items-center gap-3 relative -top-20">
          <h1 >Hola {user.name}</h1>
          <div className="flex gap-3">
            {user.companies.map((company) => {
              return <Link style={{background:company.color}} className="p-1 text-white rounded-md" to={`/${company.name}`}>{company.name} </Link>;
            })}
          </div>
        </div>
      ) : null}
    </>
  );
}
