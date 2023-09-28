import React from 'react';
import useAjax from '../../../hooks/useAjax';
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar } from 'recharts'
const data = [
    {
        name: 'Page A',
        uv: 4000,
        pv: 2400,
        amt: 2400,
    },
    {
        name: 'Page B',
        uv: 3000,
        pv: 1398,
        amt: 2210,
    },
    {
        name: 'Page C',
        uv: 2000,


    },
    {
        name: 'Page D',
        uv: 2780,
        pv: 3908,
        amt: 2000,
    },
    {
        name: 'Page E',
        uv: 1890,
        pv: 4800,
        amt: 2181,
    },
    {
        name: 'Page F',
        uv: 2390,
        pv: 3800,
        amt: 2500,
    },
    {
        name: 'Page G',
        uv: 3490,
        pv: 4300,
        amt: 2100,
    },
];

export default function Graficos() {

    const [chartTypes, chartTypesError, isPending] = useAjax('/api/modules/graficos/types');


    return (

        <div className='px-5 flex flex-col items-center justify-center w-full h-full gap-4'>
            <h2>Graficos</h2>
            <div className='w-1/3 self-start '>
                {/* <button className=''>Nuevo chart</button> */}
                <form className="flex flex-col items-center  w-full gap-4">
                    <div className='flex flex-col gap-1 w-full'>
                        <label htmlFor="grafico">Tipo de Gráfico</label>
                        <select className='bg-white py-2 px-2' name="grafico" id="grafico"><option value="barras">barras</option></select>
                    </div>
                    <div className='flex flex-col gap-1 w-full'>
                        <label htmlFor="sql">SQL</label>
                        <textarea placeholder="Escribe tu SQL" name="sql" id="sql" cols="5" rows="5"></textarea>
                    </div>

                    <button className=' border-white bg-arzumaRed w-20 rounded-md text-white'>Crear</button>
                </form>
            </div>
            <div className='flex w-full h-full '>
                <ResponsiveContainer width="50%" height="50%">
                    <BarChart width={500}
                        height={300}
                        data={data}
                        margin={{
                            top: 5,
                            right: 5,
                            left: 5,
                            bottom: 5,
                        }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="pv" fill="#8884d8" />
                        <Bar dataKey="uv" fill="#82ca9d" />
                    </BarChart>
                </ResponsiveContainer>

                <ResponsiveContainer width="50%" height="50%">
                    <BarChart width={500}
                        height={300}
                        data={data}
                        margin={{
                            top: 5,
                            right: 0,
                            left: 0,
                            bottom: 5,
                        }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="pv" fill="#8884d8" />
                        <Bar dataKey="uv" fill="#82ca9d" />
                        <Bar dataKey="amt" fill="#fffff" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}
