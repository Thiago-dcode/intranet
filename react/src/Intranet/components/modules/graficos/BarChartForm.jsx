import React, { useEffect, useState } from 'react'
import { BlockPicker } from 'react-color'
import Dropdown from '../../dropdown/Dropdown';
export default function BarChartForm({ isPending, setConfig, chart }) {
    const [color, setColor] = useState('')
    const [formBar, setFormBar] = useState({
        datakey: '',
        min: 0,
        max: null,
        data: [
            { bardata: '', color: '' }

        ]
    });
    const handleSubmit = (e) => {
        e.preventDefault()
        console.log({
            title: chart.title,
            sql: chart.sql,
            type: chart.type,
            config: JSON.stringify(formBar)


        });
        setConfig('/api/modules/graficos/' + chart.id, {
            title: chart.title,
            sql: chart.sql,
            type: chart.type,
            config: JSON.stringify(formBar)


        }, 'PATCH')
    }


    const handleBarForm = (e) => {
        console.log(e)

        const key = e.target.name
        const value = e.target.value

        let form = formBar
        switch (key) {

            case 'bardata':
                form.data[0][key] = value;
                break;

            default:
                form[key] = value;
                break;
        }
        console.log(color)
        form.data[0]['color'] = color;
        setFormBar(form);
        console.log(form)





    }

    useEffect(() => {
        let form = formBar
        form.data[0]['color'] = color;
        setFormBar(form);
    }, [color])

    return (

        <>


            {chart.data &&


                <form className=' w-full flex flex-col items-start p-2 gap-2' onSubmit={(e) => {
                    handleSubmit(e)
                }}>
                    <h2 className='text-white font-bold self-center'>Configura {chart.title}</h2>
                    {chart.type === 'bar' && <>
                        <label className='text-white' htmlFor="datakey">Campo nombre</label>
                        <select required onChange={handleBarForm} name="datakey" id=""> <option value="">-</option>{
                            Object.keys(chart?.data[0]).map(key => {

                                return <option value={key}>{key}</option>
                            })
                        }</select>
                        <div className='flex items-start flex-col gap-1 w-full'>
                            <label className='text-white' htmlFor="min">Min Y</label>
                            <input onChange={handleBarForm} className='w-20 pl-2' name='min' type="number" />
                        </div>
                        <div className='flex items-start flex-col gap-1 w-full' >
                            <label className='text-white' htmlFor="max">Max Y</label>
                            <input onChange={handleBarForm} className='w-20' name='max' type="number" />
                        </div>

                        <div className='w-full border border-white px-1 pb-1' >
                            <h3 className='text-white align-baseline font-bold' >Barra info: </h3>
                            <div className='flex flex-row items-end justify-between w-full'>

                                <div className='flex lef witems-start flex-col ' >
                                    <label className='text-white' htmlFor="bardata">Campo</label>
                                    <select required onChange={handleBarForm} name="bardata" id="">  <option value="">-</option>{
                                        Object.keys(chart?.data[0]).map(key => {

                                            return <option value={key}>{key}</option>
                                        })
                                    }</select>

                                </div>


                                <Dropdown classNameDrop='w-44  -left-24 bg-red z-[99]  flex-row ' classNameBtn={`self-end bg-white flex flex-row items-center gap-2 px-2`} title={color ? color : 'Color'} id={'color-input-' + chart.id}>
                                    <input type="hidden" name='color' value={color} onChange={(e) => { handleBarForm(e) }} />
                                    <BlockPicker color={color} onChange={(color) => {
                                        document.querySelector('#color-input-' + chart.id + ' .container').classList.remove('show')
                                        setColor(color.hex)
                                    }

                                    }
                                    />

                                </Dropdown>

                            </div>


                        </div></>}

                    { !isPending ? (<button className='bg-arzumaRed self-center px-2 text-white rounded-md'>Configurar</button>): <p className='bg-arzumaRed self-center px-2 text-white rounded-md'> Submitting...</p>}

                </form>
            }
        </>
    )
}
