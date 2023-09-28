import React, { useEffect, useState } from 'react'
import useAjax from '../../../../hooks/useAjax';
import Icon from '../../icon/Icon';
import Dropdown from '../../dropdown/Dropdown';
export default function GraficosForm() {
    const [chartTypes, chartTypesError, isPendingChartTypes] = useAjax('/api/modules/graficos/types');
    const [type, setType] = useState('');
    const [sql, setSql] = useState('');
    const [dropTitle, setDropTitle] = useState('Tipo de gráfico');
    const handleType = (value) => {

       
        setType(value)
        setDropTitle(value)
       document.querySelector(`#chart-form .container`).classList.remove('show');

    }
    const handleSubmit = (e) => {
        e.preventDefault();
    }
    return (
        <>
            {chartTypes ?
                (<form onSubmit={(e) => {
                    handleSubmit(e)
                }} className="flex flex-col items-center  w-full gap-4">
                    <h2 className='text-white text-lg font-semibold capitalize w-full rounded-md pl-2'>Crear tu propio gráfico.</h2>
                    <Dropdown classNameDrop='absolute top-8 bg-white  flex flex-col rounded-md gap-2 p-2 w-full container border border-black' id={'chart-form'} title={dropTitle}>

                        {chartTypes.data?.map(chartType => {

                            return (
                                <button type='submit' onClick={(e) => {

                                    handleType(chartType.type)


                                }} name='type' value={chartType.type} className='hover:bg-slate-500 hover:text-white flex items-center  justify-between p-2 '>
                                    <Icon icon={chartType.icon} />
                                    <span className='text-left ml-2 w-full'>{chartType.type}</span>


                                </button>
                            )
                        })}

                    </Dropdown>
                    <div className='flex flex-col gap-1 w-full'>

                        <textarea onChange={(e) => {
                            setSql(e.target.value)
                        }} className='p-5' placeholder="Escribe tu SQL" name="sql" id="sql" cols="5" rows="5"></textarea>
                    </div>

                    <button className=' border-white bg-arzumaRed w-20 rounded-md text-white'>Crear</button>
                </form>) : <div>Loading</div>}
        </>
    )
}
