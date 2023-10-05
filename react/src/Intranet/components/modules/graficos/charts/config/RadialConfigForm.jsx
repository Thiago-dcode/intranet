import React, { useEffect, useState } from 'react'
import { BlockPicker } from 'react-color'
import Dropdown from '../../../../dropdown/Dropdown';
import { config } from '@fortawesome/fontawesome-svg-core';
export default function RadialChartForm({ chart, setForm }) {


    const [formRadial, setFormRadial] = useState({
        comparar: '',
        nombre: 0,
        objetivo: null,

        bardata: ''


    });
    const handleRadialForm = (e) => {

        const key = e.target.name
        const value = e.target.value

        let form = formRadial
        form[key] = value.trim();

        if (!form['nombre']) {
            form['nombre'] = 'Objectivo'
        }
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

        if (!chart.config) return
        
        const config = JSON.parse(chart.config)
        setFormRadial({

            comparar: config?.comparar ? config?.comparar : 'Actual',
            nombre: config?.nombre ? config?.nombre : 'Objetivo',
            objetivo: config?.objetivo,
            datakey: Object.keys(chart.data[0])[0]



        })
      

    }, [chart])
   

    return (

        <>



            <div className='flex items-start flex-col gap-1 w-full'>
                <label className='text-white' htmlFor="comparar">Nombre del campo a comparar</label>
                <input onChange={handleRadialForm} className=' w-full pl-2' name='comparar' placeholder={formRadial?.comparar ? formRadial?.comparar : 'Actual'} type="text" />
            </div>

            <div className='flex items-start flex-col gap-1 w-full'>
                <label className='text-white' htmlFor="nombre">Nombre del campo {'Objectivo'}</label>
                <input onChange={handleRadialForm} className=' w-full pl-2' name='nombre' placeholder={formRadial?.nombre ? formRadial?.nombre : 'Objectivo'} type="text" />
            </div>

            <div className='flex items-start flex-col gap-1 w-full'>
                <label className='text-white' htmlFor="objectivo"> Objetivo</label>
                <input onChange={handleRadialForm} className=' w-20 pl-2' name='objetivo' placeholder={formRadial?.objetivo ? formRadial?.objetivo : 0} type="number" />
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








        </>
    )
}
