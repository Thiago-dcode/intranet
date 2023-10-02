import React, { useEffect, useState } from 'react';
import '../../assets/css/modules/graficos.css'
import useAjax from '../../../hooks/useAjax';
import Dropdown from '../../components/dropdown/Dropdown';
import { ChartBar, ChartRadial } from '../../components/modules/graficos/charts/Charts';
import ChartWrapper from '../../components/modules/graficos/charts/ChartWrapper';
import GraficosForm from '../../components/modules/graficos/GraficosForm';
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


    const [userCharts, userChartsError, isPendingUserCharts] = useAjax('/api/modules/graficos');
    const [charts, setCharts] = useState(null);
    const [newChart, newChartError, isPendingNewChart, setConfigNewChart] = useAjax();



    useEffect(() => {

        if (userCharts) {
            setCharts(userCharts.data)
        }
        if (userChartsError) {
            console.log(userChartsError)
        }



    }, [userCharts, userChartsError])

    useEffect(() => {

        if (newChart) {
            if (!newChartError) {
                if (!userCharts) setCharts([...newChart.data]);

                setCharts(prevData => {
                    let exist = false
                    for (let i = 0; i < prevData.length; i++) {
                        const element = prevData[i];

                        if (element.id === newChart.data.id) {
                            exist === true
                            break;
                        }

                    }
                    if (!exist) return
                    { [newChart.data, ...prevData] }
                })
            }
        }
        if (newChartError) {
            console.log(newChartError)
        }


    }, [newChart, newChartError])
    return (

        <div className='px-5 flex flex-col items-center justify-between w-full h-full gap-4'>

            <div className='w-1/3 self-baseline mt-20'>
                <Dropdown arrow={false} classNameBtn='flex items-center gap-5 text-white bg-arzumaRed px-2 rounded-md' id={'chart-view'} title='+'>
                    <GraficosForm isPending={isPendingNewChart} setConfig={setConfigNewChart} error={newChartError} />
                </Dropdown>

            </div>
            {charts ? <div className='overflow-auto w-full h-full  flex-wrap flex gap-4'>

                {charts.map(chart => {

                    let chartsToRender = [];

                    switch (chart.type) {
                        case "radial":
                            chartsToRender.push(<ChartRadial data={chart.data} />)
                            break;
                        case "bar":
                            chartsToRender.push(<ChartBar data={chart.data} />)
                            break;

                        default:
                            break;
                    }
                    return chartsToRender.map(element => <ChartWrapper title={chart.title}>{element}</ChartWrapper>)


                })}


            </div> : <p className='flex gap-4   w-full h-full'>cargando...</p>}
        </div>
    )
}
