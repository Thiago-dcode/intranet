import React, { useState } from 'react'
import { useEffect } from 'react';
import useAjax from '../../../../hooks/useAjax';
import { roundTo } from '../../../../utils/Utils';

export default function RenderTd({ company, _key, value, i, handleForm }) {
    const [desahabilitado, setDeshabilitado] = useState([]);
    const [categoriaWeb, setCategoriaWeb] = useState(null)
    const [idCatWeb, setIdCatWeb] = useState(null);
    const [allowed, setAllowed] = useState(false);
    const [fetchCategoriaWeb, error, isPending, setConfig] = useAjax();

    const printTree = (tree, __tree = []) => {


        let _tree = __tree;


        for (let i = 0; i < tree.length; i++) {

            let obj = {

                id: tree[i].id,
                name: tree[i].name,
            }
            _tree.push(obj);

            if (!tree[i].children) continue;

            printTree(tree[i].children, _tree)


        }

        return _tree;




    }

    const handlePrice = (i) => {

        const descuento = document.getElementById(`${i}-descuento`);
        const precio = document.getElementById(`${i}-precio`);
        const pcoste = document.getElementById(`${i}-p.coste`);
        const margen = document.getElementById(`${i}-margen`);
        const pventa = document.getElementById(`${i}-P.V.A`);

        pcoste.value = roundTo(parseFloat(!precio.value ? 0 : precio.value) / 100 * (100 - parseFloat(!descuento.value ? 0 : descuento.value)), 2);

        pventa.value = roundTo(parseFloat(pcoste.value) + pcoste.value * (parseFloat(!margen.value ? 0 : margen.value) / 100), 2);



    }
    const handleChange = (i, key, value) => {

        switch (key) {
            case 'hombre/mujer':
                setIdCatWeb(`${i}-cat.web`)
                setConfig(`/api/${company.name}/modules/combinaciones/categoriaweb?id=${value}`)
                break;

            default:
                break;
        }



    }

    useEffect(() => {

        if (fetchCategoriaWeb && !error) {

            setCategoriaWeb(printTree(fetchCategoriaWeb.data));
        }


    }, [fetchCategoriaWeb, error])
    useEffect(() => {

        if (_key !== 'T_cat.web') return;

        setCategoriaWeb(printTree(value.data));

    }, [_key]);




    useEffect(() => {

        if (categoriaWeb && idCatWeb) {

            const catWebSelect = document.getElementById(idCatWeb);


            const options = categoriaWeb.map(cat => {
                const option = document.createElement('option');
                option.classList.add('w-full')
                option.value = cat.id
                option.textContent = cat.name

                return option;

            })

            catWebSelect.replaceChildren(...options)

        }

    }, [categoriaWeb])

    const renderTd = (_key, value, i) => {


        const [type, key] = _key.split('_');

        // according to the key, the value will render different(input, select, radio...)
        // all keys from the api start with  S,A,T,OR C 
        // S: The value of that key is a simple string or number.
        // A: The value is an Array.
        // T: The value is a Tree.
        // C: The value depends on combinations.
        //D : Is the desahabilitado field
        const readonlyStyle = {

            'background': 'rgba(0,0,0,0.3)',
            color: 'white',
            borderRadius: '5px'

        }


        switch (type) {


            case 'S':

                return (
                    <td className=" W-10 px-1 border border-slate-300  text-center ">


                        <input id={`${i}-${key}`} onChange={(e) => {

                            if (key === 'precio' || key === 'descuento' || key === 'margen') {
                                handlePrice(i)
                            }

                        }} style={value.readonly ? readonlyStyle : {}} title={value.data} readOnly={value.readonly} name={`${i}-${key}`} className="w-full  text-[0.5rem]" type="text" defaultValue={value.data} />


                    </td>
                );


            case 'A':

                return (

                    <td className="px-1 border-slate-300  text-center ">
                        <select name={`${i}-${key}`} onChange={(e) => {

                            setAllowed(true)
                            handleChange(i, key, e.target.value)

                            handleForm(i, key, e.target.value);

                        }} className='w-10 text-xs' defaultValue={value.id} id="">

                            {
                                Array.isArray(value.data) && value.data.map(obj => {

                                    return <option className='w-full' value={obj.CODIGO}>{obj.NOMBRE}</option>

                                })
                            }
                        </select>
                        {/* <input title={key[0] === '%' || key[0] === '#' ? value : null} readOnly name={`${i}-${key}`} className="w-full text-xs" type="text" defaultValue={value} /> */}
                    </td>
                )


            case 'T':
                let tree = null;
                if (key !== 'cat.web' && !allowed) {

                    tree = printTree(value.data);

                }
                else {
                    tree = categoriaWeb;
                }


                return (

                    <td className="px-1 border-slate-300  text-center ">
                        {Array.isArray(tree) && <select id={`${i}-${key}`} name={`${i}-${key}`} onChange={(e) => {

                            handleForm(i, key, e.target.value);

                        }} className='w-10' defaultValue={value.id} >

                            {
                                tree.map(branch => {

                                    return <option className='w-full' value={branch.id}>{branch.name}</option>

                                })
                            }

                        </select>}
                    </td>
                )


            case 'D':


                return (
                    <td className="   overflow-auto  flex flex-col w-full px-1 border border-slate-300  text-center justify-between relative ">


                        {Array.isArray(value.data) && <select onChange={(e) => {

                            setDeshabilitado(prev => [e.target.value, ...prev])

                        }} className='right-[0.02rem]   hover::invisible overflow-auto  h-5 w-full flex flex-col items-center justify-start' >
                            <option value="" disabled hidden>Select</option>

                            {
                                value.data.filter(data => !desahabilitado.includes(data)).map(data => {

                                    return <option value={data}>{data}</option>
                                })


                            }

                        </select>}
                        <ul className=' w-full flex  gap-[0.1rem] flex-col overflow-auto'>
                            {desahabilitado.map((d, _i) => {

                                return <li className='h-3 overflow-auto text-white flex flex-row items-center gap-1 bg-gray-400 rounded-sm px-0.5'>

                                    <button onClick={() => {

                                        const remove = desahabilitado.filter(_d => _d !== d)


                                        setDeshabilitado(remove);

                                    }} className='px-0.5 text-center border-r border-r-white'>x</button><input name={`${i}-${key}-${_i}`} type="text" className='text-center m-auto text-[0.4rem]' value={d} />

                                </li>
                            })}
                        </ul>

                    </td>
                );


            case 'C':

                console.log(key)
                return (
                    <td className=" w-12 h-10 overflow-auto px-1 border border-slate-300  text-center ">

                        <div className='w-full h-full hover:h-14 items-center overflow-auto flex-col justify-center'>
                            {value.data.map((data, _i) => {
                                if (key === 'codbar') {
                                    return <input title={data.VALORCARACT} name={`${i}-${key}-${data.VALORCARACT}`} className='w-10 max-h-2 mr-2' type="text" value={data.CODBARRAS} />
                                }
                                return <input title={data.VALORCARACT} name={`${i}-${key}-${data.VALORCARACT}`} className='w-10 max-h-2' type="text" placeholder={data.VALORCARACT} value={data.hasPrice ? data.PRECIO : null} />
                            })}
                        </div>

                    </td>
                );


            default:

                return (
                    <td className=" W-10 px-1 border border-slate-300  text-center ">

                        <div className='overflow-auto'>
                            <input title={value} readOnly name={`${i}-${key}`} className="w-full  text-[0.7rem]" type="text" defaultValue={value} />
                        </div>

                    </td>
                );
        }


    }
    return (

        renderTd(_key, value, i)
    )
}
