import Articulos from "./Intranet/views/modules/Articulos";
import Eans from "./Intranet/views/modules/Eans";
import Graficos from "./Intranet/views/modules/Graficos";

export const modules = [
  {
    path: "articulos",
    element: <Articulos />,
  },

  {
    path: "articulos/eans",
    element: <Eans />,
  },
  {
    path: "graficos",
    element: <Graficos />,
  },
];
