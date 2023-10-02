import React, { useState } from 'react'

export default function ChartConfigForm() {
    const [config, setConfig] = useState();

    return (
        <div>
            <input name='dataKey' placeholder={'El nombre de cada barra'} type="text" />

            <label htmlFor="min">Min</label>
            <input name='min' placeholder='valor mínimo de Y' type="number" value={0} />
            <label htmlFor="max">Max</label>
            <input name='max' placeholder='valor máximo de Y' type="number" />
            <div>
                <h3>Barras</h3>
                <div>
                    <input placeholder='Campo de la sql para mostrar en la barra' type="text" />
                    <input placeholder='Color de la barra' type="text" />
                </div>

                <button>+</button>

            </div>
        </div>
    )
}
