import { config } from '@fortawesome/fontawesome-svg-core';
import React, { useEffect, useState } from 'react';
//General imports
import { ResponsiveContainer, CartesianGrid, Legend, Tooltip, LabelList } from 'recharts';
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
export function ChartBar({ data, barConfig }) {

    const [config, setConfig] = useState(null)


    useEffect(() => {
        console.log(data);
    }, [data])
    useEffect(() => {

        if (!barConfig) {

            setConfig(null)
            return
        }
        setConfig(JSON.parse(barConfig))
    }, [barConfig])
    useEffect(() => {


    }, [config])

    return (
        <>
            {config &&
                (<ResponsiveContainer width={'100%'} height={'100%'} >
                    <BarChart width={500}
                        margin={{ top: 1, right: 30, left: 20, bottom: 1 }}
                         data={data}>
                        <CartesianGrid stroke="#ccc" />
                        <XAxis text interval={0} fontSize={'0.5rem'} className='text-xs'  />
                        <YAxis domain={[Number.parseInt(config.min), Number.parseInt(config.max)]} />
                        <Tooltip />
                        <Legend />


                        {config.data.map(bar => {

                            return <Bar dataKey={bar.bardata} fill={bar.color} >



                                <LabelList fill='#fffff'  enableBackground={true} color='white' fontSize={'0.5rem'} dataKey={config.bardata} position="insideTop" />

                                <LabelList fontSize={'0.4rem'} dataKey={config.datakey} position="top" />
                            </Bar>
                        })}



                    </BarChart>

                </ResponsiveContainer>)}
        </>
    )
}
