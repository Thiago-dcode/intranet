import React, { useEffect, useState } from 'react'
import { BlockPicker } from 'react-color'
import Dropdown from '../../../../dropdown/Dropdown';
import { config } from '@fortawesome/fontawesome-svg-core';
export default function RadialChartForm({ chart, chartConfig, setForm }) {


    const [formRadial, setFormRadial] = useState({
        datakey: '',
        nombre: 0,
        objetivo: null,

        bardata: ''


    });
    const handleRadialForm = (e) => {

        const key = e.target.name
        const value = e.target.value

        let form = formRadial
        form[key] = value;


        setFormRadial(form);


    }

    // useEffect(() => {

    //     let form = formRadial
    //     form.data[0]['color'] = color;
    //     setFormRadial(form);
    // }, [color])

    useEffect(() => {

        setForm(formRadial)
    }, [formRadial])



    useEffect(() => {

        if (!chartConfig) return
        setFormRadial({


            datakey: chartConfig?.datakey,
            nombre: chartConfig?.nombre,
            objetivo: chartConfig?.objetivo,
            bardata: chartConfig?.bardata


        })
        // setColor(chartConfig.data[0].color)

    }, [chartConfig])

    return (

        <>



            <label className='text-white' htmlFor="datakey">Campo nombre</label>
            <select required onChange={handleRadialForm} name="datakey" id=""> <option value="">-</option>{
                Object.keys(chart?.data[0]).map(key => {

                    return <option selected={chartConfig?.datakey === key ? true : false} value={key}>{key}</option>
                })
            }</select>
            <div className='flex items-start flex-col gap-1 w-full'>
                <label className='text-white' htmlFor="min">Nombre campo Objetivo</label>
                <input onChange={(e) => { handleRadialForm(e) }} className='w-20 pl-2' name='nombre' placeholder={chartConfig?.nombre ? chartConfig?.nombre : 'Objetivo'} type="text" />
            </div>
            <div className='flex items-start flex-col gap-1 w-full'>
                <label className='text-white' htmlFor="min">{chartConfig?.nombre ? chartConfig?.nombre : 'Objetivo'}</label>
                <input onChange={handleRadialForm} className='w-20 pl-2' name='objetivo' placeholder={chartConfig?.objetivo ? chartConfig?.objetivo : 0} type="number" />
            </div>

            <div className='w-full border border-white px-1 pb-1' >
               

                    <div className='flex lef witems-start flex-col ' >
                        <label className='text-white' htmlFor="bardata">Campo número</label>
                        <select required onChange={handleRadialForm} name="bardata" id="">  <option value="">-</option>{
                            Object.keys(chart?.data[0]).map(key => {

                                return <option selected={chartConfig?.bardata === key ? true : false} value={key}>{key}</option>
                            })
                        }</select>

                    </div>


                    {/* <Dropdown classNameDrop='w-44   bg-red z-[99]  flex-row ' classNameBtn={`self-end bg-white flex flex-row items-center gap-2 px-2`} title={color ? color : 'Color'} id={'color-input-' + chart.id}>
                        <input type="hidden" name='color' value={color} onChange={(e) => { handleRadialForm(e) }} />
                        <BlockPicker color={color} onChange={(color) => {
                            document.querySelector('#color-input-' + chart.id + ' .container').classList.remove('show')
                            setColor(color.hex)
                        }

                        }
                        />

                    </Dropdown> */}

               


            </div>



        </>
    )
}
