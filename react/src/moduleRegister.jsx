import Clientes from './Intranet/views/modules/Clientes';
import Eans from './Intranet/views/modules/Eans';
import Articulos from './Intranet/views/modules/Articulos';
import Graficos from './Intranet/views/modules/Graficos';
import Email from './Intranet/views/modules/Email';

 export const modules = [
{
 path: 'clientes' ,
element: <Clientes />,
},
{
 path: 'eans' ,
element: <Eans />,
},
{
 path: 'articulos' ,
element: <Articulos />,
},
{
 path: 'graficos' ,
element: <Graficos />,
},
{
 path: 'email' ,
element: <Email />,
},
];
