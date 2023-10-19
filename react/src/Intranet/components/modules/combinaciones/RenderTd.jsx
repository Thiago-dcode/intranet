import React from 'react'

export default function RenderTd({ key, value }) {

    const renderTd = (key, value) => {

        switch (key) {
          
            default:

                return (
                    <td style={{
                        maxWidth: key[0] === '%' || key[0] === '#' ? '200px' : '100px'

                    }} key={'td-combinaciones-' + key + '-' + i} id={"td-2-" + i} className="px-1 border border-slate-300  text-center ">
                        <input title={key[0] === '%' || key[0] === '#' ? value : null} readOnly name={`${_i}-${key}`} className="w-full text-xs" type="text" defaultValue={value} />
                    </td>
                );
        }


    }
    return (

        renderTd(key, value)
    )
}
