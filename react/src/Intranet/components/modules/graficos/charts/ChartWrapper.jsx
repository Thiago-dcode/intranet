import React, { Children, useEffect } from 'react'
import Dropdown from '../../../dropdown/Dropdown'
import GraficosForm from '../GraficosForm'
import Icon from '../../../icon/Icon'
import useAjax from '../../../../../hooks/useAjax'
export default function ChartWrapper({handleEdit, _handleDelete, chart, title, children }) {

  const [chartEdited, errorChartEdited, isPendingChartEdited, setConfigChartEdited] = useAjax();
  const [chartDelete, error, isPending, setConfig] = useAjax();

  const handleDelete = e => {
    e.preventDefault()

    setConfig('/api/modules/graficos/'+chart.id,{},'DELETE');
    
  }


useEffect(()=>{

  if(chartEdited){

    handleEdit(chartEdited.data)

  }
  if(errorChartEdited){
   
  }


},[chartEdited,errorChartEdited])
useEffect(()=>{

    if(chartDelete){
      _handleDelete(chart)
    }

},[chartDelete,error])

useEffect(()=>{

},[chart])

  return (
    <div className='flex items-center flex-col bg-white border-4  rounded-md w-full h-2/3 lg:w-[49%]'>
      <div className='w-full flex flex-row items-center justify-center px-3'>
        <h2 className='w-full'>{title}</h2>
        <div className='justify-self-end w-full flex flex-row items-center gap-3'>

          <Dropdown id={`edit-chart-${chart.id}`} Element={<Icon className={'self-end'} icon={'Wrench'} />} arrow={false} title={"edit"} classNameBtn='z-50 self-end' >
            <GraficosForm cleanField={true} id={`edit-chart-${chart.id}`} isPending={isPendingChartEdited} error={errorChartEdited} setConfig={setConfigChartEdited} url={`/api/modules/graficos/${chart.id}`} method='PATCH' titleBtn='Editar' titleVal={chart.title} sqlVal={chart.sql} titleForm={`Edita gráfico ${chart.title}`} idDrop={`chart-type-edit-${chart.id}`} classNameDrop='top-8 bg-white  rounded-md gap-2 p-2 w-full border border-black' />
          </Dropdown>
          <form onSubmit={(e)=>{
            handleDelete(e)
          }} className='flex items-center' action="">

            <button type='submit'><Icon icon={'Trash'} /></button>
          </form>
        </div>
      </div>
      {children}</div>
  )
}
