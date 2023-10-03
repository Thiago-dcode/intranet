import React, { Children, useEffect, useState } from 'react'
import Dropdown from '../../../dropdown/Dropdown'
import GraficosForm from '../GraficosForm'
import Icon from '../../../icon/Icon'
import BarChartForm from '../BarChartForm'
import useAjax from '../../../../../hooks/useAjax'
export default function ChartWrapper({ id, handleEdit, _handleDelete, chart, title, children }) {

  const [chartEdited, errorChartEdited, isPendingChartEdited, setConfigChartEdited] = useAjax();
  const [chartDelete, error, isPending, setConfig] = useAjax();
  const [configForm, setConfigForm] = useState(null);
  const [currentChart, setCurrentChart] = useState(chart);

  const handleDelete = e => {
    e.preventDefault()

    setConfig('/api/modules/graficos/' + currentChart.id, {}, 'DELETE');

  }




  useEffect(() => {

    if (chartEdited) {
      console.log(chartEdited)
      handleEdit(chartEdited.data)
      setCurrentChart(chartEdited.data)
      setCurrentChart(chartEdited.data)

    }
    if (errorChartEdited) {

    }


  }, [chartEdited, errorChartEdited])
  useEffect(() => {

    if (chartDelete) {
      _handleDelete(currentChart)
    }

  }, [chartDelete, error])

  useEffect(() => {

    setCurrentChart(chart)

  }, [chart])

  return (

    <div id={`chartwrapper-${id}`} className='flex items-center flex-col bg-white border-4  rounded-md w-full h-2/3 lg:w-[49%]'>
      <div className='w-full flex flex-row items-center justify-center px-3'>
        <h2 className='w-full'>{title}</h2>
        <div >
          <>
            {currentChart &&

              <div className='w-full flex flex-row items-center gap-3 '>


                <Dropdown classNameDrop='-left-96  px-2 w-96 j flex flex-col bg-black/70 rounded-md' id={`edit-chart-${currentChart.id}`} Element={<Icon className={'self-end'} icon={'PenToSquare'} />} arrow={false} title={"edit"} classNameBtn='z-50 self-end' >
                  <GraficosForm cleanField={false} id={`edit-chart-${currentChart.id}`} isPending={isPendingChartEdited} error={errorChartEdited} setConfig={setConfigChartEdited} url={`/api/modules/graficos/${currentChart.id}`} method='PATCH' titleBtn='Editar' titleVal={currentChart.title} sqlVal={currentChart.sql} titleForm={`Edita gráfico ${currentChart.title}`} idDrop={`chart-type-edit-${currentChart.id}`} classNameDrop='top-8 bg-white  rounded-md gap-2 p-2 w-full border border-black' />
                </Dropdown>
                <Dropdown classNameDrop='-left-60  px-2 w-60 j flex flex-col bg-black/70 rounded-md' id={`config-chart-${chart.id}`} Element={<Icon className={'self-end '} icon={'Wrench'} />} arrow={false} title={"config"} classNameBtn='z-10 self-end' >

                  {currentChart.type === 'bar' && <BarChartForm isPending={isPendingChartEdited} setForm={setConfigForm} setConfig={setConfigChartEdited} chart={currentChart} />}



                </Dropdown>
                <form onSubmit={(e) => {
                  handleDelete(e)
                }} className='flex items-center' action="">

                  <button type='submit'><Icon icon={'Trash'} /></button>
                </form>
              </div>
            }
          </>
        </div>
      </div>
      {children}</div>

  )
}
