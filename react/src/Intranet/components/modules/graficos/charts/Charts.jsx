import { config } from "@fortawesome/fontawesome-svg-core";
import React, { useEffect, useState } from "react";
//General imports
import {
    ResponsiveContainer,
    CartesianGrid,
    Legend,
    Tooltip,
    LabelList,
} from "recharts";
//Radial bar imports
import { RadialBarChart, RadialBar, PolarAngleAxis } from "recharts";
import { BarChart, Bar, XAxis, YAxis } from "recharts";
import { generateRandomColor, roundTo } from "../../../../../utils/Utils";

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


export function ChartRadial({ data, radialConfig }) {
    const [_data, setData] = useState(null);
    const [config, setConfig] = useState(null);
    const [colors, setColors] = useState([])


    const handleSetColors = () => {

        const color = generateRandomColor();

        if (!colors.includes(color)) {
            setColors(prev => [...prev, color])
            return color
        }
        return handleSetColors();

    }
    useEffect(() => {

        if (!radialConfig) {
            setConfig(null);
            return;
        }
        setConfig(JSON.parse(radialConfig));
    }, [radialConfig]);

    useEffect(() => {
        if (!config || !data) return;
        let newData = parseData(data, (key, d) => {

            d.fill = handleSetColors();

            if (config.bardata === key) d[key] = roundTo(d[key], 2);


            if (config.datakey === key) {

                d['name'] = d[key];

            }





        });
        console.log(config)
        newData.push({

            [config.bardata]: config.objetivo,
            name: config.nombre,
            fill: 'green'

        })
        setData(newData)


    }, [config]);

    useEffect(() => {

        console.log(_data)
    }, [_data])

    return (
        <>

            {_data && config && < ResponsiveContainer width={"100%"} height={"100%"}>
                <RadialBarChart
                    width={143}
                    height={143}
                    barGap={'0.5rem'}
                    data={_data}
                    label={{ fill: "#666", position: "insideStart" }}
                    innerRadius={"10%"}
                    outerRadius={"80%"}
                    barSize={30}
                    startAngle={0}
                    endAngle={180}
                >
                    <RadialBar

                        minAngle={180}
                        spacing={10}
                        background
                        dataKey={config.bardata}
                        label={{ fill: "white", position: "insideStart", fontSize: "1.2rem" }}
                    />
                    <Legend
                        iconSize={10}
                        width={120}

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
export function ChartBar({ data, barConfig }) {
    const [_data, setData] = useState(null);
    const [config, setConfig] = useState(null);

    useEffect(() => { }, [data]);
    useEffect(() => {
        if (!barConfig) {
            setConfig(null);
            return;
        }
        setConfig(JSON.parse(barConfig));
    }, [barConfig]);
    useEffect(() => {
        if (!config) return;

        setData(parseData(data, (key, d) => {

            for (let j = 0; j < config.data.length; j++) {
                const e = config.data[j];


                if (e.bardata !== key) continue

                d[key] = roundTo(d[key], 2);




            }


        }));
    }, [config]);

    return (
        <>
            {config && _data && (
                <ResponsiveContainer width={"100%"} height={"100%"}>
                    <BarChart
                        width={500}
                        margin={{ top: 1, right: 30, left: 20, bottom: 1 }}
                        data={_data}
                    >
                        <CartesianGrid stroke="#ccc" />
                        <XAxis
                            hide={true}
                            interval={0}
                            fontSize={"0.5rem"}
                            dataKey={config.datakey}
                            className="text-xs"
                        />
                        <YAxis
                            domain={[
                                Number.parseInt(config.min),
                                Number.parseInt(config.max),
                            ]}
                        />
                        <Tooltip />
                        <Legend />

                        {config.data.map((bar) => {
                            return (
                                <Bar dataKey={bar.bardata} fill={bar.color}>
                                    <LabelList
                                        fill="#fffff"
                                        enableBackground={true}
                                        color="white"
                                        fontSize={"0.8rem"}
                                        dataKey={config.bardata}
                                        position="insideTop"
                                    />
                                    <LabelList
                                        fontSize={"0.8rem"}
                                        dataKey={config.datakey}
                                        position="top"
                                    />
                                </Bar>
                            );
                        })}
                    </BarChart>
                </ResponsiveContainer>
            )}
        </>
    );
}
