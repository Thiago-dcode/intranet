import React, { Children, useEffect, useState } from 'react'
import Dropdown from '../../../dropdown/Dropdown'
import GraficosForm from '../GraficosForm'
import Icon from '../../../icon/Icon'
import ConfigWrapper from './config/ConfigWrapper'
import useAjax from '../../../../../hooks/useAjax'
import PopUp from '../../eans/PopUp'
export default function ChartWrapper({ id, handleEdit, _handleDelete, chart, title, children }) {

  const [chartEdited, errorChartEdited, isPendingChartEdited, setConfigChartEdited] = useAjax();
  const [style, setStyle] = useState({})
  const [chartDelete, error, isPending, setConfig] = useAjax();
  const [showPoPUp, setShowPopUp] = useState(false);
  const [currentChart, setCurrentChart] = useState(chart);


  const handleDelete = e => {
    e.preventDefault()
    const btn = e.nativeEvent.submitter;


    if (btn.name === 'cancelar') {
      setShowPopUp(false)
      return
    }

    setConfig('/api/modules/graficos/' + currentChart.id, {}, 'DELETE');
    if (chartDelete && !error && !isPending) {
      setShowPopUp(false)
    }

  }
  useEffect(() => {
    const configEl = document.querySelector(`#config-chart-${chart.id} .container`)
    if (!configEl.classList.contains('show')) return
    if (chartEdited && !errorChartEdited && !isPendingChartEdited) {

      configEl.classList.remove('show')
    }


  }, [chartEdited, errorChartEdited, isPendingChartEdited])

  const handleStyle = (type) => {


    switch (type) {
      case 'bar':
        setStyle({
          height: '250px',
          width: '400px'
        })
        break;
      case 'radial':
        setStyle({
          height: '250px',
          width: '250px'
        })
        break;

      default:
        break;
    }
  }


  useEffect(() => {

    if (chartEdited) {
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

    handleStyle(chart.type)

  }, [chart])
  useEffect(() => {

  }, [isPending])
  useEffect(() => {

    if (!showPoPUp) {

      document.getElementById(`chart-popup-${chart.id}`).style.display = 'none'
      return
    }
    document.getElementById(`chart-popup-${chart.id}`).style.display = 'flex'

  }, [showPoPUp])

  return (

    <div style={style} id={`chartwrapper-${id}`} className={`text-xs flex flex-col bg-white border-4  rounded-md p-2`}>
      <div className='w-full flex flex-row items-center justify-center px-2'>
        <h2 className='w-full'>{title}</h2>
        <div >
          <>
            {currentChart &&

              <div className='w-full flex flex-row items-center gap-3 '>


                <Dropdown classNameDrop='-left-96  px-2 w-96 j flex flex-col bg-black/70 rounded-md' id={`edit-chart-${currentChart.id}`} Element={<Icon className={'self-end'} icon={'PenToSquare'} />} arrow={false} title={"edit"} classNameBtn='z-50 self-end' >
                  <GraficosForm cleanField={false} id={`edit-chart-${currentChart.id}`} isPending={isPendingChartEdited} error={errorChartEdited} setConfig={setConfigChartEdited} url={`/api/modules/graficos/${currentChart.id}`} method='PATCH' titleBtn='Editar' titleVal={currentChart.title} sqlVal={currentChart.sql} titleForm={`Edita gráfico ${currentChart.title}`} idDrop={`chart-type-edit-${currentChart.id}`} classNameDrop='top-8 bg-white  rounded-md gap-2 p-2 w-full border border-black' />
                </Dropdown>
                <Dropdown classNameDrop='-left-60  px-2 w-60 j flex flex-col bg-black/70 rounded-md' id={`config-chart-${chart.id}`} Element={<Icon className={'self-end '} icon={'Wrench'} />} arrow={false} title={"config"} classNameBtn='z-10 self-end' >



                  <ConfigWrapper chart={chart} setConfig={setConfigChartEdited} isPending={isPendingChartEdited} />


                </Dropdown>
                <div className='flex items-center' action="">

                  <button onClick={() => {

                    setShowPopUp(!showPoPUp);

                  }} type='button'><Icon icon={'Trash'} /></button>


                </div>
                <PopUp id={`chart-popup-${chart.id}`} isPending={isPending} confirmMessage={'Procesando...'} message={`Realmente deseas borrar el gráfico ${chart.title}?`} handleSubmit={handleDelete} />


              </div>
            }
          </>
        </div>
      </div>
      {children}</div>

  )
}
