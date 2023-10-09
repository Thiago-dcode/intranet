import React, { useEffect, useState } from 'react';
import '../../assets/css/modules/graficos.css'
import { useNavigate } from 'react-router-dom';
import useAjax from '../../../hooks/useAjax';
import Dropdown from '../../components/dropdown/Dropdown';
import { ChartBar, ChartRadial } from '../../components/modules/graficos/charts/Charts';
import ChartWrapper from '../../components/modules/graficos/charts/ChartWrapper';
import GraficosForm from '../../components/modules/graficos/GraficosForm';
import { useCompany } from "../../../Context/ContextProvider";
export default function Graficos() {
    const navigate = useNavigate();
    const company = useCompany();
    const [userCharts, userChartsError, isPendingUserCharts] = useAjax(`/api/${company}/modules/graficos`);
    const [charts, setCharts] = useState(null);
    const [chart, setChart] = useState();
    const [newChart, newChartError, isPendingNewChart, setConfigNewChart] = useAjax();


    const handleEdit = (chartEdited) => {

        let chartsUpdated = charts.map(chart => {

            if (chart.id === chartEdited.id) {
                return chartEdited
            }
            return chart

        })

        setCharts(chartsUpdated);

    }
    const handleDelete = (chartToDelete) => {

        let chartsUpdated = charts.filter(chart => chart.id !== chartToDelete.id)

        setCharts(chartsUpdated);

    }

    useEffect(() => {

        if (!company) {

            navigate('/bienvenido')
        }

    }, [company])

    useEffect(() => {

        if (userCharts) {


            setCharts(userCharts.data)
        }
        if (userChartsError) {

        }



    }, [userCharts, userChartsError])

    useEffect(() => {
        setChart(null)

        if (newChartError) {

            setChart(null);
            return
        }

        if (newChart) {

            let exist = false
            if (!charts) {
                setChart(newChart.data)
                return
            }
            for (let index = 0; index < charts.length; index++) {
                const element = charts[index];


                exist = false
                if (element.id === newChart.data.id) {
                    exist = true
                    break
                }


            }
            if (!exist) {

                setChart(newChart.data)
            }

        }

    }, [newChart, newChartError])


    useEffect(() => {

    }, [charts])
    useEffect(() => {

        if (!chart) return

        setCharts(prev => [chart, ...prev])


    }, [chart])
    return (

        <div className='overflow-auto mt-5 px-5 flex flex-col  w-full  h-full mb-20 gap-4'>

            <div className='w-full max-w-3xl flex items-center justify-center'>
                <Dropdown arrow={false} classNameBtn='flex items-center gap-5 text-white bg-arzumaRed px-2 rounded-md' id={'chart-view'} title='+'>
                    <GraficosForm id={'chart-view'} result={newChart} isPending={isPendingNewChart} setConfig={setConfigNewChart} error={newChartError?.data} />
                </Dropdown>

            </div>



            {charts !== null && charts.length > 0 ? <div className=' justify-center  gap-2  flex-wrap flex '>

                {charts.map(chart => {

                    let chartsToRender = [];

                    if (!chart.config) {

                        chartsToRender.push(<div className='w-full h-full items-center flex justify-center mb-10'><button onClick={() => {

                            document.querySelector(`#config-chart-${chart.id} .container`).classList.add('show')

                        }} className='bg-arzumaBlack p-2 text-white rounded-md font-bold text-xl '> click para configurar gráfico tipo {chart.type}</button></div>)
                    }
                    else {
                        switch (chart.type) {
                            case "radial":
                                chartsToRender.push(<ChartRadial chart={chart} />)
                                break;
                            case "bar":
                                chartsToRender.push(<ChartBar chart={chart} />)
                                break;

                            default:
                                break;
                        }
                    }
                    return chartsToRender.map(element => <ChartWrapper _handleDelete={handleDelete} handleEdit={handleEdit} chart={chart} title={chart.title}>{element}</ChartWrapper>)


                })}


            </div> : null}

            {isPendingUserCharts && !userChartsError && <p className='flex gap-4  w-full h-full'>cargando...</p>}
            {!isPendingUserCharts && !userChartsError && Array.isArray(charts) && charts.length === 0 && <div className='text-black flex gap-4  justify-self-center w-full h-full'>No tienes ningún gráfico, empiezar creando uno.</div>}
        </div>
    )
}
