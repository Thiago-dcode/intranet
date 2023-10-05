import { config } from "@fortawesome/fontawesome-svg-core";
import React, { useEffect, useState, useMemo } from "react";
//General imports
import {
    ResponsiveContainer,
    CartesianGrid,
    Legend,
    Tooltip,
    LabelList,
    Text
} from "recharts";
//Radial bar imports
import { RadialBarChart, RadialBar } from "recharts";
import { BarChart, Bar, XAxis, YAxis, Cell } from "recharts";
import { capitalize, generateRandomColor, maxWords, roundTo } from "../../../../../utils/Utils";
import { data } from "autoprefixer";

const parseData = (data, callback) => {

    let newData = [];
    data.forEach((d) => {
        let newD = d;
        for (let i = 0; i < Object.keys(d).length; i++) {
            const key = Object.keys(d)[i];


            callback(key, newD)


        }
        newData.push(newD);
    });
    return newData;

};


export function ChartRadial({ chart }) {
    const [_data, setData] = useState(null);
    const [config, setConfig] = useState(null);
    const [colors, setColors] = useState(['#0CD967'])


    const handleSetColors = () => {

        const color = generateRandomColor();

        if (!colors.includes(color)) {
            setColors(prev => [...prev, color])
            return color
        }
        return handleSetColors();

    }
    useEffect(() => {

        if (!chart.config) {
            setConfig(null);
            return;
        }
        setConfig(JSON.parse(chart.config));
    }, [chart.config]);

    useEffect(() => {


        if (!config || !chart.data) return;

        let data = { ...chart.data[0] }
        data[config.datakey] = roundTo(data[config.datakey], 2)


        let newData = [
            {
                ...data,

                name: config.comparar
            },

            {

                [config.datakey]: config.objetivo,
                name: config.nombre,
                fill: '#0CD967'

            }
        ]
        console.log(config)

        setData(newData)


    }, [config]);

    useEffect(() => {

        console.log(_data)
    }, [_data])

    return (
        <>

            {_data && config && < ResponsiveContainer width={"100%"} height={"100%"}>

                <RadialBarChart
                    cx='50%'
                    cy='50%'
                    width={100}
                    height={100}
                    barGap={'0.5rem'}
                    data={_data}
                    label={{ fill: "#666", position: "insideStart" }}
                    innerRadius={"50%"}
                    outerRadius={"80%"}
                    barSize={30}

                    startAngle={180}
                    endAngle={0}
                >
                    <RadialBar

                        endAngle={180}
                        startAngle={0}
                        minAngle={0}
                        spacing={10}
                        background
                        dataKey={config.datakey}
                        label={{ fill: "white", position: "insideStart", fontSize: "0.8rem" }}
                    />
                    <Legend


                        iconSize={10}
                        width={'100%'}
                        fontSizeAdjust={"0.8rem"}
                        fontSize={'0.6rem'}
                        layout="horizontal"
                        verticalAlign="top"
                        align="center"
                    />
                    <Tooltip />
                </RadialBarChart>
            </ResponsiveContainer >}
        </>
    );
}
const YAxisLeftTick = ({ y, payload: { value } }) => {
    return (
        <Text x={0} y={y} fontSize={'0.5rem'} textAnchor="start" verticalAnchor="middle" >
            {maxWords(value, 2)}
        </Text>
    );
};
let ctx;
export const measureText14HelveticaNeue = text => {
    if (!ctx) {
        ctx = document.createElement("canvas").getContext("2d");
        ctx.font = "8px 'Helvetica Neue";
    }

    return ctx.measureText(text).width;
};

const BAR_AXIS_SPACE = 10;
export function ChartBar({ chart }) {
    const [_data, setData] = useState(null);
    const [config, setConfig] = useState(null);

    useEffect(() => {
        if (!chart.config) {
            setConfig(null);
            return;
        }
        setConfig(JSON.parse(chart.config));
    }, [chart]);
    useEffect(() => {
        if (!config) return;
        console.log(config)
        setData(parseData(chart.data, (key, d) => {

            for (let j = 0; j < config?.data?.length; j++) {
                const e = config.data[j];


                if (e.bardata !== key) continue

                d[key] = roundTo(d[key], 2);




            }


        }));
    }, [config]);
    useEffect(() => { console.log(_data) }, [_data])

    return (
        <>
            {config && _data && (
                <ResponsiveContainer width={"100%"} height={'100%'}  >
                    <BarChart
                        layout="vertical"
                        width={500}

                        margin={{ right: 1, left: 40, bottom: 1 }}
                        data={_data}

                    >

                        <CartesianGrid stroke="#ccc" />
                        <XAxis

                            hide
                            type="number"
                            axisLine={false}
                            tickLine={false}
                            domain={[
                                Number.parseInt(config.min),
                                Number.parseInt(config.max),
                            ]}

                        />
                        <YAxis
                            yAxisId={0}
                            dataKey={config.datakey}
                            type="category"
                            fill="black"
                            fontSize={'0.5rem'}
                            axisLine={false}
                            tickLine={false}
                            tick={YAxisLeftTick}
                        />
                        <YAxis
                            orientation="right"
                            yAxisId={1}
                            fill="black"
                            fontSize={'0.8rem'}
                            dataKey={config.data[0].bardata}
                            type="category"
                            axisLine={false}
                            tickLine={false}
                            tickFormatter={value => value.toLocaleString()}
                            mirror

                            tick={{
                                transform: `translate(${-5 + BAR_AXIS_SPACE}, 0)`
                            }}

                        />
                        <Tooltip />
                        <Legend />

                        {config.data.map((bar) => {
                            return (
                                <Bar dataKey={bar.bardata} minPointSize={2} >

                                    {_data.map((d, idx) => {
                                        return <Cell key={d[bar.bardata]} fill={generateRandomColor()} />;
                                    })}
                                </Bar>
                            );
                        })}
                    </BarChart>
                </ResponsiveContainer>
            )}
        </>
    );
}
