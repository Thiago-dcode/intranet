import React, { useEffect } from 'react';
//General imports
import { ResponsiveContainer, CartesianGrid, Legend, Tooltip } from 'recharts';
//Radial bar imports
import { RadialBarChart, RadialBar } from 'recharts'
import { BarChart, Bar, XAxis, YAxis } from 'recharts'


const example = [

    { name: 'data 1', x: 9, fill: 'red' },
    { name: 'data 2', x: 9, fill: 'green' },
    { name: 'data 3', x: 2, fill: 'blue' },
];

export function ChartRadial({ data }) {



    useEffect(() => {


    }, [data])

    return (

        <ResponsiveContainer width={'100%'} height={'100%'} >
            <RadialBarChart

                width={730}
                height={250}
                innerRadius="40%"
                outerRadius="50%"
                data={example}

                startAngle={360}
                endAngle={0}>
                <RadialBar cx="50%" cy="50%" minAngle={20} label={{ fill: '#666', position: 'insideTop' }} background clockWise={true} dataKey='x' />

                <Legend iconSize={10} width={120} height={140} layout='vertical' verticalAlign='middle' align="right" />
                <Tooltip />
            </RadialBarChart>
        </ResponsiveContainer>
    )
}
export function ChartBar({ data, barConfig = {
    dataKey: 'Comercial',
    min: 0,
    max: 250000,

    data: [
       { barData: 'Ventas 1', color: 'red'}
    ],

} }) {


    useEffect(() => {
        console.log(data);
    }, [data])

    return (

        <ResponsiveContainer width={'100%'} height={'100%'} >
            <BarChart width={500}
                height={300} data={data}>
                <CartesianGrid stroke="#ccc" />
                <XAxis label={{ position: "inside", dy: 10 }} text interval={0} fontSize={'0.5rem'} className='text-xs' dataKey={barConfig.dataKey} />
                <YAxis domain={[barConfig.min, barConfig.max]} />
                <Tooltip />
                <Legend />


                {barConfig.data.map(bar => {
                  
                     return <Bar dataKey={bar.barData} fill={bar.color} />
                })}



            </BarChart>
        </ResponsiveContainer>
    )
}
